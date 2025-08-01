export const setUploadTarget = (target) => {
  return (req, res, next) => {
    req.uploadTarget = target;
    next();
  };
};
