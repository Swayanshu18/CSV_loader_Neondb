const dataService = require('../services/dataService');

const getSales = async (req, res) => {
  try {
    const { search, sortField, sortOrder, page, limit, ...flt } = req.query;

    let s = null;
    if (sortField) {
      s = { field: sortField, order: sortOrder || 'asc' };
    }

    const fltrs = {};
    const keys = ['Customer Region', 'Gender', 'Product Category', 'Payment Method', 'Tags'];

    keys.forEach(k => {
      if (flt[k]) {
        fltrs[k] = Array.isArray(flt[k]) ? flt[k] : [flt[k]];
      }
    });

    if (flt.minAge && flt.maxAge) {
      const mn = parseInt(flt.minAge);
      const mx = parseInt(flt.maxAge);
      fltrs['Age Range'] = [Math.min(mn, mx), Math.max(mn, mx)];
    }
    if (flt.startDate && flt.endDate) {
      fltrs['Date Range'] = [flt.startDate, flt.endDate];
    }

    const result = await dataService.getSales({
      search,
      filters: fltrs,
      sort: s,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });

    res.json(result);
  } catch (err) {
    console.error('Error getting sales:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getFilters = async (req, res) => {
  try {
    const opts = await dataService.getFilterOptions();
    res.json(opts);
  } catch (err) {
    console.error('Error getting filters:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getSales, getFilters };
