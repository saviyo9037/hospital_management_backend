const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      const { role } = req.user; // user object must be set in auth middleware

      const isAuthorized = roles.includes(role);

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions"
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error in roleMiddleware"
      });
    }
  };
};

module.exports = roleMiddleware;
