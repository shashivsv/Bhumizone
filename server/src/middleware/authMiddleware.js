import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'ghardekho_jwt_secret_dev_key_2026_xyz987';
    const decoded = jwt.verify(token, secret);

    const user = await User.findOne({
      $or: [
        { customId: decoded.id },
        { _id: decoded.id && decoded.id.match(/^[0-9a-fA-F]{24}$/) ? decoded.id : null },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'ghardekho_jwt_secret_dev_key_2026_xyz987';
      const decoded = jwt.verify(token, secret);
      const user = await User.findOne({
        $or: [
          { customId: decoded.id },
          { _id: decoded.id && decoded.id.match(/^[0-9a-fA-F]{24}$/) ? decoded.id : null },
        ],
      });
      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore token failure for optional endpoints
    }
  }

  next();
};
