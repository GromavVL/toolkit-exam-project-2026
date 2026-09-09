const bd = require('../../models');
const CONSTANT = require('../../constants');

module.exports.conversationsPreview = async userId => {
  const conversations = await bd.Conversations.findAll({
    where: {
      [bd.Sequelize.Op.or]: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: [
      {
        model: bd.Users,
        as: 'user1',
        attributes: CONSTANT.USER_PREVIEW_ATTRIBUTES,
      },
      {
        model: bd.Users,
        as: 'user2',
        attributes: CONSTANT.USER_PREVIEW_ATTRIBUTES,
      },
      {
        model: bd.Messages,
        separate: true,
        limit: 1,
        order: [
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ],
      },
    ],
  });

  return conversations;
};

module.exports.getMessageChat = async (user1Id, user2Id) => {
  const getMessages = await bd.Messages.findAll({
    attributes: [['senderId', 'sender'], 'body', 'createdAt'],
    include: [
      {
        model: bd.Conversations,
        required: true,
        attributes: [],
        where: { user1Id, user2Id },
      },
    ],
    order: [['createdAt', 'ASC']],
  });

  return getMessages;
};

module.exports.updateFavoriteFlag = async (user1Id, user2Id, field, value) => {
  const [updatedCount, [updatedFavorite]] = await bd.Conversations.update(
    { [field]: value },
    {
      where: { user1Id, user2Id },
      returning: true,
    }
  );
  return updatedFavorite;
};

module.exports.updateBlockFlag = async (user1Id, user2Id, field, value) => {
  const [updateCount, [updateBlock]] = await bd.Conversations.update(
    {
      [field]: value,
    },
    {
      where: { user1Id, user2Id },
      returning: true,
    }
  );

  return updateBlock;
};

module.exports.createCatalog = async (data, transaction) => {
  const catalog = await bd.Catalogs.create(data, { transaction });

  return catalog;
};

module.exports.createCatalogChat = async (data, transaction) => {
  const catalogChat = await bd.CatalogChats.create(data, { transaction });

  return catalogChat;
};
