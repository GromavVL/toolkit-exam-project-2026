import http from '../interceptor';

export const registerRequest = data => http.post('registration', data);
export const loginRequest = data => http.post('login', data);
export const getUser = () => http.get('getUser');
export const updateContest = data => http.patch('updateContest', data);
export const setNewOffer = data => http.post('setNewOffer', data);
export const setOfferStatus = data => http.patch('setOfferStatus', data);
export const downloadContestFile = data =>
  http.get(`downloadFile/${data.fileName}`);
export const payMent = data => http.post('pay', data.formData);
export const changeMark = data => http.patch('changeMark', data);
export const getPreviewChat = () => http.get('getPreview');
export const getDialog = id => http.get(`getChat/${id}`);
export const dataForContest = data => http.post('dataForContest', data);
export const cashOut = data => http.patch('cashout', data);
export const updateUser = data => http.patch('updateUser', data);
export const newMessage = data => http.post('newMessage', data);
export const changeChatFavorite = data => http.patch('favorite', data);
export const changeChatBlock = data => http.patch('blackList', data);
export const getCatalogList = () => http.get('getCatalogs');
export const addChatToCatalog = data => http.post('addNewChatToCatalog', data);
export const createCatalog = data => http.post('createCatalog', data);
export const deleteCatalog = ({ catalogId }) =>
  http.delete(`deleteCatalog/${catalogId}`);
export const removeChatFromCatalog = ({ catalogId, chatId }) =>
  http.delete(`removeChatFromCatalog/${catalogId}/${chatId}`);
export const changeCatalogName = data => http.patch('updateNameCatalog', data);
export const getCustomersContests = data =>
  http.get('getCustomersContests', {
    params: {
      limit: data.limit,
      offset: data.offset,
      status: data.contestStatus,
    },
  });

export const getActiveContests = ({
  offset,
  limit,
  typeIndex,
  contestId,
  industry,
  awardSort,
  ownEntries,
}) =>
  http.get('getAllContests', {
    params: {
      offset,
      limit,
      typeIndex,
      contestId,
      industry,
      awardSort,
      ownEntries,
    },
  });

export const getContestById = ({ contestId }) =>
  http.get(`getContestById/${contestId}`);

export const getPendingOffers = () => http.get('getAllPendingOffers');
export const setReviewOfferStatus = data => http.patch('setReviewOffers', data);
