import styles from '../styles/Pagination.module.css';

const Pagination = ({ page, limit, total, onPageChange }) => {
  const maxPage = Math.ceil(total / limit);

  return (
    <div className={styles.container}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={styles.btn}
      >
        Previous
      </button>
      <span className={styles.info}>
        Page {page} of {maxPage || 1}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= maxPage}
        className={styles.btn}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
