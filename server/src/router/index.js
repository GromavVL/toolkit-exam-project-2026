const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const contestController = require('../controllers/contestController');
const checkToken = require('../middlewares/checkToken');
const chatController = require('../controllers/chatController');
const upload = require('../utils/fileUpload');
const router = express.Router();

const userRoutes = require('./userRoutes')

router.post(
  '/dataForContest',
  checkToken.checkToken,
  contestController.dataForContest
);

router.post(
  '/getCustomersContests',
  checkToken.checkToken,
  contestController.getCustomersContests
);

router.get(
  '/getContestById',
  checkToken.checkToken,
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

router.post(
  '/getAllContests',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  contestController.getContests
);

router.post('/getUser', checkToken.checkAuth);

router.get(
  '/downloadFile/:fileName',
  checkToken.checkToken,
  contestController.downloadFile
);

router.post(
  '/updateContest',
  checkToken.checkToken,
  upload.updateContestFile,
  contestController.updateContest
);

router.post(
  '/setNewOffer',
  checkToken.checkToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer
);

router.post(
  '/setOfferStatus',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus
);

router.post('/newMessage', checkToken.checkToken, chatController.addMessage);

router.post('/getChat', checkToken.checkToken, chatController.getChat);

router.post('/getPreview', checkToken.checkToken, chatController.getPreview);

router.post('/blackList', checkToken.checkToken, chatController.blackList);

router.post('/favorite', checkToken.checkToken, chatController.favoriteChat);

router.post(
  '/createCatalog',
  checkToken.checkToken,
  chatController.createCatalog
);

router.post(
  '/updateNameCatalog',
  checkToken.checkToken,
  chatController.updateNameCatalog
);

router.post(
  '/addNewChatToCatalog',
  checkToken.checkToken,
  chatController.addNewChatToCatalog
);

router.post(
  '/removeChatFromCatalog',
  checkToken.checkToken,
  chatController.removeChatFromCatalog
);

router.post(
  '/deleteCatalog',
  checkToken.checkToken,
  chatController.deleteCatalog
);

router.post('/getCatalogs', checkToken.checkToken, chatController.getCatalogs);

router.use('/', userRoutes);

module.exports = router;
