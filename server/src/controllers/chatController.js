const db = require('../models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const chatQueries = require('./queries/chatQueries');
const { participantsSorting } = require('../utils/functions');
const RightsError = require('../errors/RightsError');
const BadRequestError = require('../errors/BadRequestError');

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
      req.body.interlocutorId
    );
    const messages = await chatQueries.getMessageChat(user1Id, user2Id);
    const interlocutor = await userQueries.findUser({
      id: req.body.interlocutorId,
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
    transaction = await db.sequelize.transaction();
    const [conversation] = await db.Conversations.findOrCreate({
      where: { user1Id, user2Id },
      transaction,
    });
    const createdMessage = await db.Messages.create(
      {
        senderId: req.tokenData.userId,
        body: req.body.messageBody,
        conversationId: conversation.id,
      },
      { transaction }
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
      preview: Object.assign({}, preview, { interlocutor }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const participant = req.body.participants;
  const favorite = req.body.favoriteFlag;
  try {
    const [user1Id, user2Id] = participantsSorting(...participant);
    if (req.tokenData.userId !== user1Id && req.tokenData.userId !== user2Id) {
      return next(new RightsError());
    }
    const field =
      req.tokenData.userId === user1Id ? 'favoriteList1' : 'favoriteList2';
    const favoriteQuery = await chatQueries.updateFavoriteFlag(
      user1Id,
      user2Id,
      field,
      favorite
    );
    if (!favoriteQuery) {
      return next(new BadRequestError('Conversation not found'));
    }

    res.send({
      _id: favoriteQuery.id,
      participants: [favoriteQuery.user1Id, favoriteQuery.user2Id],
      blackList: [favoriteQuery.blackList1, favoriteQuery.blackList2],
      favoriteList: [favoriteQuery.favoriteList1, favoriteQuery.favoriteList2],
    });
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const participant = req.body.participants;
  const blackList = req.body.blackListFlag;
  try {
    const [user1Id, user2Id] = participantsSorting(...participant);
    if (req.tokenData.userId !== user1Id && req.tokenData.userId !== user2Id) {
      return next(new RightsError());
    }
    const field =
      req.tokenData.userId === user1Id ? 'blackList1' : 'blackList2';
    const blockQuery = await chatQueries.updateBlockFlag(
      user1Id,
      user2Id,
      field,
      blackList
    );

    if (!blockQuery) {
      return next(new BadRequestError('Conversation not found'));
    }
    const chat = {
      _id: blockQuery.id,
      participants: [blockQuery.user1Id, blockQuery.user2Id],
      blackList: [blockQuery.blackList1, blockQuery.blackList2],
      favoriteList: [blockQuery.favoriteList1, blockQuery.favoriteList2],
    };
    res.send(chat);
    const interlocutorId = req.tokenData.userId === user1Id ? user2Id : user1Id;
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  const userId = req.tokenData.userId;
  try {
    const catalogs = await db.Catalogs.findAll({
      where: { userId },
      attributes: ['id', 'catalogName'],
      include: [
        {
          model: db.CatalogChats,
          attributes: ['conversationId'],
          required: false,
        },
      ],
      order: [['id', 'ASC']],
    });
    res.send(
      catalogs.map(catalog => ({
        _id: catalog.id,
        catalogName: catalog.catalogName,
        chats: catalog.CatalogChats.map(({ conversationId }) => conversationId),
      }))
    );
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
    const updateCatalog = await chatQueries.updateNameCatalog(
      userId,
      catalogId,
      catalogName
    );
    const catalogs = await db.Catalogs.findOne({
      where: { id: catalogId },
      include: [
        {
          model: db.CatalogChats,
          attributes: ['conversationId'],
          required: false,
        },
      ],
    });
    res.send({
      _id: updateCatalog.id,
      user: userId,
      catalogName: updateCatalog.catalogName,
      chats: catalogs.CatalogChats.map(({ conversationId }) => conversationId),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  const catalogsId = req.body.catalogId;
  const chatId = req.body.chatId;
  const userId = req.tokenData.userId;
  try {
    const findCatalog = await db.Catalogs.findOne({
      where: { id: catalogsId, userId },
    });
    if (!findCatalog) {
      return res.send({ message: 'Catalog not found' });
    }

    const existingChat = await db.CatalogChats.findOne({
      where: { catalogId: catalogsId, conversationId: chatId },
    });
    if (existingChat) {
      return res.send({ message: 'This chat added to catalog' });
    }

    const chat = await db.CatalogChats.create({
      catalogId: catalogsId,
      conversationId: chatId,
    });
    res.send(chat);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  const catalogsId = req.body.catalogId;
  const chatId = req.body.chatId;
  const userId = req.tokenData.userId;
  try {
    const findCatalog = await db.Catalogs.findOne({
      where: { id: catalogsId, userId },
      include: [
        {
          model: db.CatalogChats,
          attributes: ['conversationId'],
          required: false,
        },
      ],
    });
    if (!findCatalog) {
      return res.send({ message: 'Catalog not found' });
    }
    await db.CatalogChats.destroy({
      where: {
        catalogId: catalogsId,
        conversationId: chatId,
      },
    });
    const remainingChatsRaw = await db.CatalogChats.findAll({
      where: { catalogId: catalogsId },
      attributes: ['conversationId'],
    });
    res.send({
      _id: catalogsId,
      catalogName: findCatalog.catalogName,
      chats: remainingChatsRaw.map(({ conversationId }) => conversationId),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  const catalogId = req.body.catalogId;
  const user = req.tokenData.userId;
  try {
    await db.Catalogs.destroy({
      where: {
        id: catalogId,
        userId: user,
      },
    });

    res.end();
  } catch (err) {
    next(err);
  }
};
