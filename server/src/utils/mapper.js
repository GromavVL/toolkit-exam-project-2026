module.exports.chatToResponse = conversation => ({
  _id: conversation.id,
  participants: [conversation.user1Id, conversation.user2Id],
  blackList: [conversation.blackList1, conversation.blackList2],
  favoriteList: [conversation.favoriteList1, conversation.favoriteList2],
});

module.exports.catalogToResponse = (catalog, userId) => ({
  _id: catalog.id,
  ...(userId !== undefined && { user: userId }),
  catalogName: catalog.catalogName,
  chats: catalog.CatalogChats.map(({ conversationId }) => conversationId),
});

module.exports.chatPreviewToResponse = (
  conversation,
  message,
  interlocutor
) => ({
  _id: conversation.id,
  sender: message.senderId ?? message.sender,
  text: message.body ?? message.text,
  createAt: message.createdAt,
  participants: [conversation.user1Id, conversation.user2Id],
  blackList: [conversation.blackList1, conversation.blackList2],
  favoriteList: [conversation.favoriteList1, conversation.favoriteList2],
  interlocutor: interlocutor?.get?.() ?? interlocutor,
});
