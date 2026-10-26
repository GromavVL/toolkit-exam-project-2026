import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './ModeratorPage.module.sass';
import {
  getPendingOffers,
  setReviewOfferStatus,
} from '../../store/slices/contestByIdSlice';
import withRouter from '../../hocs/withRouter';
import CONSTANTS from '../../constants';
import OfferBoxReview from '../../components/OfferBox/OfferBoxReview/OfferBoxReview';

const ModeratorPage = props => {
  const [offset, setOffset] = useState(0);
  const {
    contestByIdStore: { offers },
    getPendingOffers,
    setReviewOfferStatus,
  } = props;
  useEffect(() => {
    getPendingOffers({ limit: CONSTANTS.LIMIT, offset: offset });
  }, [offset]);
  const handlePrev = () =>
    setOffset(prev => Math.max(prev - CONSTANTS.LIMIT, 0));
  const handleNext = () => setOffset(prev => prev + CONSTANTS.LIMIT);

  return (
    <main className={styles.moderatorWrapper}>
      <section className={styles.reviewOfferBox}>
        <div className={styles.reviewHeader}>
          <h2 className={styles.titleModerator}>
            Offers to review: {offers.length}
          </h2>
          <div className={styles.blockButtonList}>
            <button className={styles.nextBtn} onClick={handlePrev}>
              {'<'}
            </button>
            <button className={styles.nextBtn} onClick={handleNext}>
              {'>'}
            </button>
          </div>
          <button
            onClick={() =>
              props.getPendingOffers({ limit: CONSTANTS.LIMIT, offset: offset })
            }
            className={styles.refreshButton}
          >
            Refresh
          </button>
        </div>
        {props.userStore.data.role === CONSTANTS.MODERATOR ? (
          <>
            {offers.length === 0 ? (
              <p className={styles.messagePreview}>
                You have no offers to review
              </p>
            ) : (
              <OfferBoxReview
                offers={offers}
                setReviewOfferStatus={setReviewOfferStatus}
              />
            )}
          </>
        ) : (
          <p className={styles.messagePreview}>You are not a moderator</p>
        )}
      </section>
    </main>
  );
};

const mapStateToProps = state => {
  const { contestByIdStore, userStore } = state;
  return { contestByIdStore, userStore };
};

const mapDispatchToProps = dispatch => ({
  getPendingOffers: data => dispatch(getPendingOffers(data)),
  setReviewOfferStatus: data => dispatch(setReviewOfferStatus(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ModeratorPage));
