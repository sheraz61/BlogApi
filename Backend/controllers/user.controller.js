import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail.js'
import cloudinary from '../config/cloudinary.js'
//register user
const registerUser = async (req, res) => {
    try {
        const { name, username, password } = req.body;
        // Validation
        if (!name || !username || !password) {
            return res.status(400).json({ message: 'All fields are required', succss: false });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exist', succss: false });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            role: "user"
        });
        // Send response
        res.status(201).json({
            message: "User create Successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
            },
            succss: true
        });
    } catch (error) {
        console.error('CreateUser Error:', error);
        res.status(500).json({
            message: 'Server error',
            succss: false
        });
    }
};
//login user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required", succss: false });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username", succss: false });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password", succss: false });
        }
        // Save login history
        user.loginHistory.push({
            timestamp: new Date(),
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });
        await user.save();
        // Create JWT
        const token = await jwt.sign({ id: user._id }, process.env.jwt_Secret, {
            expiresIn: "1d",
        });
        // Send response
        res.status(200).cookie('token', token, { expiresIn: "1d", httpOnly: true }).json({
            message: "Login Successfully",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
            },
            succss: true
        });
    } catch (error) {
        console.error("LoginUser Error:", error);
        res.status(500).json({
            message: "Server error",
            succss: false
        });
    }
};
//logout
const logout = async (req, res) => {
    try {
        res.clearCookie("token", "", { expiresIn: new Date(Date.now()) });
        return res.status(200).json({
            message: "Logout successfully",
            success: true
        })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}
//add bio
const addBio = async (req, res) => {
    try {
        const userId = req.user; // From isAuth middleware
        const { bio } = req.body;
        if (!bio || bio.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Bio is required" });
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.bio && user.bio !== "Write your bio here...") {
            return res.status(400).json({ success: false, message: "Bio already exists. Use update instead." });
        }
        user.bio = bio;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Bio added successfully",
            bio: user.bio,
        });
    } catch (error) {
        console.error("Add Bio Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
//update bio
const updateBio = async (req, res) => {
    try {
        const userId = req.user; // From isAuth middleware
        const { bio } = req.body;
        if (!bio || bio.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Bio is required" });
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        user.bio = bio;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Bio updated successfully",
            bio: user.bio,
        });
    } catch (error) {
        console.error("Update Bio Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
//Upload profile image
const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user; // From isAuth middleware
        if (!req.file || !req.file.path) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Delete previous image from Cloudinary if it exists
        if (user.profileImage?.public_id) {
            await cloudinary.uploader.destroy(user.profileImage.public_id);
        }
        // Save new image details
        user.profileImage = {
            url: req.file.path,
            public_id: req.file.filename,
        };
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.error('Upload Image Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
//update profile image
const updateProfileImage = async (req, res) => {
    try {
        const userId = req.user; // From isAuth middleware
        if (!req.file || !req.file.path) {
            return res.status(400).json({ success: false, message: 'New image is required' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        //  Delete old image if exists
        if (user.profileImage?.public_id) {
            await cloudinary.uploader.destroy(user.profileImage.public_id);
        }
        // 🆕 Save new image
        user.profileImage = {
            url: req.file.path,
            public_id: req.file.filename,
        };
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Profile image updated successfully',
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.error('Update Profile Image Error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
//delete profile image
const deleteProfileImage = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (!user.profileImage?.public_id) {
            return res.status(400).json({ success: false, message: 'No profile image to delete' });
        }
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(user.profileImage.public_id);
        // Clear from DB
        user.profileImage = { url: "", public_id: "" };
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile image deleted successfully",
        });
    } catch (error) {
        console.error('Delete Image Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
//delete account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            message: "Account deleted successfully",
            success: true,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", success: false });
    }
};
//get user profile
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId).select('-password -__v -loginHistory -email -role -resetPassword -emailVerification')
        if (!user) {
            res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "User Fetch Successfully",
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}
//edit profile details
const editUserProfile = async (req, res) => {
    try {
        const userId = req.user; // You get this from auth middleware
        const { username, name } = req.body;

        if (!username && !name) {
            return res.status(400).json({
                success: false,
                message: "Please provide username or name to update.",
            });
        }

        const user = await User.findById(userId).select("-password -resetPassword -emailVerification");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (username) user.username = username;
        if (name) user.name = name;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
            },
        });
    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error while updating profile.",
        });
    }
};
//change password
const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user;
        if (!newPassword) {
            return res.status(401).json({
                message: "New password required",
                success: false
            })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not Found",
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({
            message: "Password updated Scuccessfully",
            success: true
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false });
    }
}
//add email
const addEmail = async (req, res) => {
    try {
        const userId = req.user;
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({
                message: "Email required",
                success: false
            })
        }
        const existedEmail = await User.findOne({ email })
        if (existedEmail) {
            return res.status(401).json({
                message: "Email Already  exist please use different email",
                success: false
            })
        }
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
                success: false
            })
        }
        const now = new Date();
        const oneHour = 60 * 60 * 1000;
        if (
            user.emailVerification &&
            user.emailVerification.firstAttemptAt &&
            now - user.emailVerification.firstAttemptAt > oneHour
        ) {
            user.emailVerification.attempts = 0;
            user.emailVerification.firstAttemptAt = now;
        }
        // Check if too many attempts
        if (user.emailVerification?.attempts >= 5) {
            return res.status(429).json({
                message: "Too many attempts. Try again after one hour.",
                success: false,
            });
        }
        // 4-digit code generation
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        // Store code and expiry (15 min)
        user.emailVerification = {
            code: verificationCode,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            attempts: (user.emailVerification?.attempts || 0) + 1,
            firstAttemptAt: user.emailVerification?.firstAttemptAt || now,
        };
        user.unverifyEmail = email; // Temporarily set email (unverified)
        await user.save();
        const html = `
        <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #000; background-color: #fff; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="text-align: center; color: #000;">Email Verification</h2>
          <p>Hi <strong>${user.username}</strong>,</p>
          <p>We received a request to verify your email address. Please use the verification code below:</p>
          <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; padding: 10px; border: 1px dashed #000; background-color: #f9f9f9;">
            ${verificationCode}
          </div>
          <p>This code is valid for <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this message.</p>
          <p>Thanks,<br/>The Blog App Team</p>
        </div>
      `;
        const sent = await sendEmail(email, "Verify Your Email", html);
        if (!sent) {
            return res.status(500).json({ message: "Failed to send email", success: false });
        }
        res.status(200).json({
            message: "Verification email sent successfully.",
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false });
    }
}
const cancelAddEmail = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User Not found",
                success: false
            })
        }
        user.emailVerification = undefined;
        user.unverifyEmail = undefined;
        await user.save();
        return res.status(200).json({
            message: "Request Cancel Successfully",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            success: false
        })
    }
}
//verify email
const verifyEmailCode = async (req, res) => {
    try {
        const userId = req.user;
        const { code } = req.body;
        const user = await User.findById(userId);
        if (!user || !user.emailVerification) {
            return res.status(400).json({ message: "Invalid request", success: false });
        }
        const { code: savedCode, expiresAt } = user.emailVerification;
        if (Date.now() > new Date(expiresAt)) {
            return res.status(410).json({ message: "Verification code expired", success: false });
        }
        if (code !== savedCode) {
            user.emailVerification.attempts += 1;
            await user.save();
            return res.status(401).json({ message: "Incorrect code", success: false });
        }
        // Clear verification fields
        user.isVerified = true
        user.email = user.unverifyEmail;
        user.emailVerification = undefined;
        user.unverifyEmail = undefined;
        await user.save();
        const html = `
  <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #000; background-color: #fff; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="text-align: center; color: #000;">Email Successfully Added</h2>
    <p>Hi <strong>${user.username}</strong>,</p>
    <p>Your new email address <strong>${user.email}</strong> has been successfully added to your Blog App account.</p>
    <p>If you didn't make this change or believe this was done in error, please contact our support team immediately.</p>
    <p>Thank you,<br/>The Blog App Team</p>
  </div>
`;
        const sent = await sendEmail(user.email, "Email Verified Successfully", html);
        if (!sent) {
            return res.status(500).json({ message: "Email send failed", success: false });
        }
        res.status(200).json({ message: "Email verified successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: `${error}`, success: false });
    }
}
const changeEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.user;
        if (!newEmail) {
            return res.status(401).json({
                message: "New email required",
                success: false
            })
        }
        const existedEmail = await User.findOne({ email: newEmail })
        if (existedEmail) {
            return res.status(401).json({
                message: "Email already exist",
                success: false
            })
        }
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
                success: false
            })
        }
        const now = new Date();
        const oneHour = 60 * 60 * 1000;
        if (
            user.emailVerification &&
            user.emailVerification.firstAttemptAt &&
            now - user.emailVerification.firstAttemptAt > oneHour
        ) {
            user.emailVerification.attempts = 0;
            user.emailVerification.firstAttemptAt = now;
        }
        // Check if too many attempts
        if (user.emailVerification?.attempts >= 5) {
            return res.status(429).json({
                message: "Too many attempts. Try again after one hour.",
                success: false,
            });
        }
        // 4-digit code generation
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        // Store code and expiry (15 min)
        user.emailVerification = {
            code: verificationCode,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            attempts: (user.emailVerification?.attempts || 0) + 1,
            firstAttemptAt: user.emailVerification?.firstAttemptAt || now,
        };
        user.unverifyEmail = newEmail; // Temporarily set email (unverified)
        await user.save();
        const html = `
        <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #000; background-color: #fff; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="text-align: center; color: #000;">Email Verification</h2>
          <p>Hi <strong>${user.username}</strong>,</p>
          <p>We received a request to verify your email address. Please use the verification code below:</p>
          <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; padding: 10px; border: 1px dashed #000; background-color: #f9f9f9;">
            ${verificationCode}
          </div>
          <p>This code is valid for <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this message.</p>
          <p>Thanks,<br/>The Blog App Team</p>
        </div>
      `;
        const sent = await sendEmail(newEmail, "Verify Your New Email", html);
        if (!sent) {
            return res.status(500).json({ message: "Failed to send email", success: false });
        }
        res.status(200).json({
            message: "Verification email sent successfully.",
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: `server error`, success: false });
    }
}
//forget password
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(401).json({
                message: "Please enter email",
                success: false
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        // Rate limit: max 5 attempts/hour
        const now = Date.now();
        const lastAttempt = user.resetPassword?.lastAttemptAt?.getTime() || 0;

        if (now - lastAttempt < 60 * 60 * 1000 && user.resetPassword?.attempts >= 5) {
            return res.status(429).json({
                message: "Too many reset attempts. Try again in 1 hour.",
                success: false,
            });
        }
        // Generate code
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetPassword = {
            code,
            expiresAt: new Date(now + 15 * 60 * 1000),
            attempts: (lastAttempt && now - lastAttempt < 60 * 60 * 1000)
                ? user.resetPassword.attempts + 1
                : 1,
            lastAttemptAt: new Date(),
        };
        await user.save();
        const html = `
        <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #000; background-color: #fff; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="text-align: center; color: #000;">Password Reset Request</h2>
          <p>Hi <strong>${user.username}</strong>,</p>
          <p>We received a request to reset your password for your Blog App account. Please use the verification code below to proceed:</p>
          <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; padding: 10px; border: 1px dashed #000; background-color: #f9f9f9;">
            ${code}
          </div>
          <p>This code will expire in <strong>15 minutes</strong>. If you didn’t request a password reset, you can safely ignore this email.</p>
          <p>Stay secure,<br/>The Blog App Team</p>
        </div>
      `;
        const sent = await sendEmail(email, "Password Reset Code", html);
        if (!sent) {
            return res.status(500).json({ message: "Email send failed", success: false });
        }
        res.status(200).json({ message: "Reset code sent to email", success: true });
    } catch (error) {
        res.status(500).json({
            message: `Error : ${error}`,
            success: false
        })
    }
}
const verifyForgetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: "All fields required", success: false });
        }
        const user = await User.findOne({ email });
        if (!user || !user.resetPassword?.code) {
            return res.status(400).json({ message: "Invalid request", success: false });
        }
        if (user.resetPassword.code !== code) {
            return res.status(401).json({ message: "Incorrect code", success: false });
        }
        if (user.resetPassword.expiresAt < new Date()) {
            return res.status(410).json({ message: "Code expired", success: false });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        // Clear reset code
        user.resetPassword = undefined;
        await user.save();
        const html = `
  <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #000; background-color: #fff; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="text-align: center; color: #000;">Password Changed Successfully</h2>
    <p>Hi <strong>${user.username}</strong>,</p>
    <p>Your password was successfully changed on your Blog App account.</p>
    <p>If you didn’t request this change, we strongly recommend resetting your password immediately or contacting our support team.</p>
    <p>Stay secure,<br/>The Blog App Team</p>
  </div>
`;
        const sent = await sendEmail(email, "Password Reset Successfully", html);
        if (!sent) {
            return res.status(500).json({ message: "Email send failed", success: false });
        }
        res.status(200).json({ message: "Password reset successful", success: true });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: "Server error", success: false });
    }
};
const cancelForgetPasword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }
        const user = await User.findOne({ email });
        if (!user || !user.resetPassword) {
            return res.status(404).json({ message: "No active password reset request found", success: false });
        }
        user.resetPassword = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset request cancelled", success: true });
    } catch (err) {
        console.error("Cancel Reset Error:", err);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })
            .select('username name bio profileImage createdAt')
            .lean();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Optional: fetch user posts if needed
        // const posts = await Post.find({ author: user._id }).select('title createdAt').limit(5);
        res.status(200).json({
            success: true,
            user,
            // posts
        });
    } catch (error) {
        console.error("Public Profile Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
const getLoginHistory = async (req, res) => {
    try {
      const userId = req.user; // from isAuth middleware
      const user = await User.findById(userId).select("loginHistory");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.status(200).json({
        success: true,
        loginHistory: user.loginHistory.reverse(), // most recent first
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

export {
    registerUser,
    loginUser,
    deleteAccount,
    addBio,
    updateBio,
    editUserProfile,
    uploadProfileImage,
    updateProfileImage,
    deleteProfileImage,
    logout,
    getMyProfile,
    changePassword,
    forgetPassword,
    cancelForgetPasword,
    verifyForgetPassword,
    addEmail,
    verifyEmailCode,
    changeEmail,
    cancelAddEmail,
    getPublicProfile,
    getLoginHistory
}