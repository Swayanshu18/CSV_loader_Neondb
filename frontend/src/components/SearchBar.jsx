import { useState, useEffect } from 'react';
import styles from '../styles/SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search by Customer Name or Phone..."
        value={input}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );
};

export default SearchBar;
