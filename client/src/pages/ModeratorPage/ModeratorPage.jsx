import React, { useEffect } from 'react';
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
  const {
    contestByIdStore: { offers },
    getPendingOffers,
    setReviewOfferStatus,
  } = props;
  useEffect(() => {
    getPendingOffers();
  }, []);

  return (
    <main className={styles.moderatorWrapper}>
      <section className={styles.reviewOfferBox}>
        <div className={styles.reviewHeader}>
          <h2 className={styles.titleModerator}>
            Offers to review: {offers.length}
          </h2>
          <button
            onClick={() => props.getPendingOffers()}
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
  getPendingOffers: () => dispatch(getPendingOffers()),
  setReviewOfferStatus: data => dispatch(setReviewOfferStatus(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ModeratorPage));
