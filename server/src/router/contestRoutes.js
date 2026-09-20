const express = require('express');
const checkToken = require('../middlewares/checkToken');
const contestController = require('../controllers/contestController');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');

const router = express.Router();

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

router.get(
  '/getAllPendingOffers',
  checkToken.checkToken,
  basicMiddlewares.onlyForModerator,
  contestController.getPendingOffers
);

router.patch(
  '/setReviewOffers',
  checkToken.checkToken,
  basicMiddlewares.onlyForModerator,
  contestController.setReviewOffers
);

module.exports = router;
