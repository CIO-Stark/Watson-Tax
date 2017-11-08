const jwt = require('jsonwebtoken');
const EXPIRE_TIME = 3600 * 13;
const TOKEN_SECRET = 'shhhhhhhh';

exports.signToken = user => {
    return jwt.sign({ data: user }, TOKEN_SECRET, { expiresIn: EXPIRE_TIME });
};

exports.verifyMiddleware = (req, res, next) => {
    next();
    // @PORTFOLIO
    // try {
    //     if (!req.headers['authorization']) {
    //         return res.status(401).json({ message: 'no token' });
    //     }

    //     const token = req.headers['authorization'].split(' ')[1];
    //     const decoded = jwt.verify(token, TOKEN_SECRET);

    //     if (decoded) {
    //         req.user = decoded.data;
    //         next();
    //     }
    //     else res.status(401).json({ message: 'invalid token' });
    // } catch (e) {
    //     console.error('Verifying token: ', e);
    //     res.status(401).json({ message: 'invalid token' });
    // }
};