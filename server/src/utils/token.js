import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const payload = {
    id: user.customId || user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET || 'ghardekho_jwt_secret_dev_key_2026_xyz987';
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};
