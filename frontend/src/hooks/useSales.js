import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useSales = () => {
  const [state, setState] = useState({
    data: [],
    filters: {},
    search: '',
    filterValues: {},
    sortField: null,
    sortOrder: 'asc',
    page: 1,
    limit: 10,
    total: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get(`${API_URL}/sales/filters`);
        setState((prev) => ({ ...prev, filters: res.data }));
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [state.search, state.filterValues, state.sortField, state.sortOrder, state.page, state.limit]);

  const fetchData = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const params = {
        search: state.search,
        page: state.page,
        limit: state.limit,
        sortField: state.sortField,
        sortOrder: state.sortOrder,
      };

      Object.entries(state.filterValues).forEach(([k, v]) => {
        if (Array.isArray(v) && v.length > 0) {
          params[k] = v;
        } else if (v) {
          params[k] = v;
        }
      });

      const res = await axios.get(`${API_URL}/sales`, { params });
      setState((prev) => ({
        ...prev,
        data: res.data.data,
        total: res.data.total,
        loading: false,
      }));
    } catch (err) {
      console.error('Error fetching data:', err);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSearch = (q) => {
    setState((prev) => ({ ...prev, search: q, page: 1 }));
  };

  const handleFilterChange = (k, v) => {
    setState((prev) => {
      const fv = prev.filterValues[k] || [];
      const upd = fv.includes(v) ? fv.filter((x) => x !== v) : [...fv, v];
      return {
        ...prev,
        filterValues: { ...prev.filterValues, [k]: upd },
        page: 1,
      };
    });
  };

  const handleSortChange = (field) => {
    setState((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  const resetFilters = () => {
    setState((prev) => ({
      ...prev,
      search: '',
      filterValues: {},
      sortField: null,
      sortOrder: 'asc',
      page: 1,
    }));
  };

  return {
    ...state,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    resetFilters,
  };
};

export default useSales;
