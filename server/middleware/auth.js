import jwt from 'jsonwebtoken';

const JWT_SECRET = 'H2gW7pY0tK9zC4fR1bX6mJ8vL3dN5qA';

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

   try {

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("JWT Verification failed:", err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

export default auth;