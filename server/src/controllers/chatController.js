const Conversation = require('../models/mongoModels/conversation');
const Message = require('../models/mongoModels/Message');
const Catalog = require('../models/mongoModels/Catalog');
const db = require('../models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const chatQueries = require('./queries/chatQueries');
const { participantsSorting } = require('../utils/functions');
const RightsError = require('../errors/RightsError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.addMessageLegacy = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );
  try {
    const newConversation = await Conversation.findOneAndUpdate(
      {
        participants,
      },
      { participants, blackList: [false, false], favoriteList: [false, false] },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      }
    );
    const message = new Message({
      sender: req.tokenData.userId,
      body: req.body.messageBody,
      conversation: newConversation._id,
    });
    await message.save();
    message._doc.participants = participants;
    const interlocutorId = participants.filter(
      participant => participant !== req.tokenData.userId
    )[0];
    const preview = {
      _id: newConversation._id,
      sender: req.tokenData.userId,
      text: req.body.messageBody,
      createAt: message.createdAt,
      participants,
      blackList: newConversation.blackList,
      favoriteList: newConversation.favoriteList,
    };
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        _id: newConversation._id,
        sender: req.tokenData.userId,
        text: req.body.messageBody,
        createAt: message.createdAt,
        participants,
        blackList: newConversation.blackList,
        favoriteList: newConversation.favoriteList,
        interlocutor: {
          id: req.tokenData.userId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
    });
    res.send({
      message,
      preview: Object.assign(preview, { interlocutor: req.body.interlocutor }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChatLegacy = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );
  try {
    const messages = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      { $match: { 'conversationData.participants': participants } },
      { $sort: { createdAt: 1 } },
      {
        $project: {
          _id: 1,
          sender: 1,
          body: 1,
          conversation: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
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

module.exports.getPreviewLegacy = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      {
        $unwind: '$conversationData',
      },
      {
        $match: {
          'conversationData.participants': req.tokenData.userId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: '$conversationData._id',
          sender: { $first: '$sender' },
          text: { $first: '$body' },
          createAt: { $first: '$createdAt' },
          participants: { $first: '$conversationData.participants' },
          blackList: { $first: '$conversationData.blackList' },
          favoriteList: { $first: '$conversationData.favoriteList' },
        },
      },
    ]);
    const interlocutors = [];
    conversations.forEach(conversation => {
      interlocutors.push(
        conversation.participants.find(
          participant => participant !== req.tokenData.userId
        )
      );
    });
    const senders = await db.Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    conversations.forEach(conversation => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });
    res.send(conversations);
  } catch (err) {
    next(err);
  }
};

module.exports.blackListLegacy = async (req, res, next) => {
  const predicate =
    'blackList.' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [predicate]: req.body.blackListFlag } },
      { new: true }
    );
    res.send(chat);
    const interlocutorId = req.body.participants.filter(
      participant => participant !== req.tokenData.userId
    )[0];
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChatLegacy = async (req, res, next) => {
  const predicate =
    'favoriteList.' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [predicate]: req.body.favoriteFlag } },
      { new: true }
    );
    res.send(chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalogLegacy = async (req, res, next) => {
  const catalog = new Catalog({
    userId: req.tokenData.userId,
    catalogName: req.body.catalogName,
    chats: [req.body.chatId],
  });
  try {
    await catalog.save();
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { catalogName: req.body.catalogName },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { $addToSet: { chats: req.body.chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { $pull: { chats: req.body.chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await Catalog.findByIdAndDelete({
      _id: req.body.catalogId,
      userId: req.tokenData.userId,
    });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogsLegacy = async (req, res, next) => {
  try {
    const catalogs = await Catalog.aggregate([
      { $match: { userId: req.tokenData.userId } },
      {
        $project: {
          _id: 1,
          catalogName: 1,
          chats: 1,
        },
      },
    ]);
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  const { userId } = req.tokenData;
  try {
    const conversation = await chatQueries.conversationsPreview(userId);
    const preview = conversation
      .filter(convers => convers.Messages.length)
      .map(convers => {
        const [lastMessage] = convers.Messages;
        const interlocutor =
          convers.user1Id === userId ? convers.user2 : convers.user1;

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
  const {
    body: { interlocutorId },
    tokenData: { userId },
  } = req;
  try {
    const [user1Id, user2Id] = participantsSorting(userId, interlocutorId);
    const messages = await chatQueries.getMessageChat(user1Id, user2Id);

    const interlocutor = await userQueries.findUser({
      id: interlocutorId,
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
  const {
    tokenData: { userId, firstName, lastName, displayName, avatar, email },
    body: { recipient, messageBody, interlocutor },
  } = req;
  const participants = participantsSorting(userId, recipient);
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
        senderId: userId,
        body: messageBody,
        conversationId: conversation.id,
      },
      { transaction }
    );
    await transaction.commit();

    const message = {
      sender: userId,
      body: createdMessage.body,
      createdAt: createdMessage.createdAt,
      participants,
    };
    const preview = {
      _id: conversation.id,
      sender: userId,
      text: createdMessage.body,
      createAt: createdMessage.createdAt,
      participants,
      blackList: [conversation.blackList1, conversation.blackList2],
      favoriteList: [conversation.favoriteList1, conversation.favoriteList2],
    };

    controller.getChatController().emitNewMessage(recipient, {
      message,
      preview: Object.assign({}, preview, {
        interlocutor: {
          id: userId,
          firstName,
          lastName,
          displayName,
          avatar,
          email,
        },
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
  const {
    body: { participants, favoriteFlag },
    tokenData: { userId },
  } = req;
  try {
    const [user1Id, user2Id] = participantsSorting(...participants);
    if (userId !== user1Id && userId !== user2Id) {
      return next(new RightsError());
    }
    const field = userId === user1Id ? 'favoriteList1' : 'favoriteList2';
    const favoriteQuery = await chatQueries.updateFavoriteFlag(
      user1Id,
      user2Id,
      field,
      favoriteFlag
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
  const {
    body: { participants, blackListFlag },
    tokenData: { userId },
  } = req;

  try {
    const [user1Id, user2Id] = participantsSorting(...participants);
    if (userId !== user1Id && userId !== user2Id) {
      return next(new RightsError());
    }
    const field = userId === user1Id ? 'blackList1' : 'blackList2';
    const blockQuery = await chatQueries.updateBlockFlag(
      user1Id,
      user2Id,
      field,
      blackListFlag
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
    const interlocutorId = userId === user1Id ? user2Id : user1Id;
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  const { userId } = req.tokenData;
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
  const {
    tokenData: { userId },
    body: { catalogName, chatId },
  } = req;

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