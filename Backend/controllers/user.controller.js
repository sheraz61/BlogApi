import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail.js'

//register user
const createUser = async (req, res) => {
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
//get user profile
const getMyProfile = async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID).select('-password')
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
//change password
const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.params.id;
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
        const userId = req.params.id;
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
        // Create a token with userId + email, expires in 15 minutes
        const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;
        const html = `
    <h3>Hi ${user.username || "User"},</h3>
    <p>Please click below to confirm your new email address:</p>
    <a href="${verificationLink}">Verify Email</a>
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
//verify email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, email } = decoded;
        const emailTaken = await User.findOne({ email });
        if (emailTaken) {
            return res.status(409).json({ message: "Email already used", success: false });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        user.email = email;
        await user.save();
        res.status(200).json({ message: "Email verified and added successfully", success: true });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token", success: false });
    }
}
const changeEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.params.id;
        if (!newEmail) {
            return res.status(401).json({
                message: "New email required",
                success: false
            })
        }
        const existedEmail = await User.findOne({ email:newEmail })
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
        // Create a token with userId + email, expires in 15 minutes
        const token = jwt.sign({ userId, newEmail }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;
        const html = `
    <h3>Hi ${user.username || "User"},</h3>
    <p>Please click below to confirm your new email address:</p>
    <a href="${verificationLink}">Verify Email</a>
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

}
export { createUser, loginUser, logout, getMyProfile, changePassword, addEmail, verifyEmail, changeEmail }