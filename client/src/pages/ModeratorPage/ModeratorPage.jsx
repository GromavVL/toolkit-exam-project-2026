import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './ModeratorPage.module.sass';
import { getPendingOffers } from '../../store/slices/contestByIdSlice';
import withRouter from '../../hocs/withRouter';
import CONSTANTS from '../../constants';
import OfferBoxReview from '../../components/OfferBox/OfferBoxReview/OfferBoxReview';

const ModeratorPage = props => {
  const {
    contestByIdStore: { offers },
    getPendingOffers,
  } = props;
  useEffect(() => {
    getPendingOffers();
  }, []);

  return (
    <main className={styles.moderatorWrapper}>
      <section className={styles.reviewOfferBox}>
        <h2 className={styles.titleModerator}>
          Offers to review: {offers.length}
        </h2>
        <button
          onClick={() => props.getPendingOffers()}
          className={styles.refreshButton}
        >
          Refresh
        </button>
        {props.userStore.data.role === CONSTANTS.MODERATOR ? (
          <OfferBoxReview offers={offers} />
        ) : (
          <p>You are not a moderator</p>
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ModeratorPage));
