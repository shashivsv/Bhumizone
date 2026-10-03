import { Inquiry } from '../models/Inquiry.js';
import { Property } from '../models/Property.js';

export const sendInquiry = async (req, res, next) => {
  try {
    const { propertyId, propertyTitle, buyerName, buyerEmail, buyerPhone, ownerId, message } =
      req.body;

    if (!propertyId || !buyerName || !buyerEmail || !buyerPhone || !ownerId) {
      return res.status(400).json({ message: 'All inquiry contact details are required.' });
    }

    const buyerId = req.user ? req.user.customId || req.user.id || req.user._id.toString() : null;

    const newInquiry = await Inquiry.create({
      customId: `inq_${Date.now()}`,
      propertyId,
      propertyTitle: propertyTitle || 'Property Inquiry',
      buyerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      ownerId,
      message: message || '',
      status: 'NEW',
    });

    // Increment inquiry count on property
    const isObjectId = propertyId.match(/^[0-9a-fA-F]{24}$/);
    await Property.findOneAndUpdate(
      {
        $or: [
          { customId: propertyId },
          { slug: propertyId },
          ...(isObjectId ? [{ _id: propertyId }] : []),
        ],
      },
      { $inc: { inquiriesCount: 1 } }
    );

    res.status(201).json(newInquiry.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const userId = req.user.customId || req.user.id || req.user._id.toString();
    const role = req.user.role;

    let query = {};
    if (role === 'BUYER') {
      query = {
        $or: [
          { buyerId: userId },
          { buyerId: req.user._id.toString() },
          { buyerEmail: req.user.email.toLowerCase() },
        ],
      };
    } else if (role === 'ADMIN') {
      query = {}; // Admin can view all inquiries
    } else {
      // OWNER or DEALER
      query = {
        $or: [{ ownerId: userId }, { ownerId: req.user._id.toString() }],
      };
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
    res.json(inquiries.map((i) => i.toJSON()));
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.customId || req.user.id || req.user._id.toString();
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    const query = {
      $and: [
        {
          $or: [{ customId: id }, ...(isObjectId ? [{ _id: id }] : [])],
        },
        ...(req.user.role === 'ADMIN'
          ? []
          : [{ $or: [{ ownerId: userId }, { ownerId: req.user._id.toString() }] }]),
      ],
    };

    const inquiry = await Inquiry.findOne(query);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found or unauthorized.' });
    }

    inquiry.status = status;
    await inquiry.save();

    res.json(inquiry.toJSON());
  } catch (error) {
    next(error);
  }
};
