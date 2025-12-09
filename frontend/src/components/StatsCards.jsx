import styles from '../styles/StatsCards.module.css';

const StatsCards = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h4>Total Units</h4>
        <p className={styles.value}>10</p>
      </div>
      <div className={styles.card}>
        <h4>Total Amount</h4>
        <p className={styles.value}>$89,000</p>
      </div>
      <div className={styles.card}>
        <h4>Total Discount</h4>
        <p className={styles.value}>$15,000</p>
      </div>
    </div>
  );
};

export default StatsCards;
