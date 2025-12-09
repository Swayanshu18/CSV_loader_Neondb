import styles from '../styles/SalesTable.module.css';

const SalesTable = ({ data, sortField, sortOrder, onSort }) => {
  const columns = [
    { field: 'Customer Name', width: '15%' },
    { field: 'Phone Number', width: '12%' },
    { field: 'Customer Region', width: '12%' },
    { field: 'Gender', width: '8%' },
    { field: 'Age', width: '6%' },
    { field: 'Product Category', width: '12%' },
    { field: 'Quantity', width: '8%' },
    { field: 'Date', width: '10%' },
    { field: 'Total Price', width: '10%' },
  ];

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                style={{ width: col.width }}
                onClick={() => onSort(col.field)}
                className={sortField === col.field ? styles.active : ''}
              >
                {col.field}
                {sortField === col.field && (
                  <span> {sortOrder === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.field} style={{ width: col.width }}>
                  {row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
