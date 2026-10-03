import { Property } from '../models/Property.js';
import { sanitizeProperty, sanitizePropertiesList } from '../utils/sanitizeProperty.js';

export const getProperties = async (req, res, next) => {
  try {
    const { search, type, city, category, bhk, minPrice, maxPrice, sortBy } = req.query;
    const viewerUserId = req.user?.customId || req.user?.id || null;

    const query = { status: 'PUBLISHED' };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { locality: searchRegex },
        { city: searchRegex },
        { address: searchRegex },
      ];
    }

    if (type && type !== 'ALL') {
      query.type = type;
    }

    if (city && city !== 'ALL') {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (bhk) {
      const bhkList = Array.isArray(bhk) ? bhk : [bhk];
      query.bhk = { $in: bhkList };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'price_asc') {
      sort = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sort = { price: -1 };
    }

    const properties = await Property.find(query).sort(sort);
    const sanitized = await sanitizePropertiesList(properties, viewerUserId);

    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const getPropertyByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const viewerUserId = req.user?.customId || req.user?.id || null;

    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const property = await Property.findOne({
      $or: [
        { slug: idOrSlug },
        { customId: idOrSlug },
        ...(isObjectId ? [{ _id: idOrSlug }] : []),
      ],
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Increment views asynchronously
    Property.findByIdAndUpdate(property._id, { $inc: { viewsCount: 1 } }).exec();

    const sanitized = await sanitizeProperty(property, viewerUserId);
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const getMyProperties = async (req, res, next) => {
  try {
    const userId = req.user.customId || req.user.id || req.user._id.toString();
    const properties = await Property.find({
      $or: [{ listedByUserId: userId }, { listedByUserId: req.user._id.toString() }],
    }).sort({ createdAt: -1 });

    const sanitized = await sanitizePropertiesList(properties, userId);
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const userId = req.user.customId || req.user.id || req.user._id.toString();

    // Determine initial status based on role or input
    let status = req.body.status || 'PENDING_APPROVAL';
    if (req.user.role === 'ADMIN') {
      status = req.body.status || 'PUBLISHED';
    }

    const newProperty = await Property.create({
      ...req.body,
      customId: `prop_${Date.now()}`,
      listedByUserId: userId,
      status,
      viewsCount: 0,
      inquiriesCount: 0,
    });

    const sanitized = await sanitizeProperty(newProperty, userId);
    res.status(201).json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.customId || req.user.id || req.user._id.toString();
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    const query = {
      $and: [
        {
          $or: [
            { customId: id },
            { slug: id },
            ...(isObjectId ? [{ _id: id }] : []),
          ],
        },
        ...(req.user.role === 'ADMIN'
          ? []
          : [
              {
                $or: [{ listedByUserId: userId }, { listedByUserId: req.user._id.toString() }],
              },
            ]),
      ],
    };

    const property = await Property.findOne(query);
    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized.' });
    }

    Object.assign(property, req.body);
    await property.save();

    const sanitized = await sanitizeProperty(property, userId);
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.customId || req.user.id || req.user._id.toString();
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    const query = {
      $and: [
        {
          $or: [
            { customId: id },
            { slug: id },
            ...(isObjectId ? [{ _id: id }] : []),
          ],
        },
        ...(req.user.role === 'ADMIN'
          ? []
          : [
              {
                $or: [{ listedByUserId: userId }, { listedByUserId: req.user._id.toString() }],
              },
            ]),
      ],
    };

    const deleted = await Property.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ message: 'Property not found or unauthorized.' });
    }

    res.json({ message: 'Property deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
