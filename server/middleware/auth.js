const User = require('../models/User');

exports.isAuthenticated = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).render('error', { 
            error: 'Access denied. Admin privileges required.' 
        });
    }
}; 