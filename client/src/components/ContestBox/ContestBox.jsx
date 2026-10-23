import moment from 'moment';
import { useSelector } from 'react-redux';
import styles from './ContestBox.module.sass';
import CONSTANTS from '../../constants';
import { IoTimeOutline } from 'react-icons/io5';
import { IoCheckmark } from 'react-icons/io5';

const ContestBox = props => {
  const { role } = useSelector(state => state.userStore.data);

  const getTimeStr = () => {
    const diff = moment.duration(moment().diff(moment(props.data.createdAt)));
    let str = '';
    if (diff._data.days !== 0) str = `${diff._data.days}d `;
    if (diff._data.hours !== 0) str += `${diff._data.hours}h`;
    if (str.length === 0) str = 'less than one hour';
    return str;
  };

  const getPreferenceContest = () => {
    const { data } = props;
    if (data.contestType === CONSTANTS.NAME_CONTEST) return data.typeOfName;
    if (data.contestType === CONSTANTS.LOGO_CONTEST) return data.brandStyle;
    return data.typeOfTagline;
  };

  const ucFirstLetter = string =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const { id, title, contestType, prize, count, goToExtended, Offers } =
    props.data;

  const sumStatus = status => {
    const sum = Offers.filter(o => o.status === status).length;
    return sum;
  };
  
  return (
    <div
      className={styles.contestBoxContainer}
      onClick={() => props.goToExtended(id)}
    >
      <div className={styles.mainContestInfo}>
        <div className={styles.titleAndIdContainer}>
          <span className={styles.title}>{title}</span>
          <span className={styles.id}>{`(#${id})`}</span>
        </div>
        <div className={styles.contestType}>
          <span>{`${ucFirstLetter(
            contestType
          )} / ${getPreferenceContest()}`}</span>
        </div>
        <div className={styles.contestType}>
          <span>
            This is an Invitation Only Contest and is only open to those
            Creatives who have achieved a Tier A status.
          </span>
        </div>
        <div className={styles.prizeContainer}>
          <div className={styles.guaranteedContainer}>
            <div>
              <img
                src={`${CONSTANTS.STATIC_IMAGES_PATH}smallCheck.png`}
                alt='check'
              />
            </div>
            <span>Guaranteed prize</span>
          </div>
          <div className={styles.prize}>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}diamond.png`}
              alt='diamond'
            />
            <span>{`$${prize}`}</span>
          </div>
        </div>
      </div>
      <div className={styles.entryAndTimeContainer}>
        <div className={styles.entriesContainer}>
          {role === CONSTANTS.CREATOR && (
            <div className={styles.infoStatusBlok}>
              <img
                src={`${CONSTANTS.STATIC_IMAGES_PATH}entrieImage.png`}
                alt='logo'
              />
              <span>{count}</span>
            </div>
          )}
          {role === CONSTANTS.CUSTOMER && (
            <>
              <div className={styles.infoStatusBlok}>
                <IoCheckmark className={styles.approveIconCounter} />
                <span>
                  {sumStatus(CONSTANTS.OFFER_STATUS_MODERATOR_APPROVED)}
                </span>
              </div>
              <div className={styles.infoStatusBlok}>
                <IoTimeOutline className={styles.pendingIconCounter} />
                <span>{sumStatus(CONSTANTS.OFFER_STATUS_PENDING)}</span>
              </div>
            </>
          )}
        </div>
        <div className={styles.timeContainer}>
          <span className={styles.timeContest}>{getTimeStr()}</span>
          <span>Going</span>
        </div>
      </div>
    </div>
  );
};

export default ContestBox;
