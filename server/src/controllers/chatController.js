const db = require('../models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const chatQueries = require('./queries/chatQueries');
const { participantsSorting } = require('../utils/functions');
const { updateChatFlag } = require('../utils/helper');
const mapper = require('../utils/mapper');

module.exports.getPreview = async (req, res, next) => {
  try {
    const conversation = await chatQueries.conversationsPreview(
      req.tokenData.userId
    );
    const preview = conversation
      .filter(convers => convers.Messages.length)
      .map(convers => {
        const [lastMessage] = convers.Messages;
        const interlocutor =
          convers.user1Id === req.tokenData.userId
            ? convers.user2
            : convers.user1;

        return {
          _id: convers.id,
          sender: lastMessage.senderId,
          text: lastMessage.body,
          createAt: lastMessage.createdAt,
          participants: [convers.user1Id, convers.user2Id],
          blackList: [convers.blackList1, convers.blackList2],
          favoriteList: [convers.favoriteList1, convers.favoriteList2],
          interlocutor: interlocutor.get(),
        };
      })
      .sort((a, b) => b.createAt - a.createAt);

    res.send(preview);
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  try {
    const [user1Id, user2Id] = participantsSorting(
      req.tokenData.userId,
      req.params.id
    );
    const messages = await chatQueries.getMessageChat(user1Id, user2Id);
    const interlocutor = await userQueries.findUser({
      id: req.params.id,
    });

    res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addMessage = async (req, res, next) => {
  const participants = participantsSorting(
    req.tokenData.userId,
    req.body.recipient
  );
  const interlocutor = {
    id: req.tokenData.userId,
    firstName: req.tokenData.firstName,
    lastName: req.tokenData.lastName,
    displayName: req.tokenData.displayName,
    avatar: req.tokenData.avatar,
    email: req.tokenData.email,
  };
  const [user1Id, user2Id] = participants;
  let transaction;
  try {
    const recipientUser = await userQueries.findUser({
      id: req.body.recipient,
    });
    const recipient = {
      id: recipientUser.id,
      firstName: recipientUser.firstName,
      lastName: recipientUser.lastName,
      displayName: recipientUser.displayName,
      avatar: recipientUser.avatar,
      email: recipientUser.email,
    };

    transaction = await db.sequelize.transaction();
    const conversation = await chatQueries.findOrCreateConversation(
      user1Id,
      user2Id,
      transaction
    );
    const createdMessage = await chatQueries.createMessage(
      {
        senderId: req.tokenData.userId,
        body: req.body.messageBody,
        conversationId: conversation.id,
      },
      transaction
    );
    await transaction.commit();

    const message = {
      sender: req.tokenData.userId,
      body: createdMessage.body,
      createdAt: createdMessage.createdAt,
      participants,
    };
    const preview = {
      _id: conversation.id,
      sender: req.tokenData.userId,
      text: createdMessage.body,
      createAt: createdMessage.createdAt,
      participants,
      blackList: [conversation.blackList1, conversation.blackList2],
      favoriteList: [conversation.favoriteList1, conversation.favoriteList2],
    };

    controller.getChatController().emitNewMessage(req.body.recipient, {
      message,
      preview: Object.assign({}, preview, {
        interlocutor,
      }),
    });
    res.send({
      message,
      preview: Object.assign({}, preview, { interlocutor: recipient }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  try {
    const chat = await updateChatFlag({
      userId: req.tokenData.userId,
      participants: req.body.participants,
      value: req.body.favoriteFlag,
      fields: ['favoriteList1', 'favoriteList2'],
      update: chatQueries.updateFavoriteFlag,
    });
    res.send(chat);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  try {
    const chat = await updateChatFlag({
      userId: req.tokenData.userId,
      participants: req.body.participants,
      value: req.body.blackListFlag,
      fields: ['blackList1', 'blackList2'],
      update: chatQueries.updateBlockFlag,
    });
    const [user1Id, user2Id] = chat.participants;
    const interlocutorId = req.tokenData.userId === user1Id ? user2Id : user1Id;
    res.send(chat);
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  const userId = req.tokenData.userId;
  try {
    const catalogs = await chatQueries.findAllCatalogs(userId);
    res.send(catalogs.map(catalog => mapper.catalogToResponse(catalog)));
  } catch (err) {
    next(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const userId = req.tokenData.userId;
  const catalogName = req.body.catalogName;
  const chatId = req.body.chatId;
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const catalog = await chatQueries.createCatalog(
      { userId, catalogName },
      transaction
    );
    await chatQueries.createCatalogChat(
      { catalogId: catalog.id, conversationId: chatId },
      transaction
    );
    await transaction.commit();

    res.send({
      _id: catalog.id,
      catalogName: catalog.catalogName,
      chats: [chatId],
    });
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  const userId = req.tokenData.userId;
  const catalogName = req.body.catalogName;
  const catalogId = req.body.catalogId;
  try {
    await chatQueries.updateNameCatalog(
      userId,
      catalogId,
      catalogName
    );
    const catalogs = await chatQueries.findCatalogById(catalogId, userId, true);
    res.send(mapper.catalogToResponse(catalogs, userId));
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  const catalogsId = req.body.catalogId;
  const chatId = req.body.chatId;
  const userId = req.tokenData.userId;
  try {
    const findCatalog = await chatQueries.findCatalogById(catalogsId, userId);
    if (!findCatalog) {
      return res.send({ message: 'Catalog not found' });
    }
    const existingChat = await chatQueries.findChatInCatalog(
      catalogsId,
      chatId
    );
    if (existingChat) {
      return res.send({ message: 'This chat added to catalog' });
    }
    const chat = await chatQueries.createChatInCatalog(
      catalogsId,
      chatId
    );
    res.send(chat);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  const catalogsId = req.params.catalogId;
  const chatId = req.params.chatId;
  const userId = req.tokenData.userId;
  try {
    const findCatalog = await chatQueries.findCatalogById(catalogsId, userId);
    if (!findCatalog) {
      return res.send({ message: 'Catalog not found' });
    }
    await chatQueries.removeChatFromCatalog(catalogsId, chatId);
    const remainingChats = await chatQueries.findCatalogChatIds(catalogsId);
    res.send({
      _id: Number(catalogsId),
      catalogName: findCatalog.catalogName,
      chats: remainingChats.map(({ conversationId }) => conversationId),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  const catalogId = req.params.catalogId;
  const user = req.tokenData.userId;
  try {
    await chatQueries.destroyCatalog(catalogId, user);

    res.end();
  } catch (err) {
    next(err);
  }
};
