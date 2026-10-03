import { Property } from '../models/Property.js';
import { User } from '../models/User.js';
import { Plan } from '../models/Plan.js';
import { sanitizePropertiesList, sanitizeProperty } from '../utils/sanitizeProperty.js';

export const getAdminProperties = async (req, res, next) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    const sanitized = await sanitizePropertiesList(properties);
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const moderateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    const property = await Property.findOne({
      $or: [{ customId: id }, ...(isObjectId ? [{ _id: id }] : [])],
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    if (action === 'APPROVE') {
      property.status = 'PUBLISHED';
      property.isVerified = true;
      property.rejectionReason = null;
    } else if (action === 'REJECT') {
      property.status = 'REJECTED';
      property.rejectionReason = rejectionReason || 'Property did not meet listing guidelines.';
    }

    await property.save();

    const sanitized = await sanitizeProperty(property);
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const userStats = await Promise.all(
      users.map(async (u) => {
        const uId = u.customId || u.id || u._id.toString();
        const count = await Property.countDocuments({
          $or: [{ listedByUserId: uId }, { listedByUserId: u._id.toString() }],
        });

        const userObj = u.toJSON();
        return {
          ...userObj,
          propertiesCount: count,
        };
      })
    );

    res.json(userStats);
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findOneAndUpdate({ planId: id }, req.body, { new: true });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    res.json(plan.toJSON());
  } catch (error) {
    next(error);
  }
};
