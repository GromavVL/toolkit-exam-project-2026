module.exports.chatToResponse = conversation => ({
  _id: conversation.id,
  participants: [conversation.user1Id, conversation.user2Id],
  blackList: [conversation.blackList1, conversation.blackList2],
  favoriteList: [conversation.favoriteList1, conversation.favoriteList2],
});
