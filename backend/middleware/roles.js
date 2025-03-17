const roles = {
    ADMIN: 'admin',
    FACULTY: 'faculty',
    STUDENT: 'student',
  };
  
  const checkRole = (role) => {
    return (req, res, next) => {
      if (req.user && req.user.role === role) {
        next();
      } else {
        return res.status(403).json({ message: 'Access denied.' });
      }
    };
  };
  
  module.exports = {
    roles,
    checkRole,
  };