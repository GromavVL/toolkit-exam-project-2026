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
