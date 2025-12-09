import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '../styles/FilterPanel.module.css';

const FilterDropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button onClick={() => setOpen(!open)} className={styles.button}>
        {label}
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className={styles.menu}>
          {options.map((opt) => (
            <label key={opt} className={styles.option}>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterPanel = ({ filters, filterValues, onFilterChange, onReset }) => {
  return (
    <div className={styles.container}>
      <h3>Filters</h3>
      {Object.entries(filters).map(([k, v]) => (
        <FilterDropdown
          key={k}
          label={k}
          options={v}
          selected={filterValues[k] || []}
          onChange={(opt) => onFilterChange(k, opt)}
        />
      ))}
      
      <div className={styles.rangeGroup}>
        <label>Age Range</label>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            placeholder="Min"
            value={filterValues.minAge || ''}
            onChange={(e) => onFilterChange('minAge', e.target.value)}
            className={styles.rangeInput}
          />
          <input
            type="number"
            placeholder="Max"
            value={filterValues.maxAge || ''}
            onChange={(e) => onFilterChange('maxAge', e.target.value)}
            className={styles.rangeInput}
          />
        </div>
        {filterValues.minAge && filterValues.maxAge && 
         parseInt(filterValues.minAge) > parseInt(filterValues.maxAge) && (
          <p className={styles.warning}>⚠️ Min age must be less than max age</p>
        )}
      </div>

      <div className={styles.rangeGroup}>
        <label>Date Range</label>
        <div className={styles.rangeInputs}>
          <input
            type="date"
            value={filterValues.startDate || ''}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className={styles.rangeInput}
          />
          <input
            type="date"
            value={filterValues.endDate || ''}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className={styles.rangeInput}
          />
        </div>
      </div>

      <button onClick={onReset} className={styles.resetBtn}>
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;
