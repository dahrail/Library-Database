const roleCheck = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming req.user is populated by authentication middleware

        if (roles.includes(userRole)) {
            next(); // User has the required role, proceed to the next middleware
        } else {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
    };
};

module.exports = roleCheck;