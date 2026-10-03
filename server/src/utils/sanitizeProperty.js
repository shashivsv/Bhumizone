import { User } from '../models/User.js';

export const sanitizeProperty = async (propertyDoc, viewerUserId = null, userMap = null) => {
  const property = propertyDoc.toJSON ? propertyDoc.toJSON() : { ...propertyDoc };
  const sellerId = property.listedByUserId;

  let seller = null;
  if (userMap && userMap[sellerId]) {
    seller = userMap[sellerId];
  } else {
    seller = await User.findOne({
      $or: [{ customId: sellerId }, { _id: sellerId.match(/^[0-9a-fA-F]{24}$/) ? sellerId : null }],
    });
  }

  const sellerObj = seller ? (seller.toJSON ? seller.toJSON() : seller) : null;

  let contactInfo = {
    phone: null,
    email: null,
    contactHidden: false,
    hideReason: null,
    canInquireViaForm: true,
  };

  if (!sellerObj) {
    return {
      ...property,
      listedBy: {
        id: sellerId,
        name: 'GharDekho Representative',
        role: 'OWNER',
        agencyName: null,
        avatar: null,
        city: null,
        contactInfo: { ...contactInfo, phone: '+91 99999 00000', email: 'support@ghardekho.com' },
        isSelf: false,
        subscriptionStatus: null,
      },
    };
  }

  if (sellerObj.role === 'DEALER') {
    const isSubscribed = Boolean(sellerObj.subscription?.isActive && !sellerObj.subscription?.isExpired);
    if (isSubscribed) {
      contactInfo.phone = sellerObj.phone;
      contactInfo.email = sellerObj.email;
      contactInfo.contactHidden = false;
    } else {
      contactInfo.phone = null;
      contactInfo.email = null;
      contactInfo.contactHidden = true;
      contactInfo.hideReason = 'SUBSCRIPTION_REQUIRED';
    }
  } else {
    // OWNER or ADMIN
    contactInfo.phone = sellerObj.phone;
    contactInfo.email = sellerObj.email;
    contactInfo.contactHidden = false;
  }

  const isOwnerViewingSelf = Boolean(
    viewerUserId && (viewerUserId === sellerObj.id || viewerUserId === sellerObj.customId || viewerUserId === sellerObj._id?.toString())
  );

  return {
    ...property,
    listedBy: {
      id: sellerObj.id || sellerObj.customId || sellerObj._id,
      name: sellerObj.name,
      role: sellerObj.role,
      agencyName: sellerObj.agencyName || null,
      avatar: sellerObj.avatar || null,
      city: sellerObj.city || null,
      contactInfo,
      isSelf: isOwnerViewingSelf,
      subscriptionStatus: sellerObj.subscription || null,
    },
  };
};

export const sanitizePropertiesList = async (propertyDocs, viewerUserId = null) => {
  // Pre-fetch all sellers to optimize DB queries
  const sellerIds = [...new Set(propertyDocs.map((p) => p.listedByUserId))];
  const sellers = await User.find({
    $or: [
      { customId: { $in: sellerIds } },
      { _id: { $in: sellerIds.filter((id) => id && id.match(/^[0-9a-fA-F]{24}$/)) } },
    ],
  });

  const userMap = {};
  for (const s of sellers) {
    if (s.customId) userMap[s.customId] = s;
    userMap[s._id.toString()] = s;
  }

  return Promise.all(propertyDocs.map((p) => sanitizeProperty(p, viewerUserId, userMap)));
};
