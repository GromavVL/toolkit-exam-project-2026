const { participantsSorting } = require('./functions');
const RightsError = require('../errors/RightsError');
const BadRequestError = require('../errors/BadRequestError');
const { chatToResponse } = require('./mapper');

module.exports.updateChatFlag = async ({ userId, participants, value, fields, update }) => {
  const [user1Id, user2Id] = participantsSorting(...participants);

  if (userId !== user1Id && userId !== user2Id) {
    throw new RightsError();
  }

  const field = userId === user1Id ? fields[0] : fields[1];
  const conversation = await update(user1Id, user2Id, field, value);

  if (!conversation) {
    throw new BadRequestError('Conversation not found');
  }

  return chatToResponse(conversation);
};
