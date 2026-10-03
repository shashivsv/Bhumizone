import { User } from '../models/User.js';
import { generateToken } from '../utils/token.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, agencyName, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    const userRole = role || 'BUYER';
    const isDealer = userRole === 'DEALER';

    const user = await User.create({
      customId: `usr_${userRole.toLowerCase()}_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
      phone: phone || '',
      agencyName: isDealer ? agencyName || null : null,
      city: city || 'Mumbai',
      savedProperties: [],
      subscription: isDealer
        ? {
            planId: null,
            planName: null,
            isActive: false,
            isExpired: false,
            startedAt: null,
            expiresAt: null,
            daysRemaining: 0,
          }
        : null,
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User does not exist.' });
    }

    // If password provided, verify password
    if (password) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials. Password is incorrect.' });
      }
    }

    const token = generateToken(user);

    res.json({
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json(req.user.toJSON());
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const user = req.user;

    const saved = user.savedProperties || [];
    const index = saved.indexOf(propertyId);

    if (index > -1) {
      saved.splice(index, 1);
    } else {
      saved.push(propertyId);
    }

    user.savedProperties = saved;
    await user.save();

    res.json({
      savedProperties: user.savedProperties,
      isSaved: user.savedProperties.includes(propertyId),
    });
  } catch (error) {
    next(error);
  }
};
