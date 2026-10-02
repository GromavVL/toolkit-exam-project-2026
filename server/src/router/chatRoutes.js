const express = require('express');
const chatController = require('../controllers/chatController');
const checkToken = require('../middlewares/checkToken');

const router = express.Router();

router.post('/newMessage', checkToken.checkToken, chatController.addMessage);
router.get('/getChat/:id', checkToken.checkToken, chatController.getChat);
router.get('/getPreview', checkToken.checkToken, chatController.getPreview);
router.patch('/blackList', checkToken.checkToken, chatController.blackList);
router.patch('/favorite', checkToken.checkToken, chatController.favoriteChat);
router.get('/getCatalogs', checkToken.checkToken, chatController.getCatalogs);

router.post(
  '/createCatalog',
  checkToken.checkToken,
  chatController.createCatalog
);

router.patch(
  '/updateNameCatalog',
  checkToken.checkToken,
  chatController.updateNameCatalog
);

router.post(
  '/addNewChatToCatalog',
  checkToken.checkToken,
  chatController.addNewChatToCatalog
);

router.delete(
  '/removeChatFromCatalog/:catalogId/:chatId',
  checkToken.checkToken,
  chatController.removeChatFromCatalog
);

router.delete(
  '/deleteCatalog/:catalogId',
  checkToken.checkToken,
  chatController.deleteCatalog
);

module.exports = router;
