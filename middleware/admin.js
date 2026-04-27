
const isAdmin = (req, res, next) => {
    console.log(req.user, "from isAdmin middleware");
    if (req.user && req.user.isAdmin) {
       next(); // allow access
    } else {
        return res.status(403).json({message: "Access denied. Admin only."});
    }
};

module.exports = isAdmin;
