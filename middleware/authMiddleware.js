const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Splits between "Bearer" & the jwt 

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        return res.status(401).json({ success: false, message: "Unauthorized" });
      } else {
        req.user = decodedToken;  
        next();
      }
    });
  } else {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = { requireAuth };