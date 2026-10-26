import styles from './OfferBoxReview.module.sass';
import CONSTANTS from '../../../constants';
import { confirmAlert } from 'react-confirm-alert';

const MetaRow = ({ title, value }) => (
  <div className={styles.metaRow}>
    <dt className={styles.title}>{title}</dt>
    <dd>{value}</dd>
  </div>
);

const OfferBoxReview = props => {
  const { offers, setReviewOfferStatus } = props;
  
  const setStatusOffer = (id, status) => {
    const offer = offers.find(offer => offer.id === id);
    const data = {
      id: id,
      status: status,
      email: offer.User.email,
    };
    confirmAlert({
      title: status,
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => setReviewOfferStatus(data),
        },
        {
          label: 'No',
        },
      ],
    });
  };
  return (
    <>
      {offers.filter(o => o.Contest && o.User).map(o => (
        <article key={o.id} className={styles.reviewBlock}>
          <h3 className={styles.reviewTitle}>Contest info</h3>
          <div className={styles.offerCard}>
            <dl className={styles.contestMeta}>
              <MetaRow title='Contest type:' value={o.Contest.contestType} />
              <MetaRow title='Title:' value={o.Contest.title} />
              <MetaRow title='Industry:' value={o.Contest.industry} />
              <div className={styles.metaRow}>
                {o.Contest.styleName === null ? null : (
                  <>
                    <dt className={styles.title}>Style name:</dt>
                    <dd>{o.Contest.styleName}</dd>
                  </>
                )}
              </div>
            </dl>
            {o.text === null ? (
              <img
                src={`${CONSTANTS.publicURL}${o.fileName}`}
                alt='logo'
                className={styles.reviewLogo}
              />
            ) : (
              <p className={styles.offerContent}>{o.text}</p>
            )}
          </div>
          <div className={styles.blockButton}>
            <button
              className={styles.approvedBtn}
              onClick={() =>
                setStatusOffer(o.id, CONSTANTS.OFFER_STATUS_MODERATOR_APPROVED)
              }
            >
              Approved
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() =>
                setStatusOffer(o.id, CONSTANTS.OFFER_STATUS_MODERATOR_CANCEL)
              }
            >
              Cancel
            </button>
          </div>
        </article>
      ))}
    </>
  );
};

export default OfferBoxReview;
