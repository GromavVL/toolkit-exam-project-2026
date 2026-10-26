const bd = require('../../models');
const ServerError = require('../../errors/ServerError');
const CONSTANTS = require('../../constants');
const { sendMessage } = require('../../smtpConfig');

module.exports.updateContest = async (data, predicate, transaction) => {
  const [updatedCount, [updatedContest]] = await bd.Contests.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount !== 1) {
    throw new ServerError('cannot update Contest');
  } else {
    return updatedContest.dataValues;
  }
};

module.exports.updateContestStatus = async (data, predicate, transaction) => {
  const updateResult = await bd.Contests.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updateResult[0] < 1) {
    throw new ServerError('cannot update Contest');
  } else {
    return updateResult[1][0].dataValues;
  }
};

module.exports.updateOffer = async (data, predicate, transaction) => {
  const [updatedCount, [updatedOffer]] = await bd.Offers.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount !== 1) {
    throw new ServerError('cannot update offer!');
  } else {
    return updatedOffer.dataValues;
  }
};

module.exports.updateOfferStatus = async (data, predicate, transaction) => {
  const result = await bd.Offers.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (result[0] < 1) {
    throw new ServerError('cannot update offer!');
  } else {
    return result[1];
  }
};

module.exports.createOffer = async data => {
  const result = await bd.Offers.create(data);
  if (!result) {
    throw new ServerError('cannot create new Offer');
  } else {
    return result.get({ plain: true });
  }
};

module.exports.updateReviewStatus = async (idOffer, reviewStatus, receiver) => {
  const notificationByStatus = {
    [CONSTANTS.OFFER_STATUS_MODERATOR_APPROVED]: CONSTANTS.APPROVED,
    [CONSTANTS.OFFER_STATUS_MODERATOR_CANCEL]: CONSTANTS.CANCEL,
  };
  const notification = notificationByStatus[reviewStatus];

  if (!notification) {
    return new ServerError();
  }

  const [, result] = await bd.Offers.update(
    { status: reviewStatus },
    {
      where: { id: idOffer },
      returning: true,
    }
  );

  sendMessage(receiver, notification.SUBJECT, notification.TEXT);
  return result;
};

module.exports.findAllPendingOffers = async (limit, offset) => {
  const getOffers = await bd.Offers.findAll({
    where: {
      status: CONSTANTS.OFFER_STATUS_PENDING,
    },
    limit,
    offset,
    include: [
      {
        model: bd.Contests,
        attributes: [
          'title',
          'industry',
          'contestType',
          'fileName',
          'styleName',
          'contestType',
        ],
      },
      {
        model: bd.Users,
        attributes: ['email'],
      },
    ],
  });

  return getOffers;
};
