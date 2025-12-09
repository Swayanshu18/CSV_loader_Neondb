import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, TextField, MenuItem, Select, InputLabel, FormControl,
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
    Pagination
} from '@mui/material';
import {
    Search, Refresh, FileCopy, FilterList
} from '@mui/icons-material';
import axios from 'axios';

// Main dashboard comp
const SalesDashboard = () => {
    // state for data
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pgCount, setPgCount] = useState(1);

    // filters state - kinda messy but works
    const [f, setF] = useState({
        page: 1,
        limit: 10,
        search: '',
        sortField: 'Date',
        sortOrder: 'desc',
        'Customer Region': [],
        'Gender': [],
        'Product Category': [],
        'Payment Method': [],
        'Age Range': ''
    });

    // dropdown options
    const [opts, setOpts] = useState({
        regions: [],
        categories: [],
        paymentMethods: [],
        tags: []
    });

    // get filter options from backend
    const getOpts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/sales/filters');
            setOpts(res.data);
        } catch (e) {
            console.log("error fetching filters", e); // TODO: handle better
        }
    };

    // get main table data
    const getData = async () => {
        setIsLoading(true);
        try {
            // building query manually
            const p = new URLSearchParams();
            p.append('page', f.page);
            p.append('limit', f.limit);
            if (f.search) p.append('search', f.search);
            if (f.sortField) p.append('sortField', f.sortField);
            if (f.sortOrder) p.append('sortOrder', f.sortOrder);

            // loop for array filters
            Object.keys(f).forEach(k => {
                // special case for age range
                if (k === 'Age Range' && Array.isArray(f[k]) && f[k].length === 2) {
                    p.append('minAge', f[k][0]);
                    p.append('maxAge', f[k][1]);
                } else if (Array.isArray(f[k]) && f[k].length > 0) {
                    f[k].forEach(v => p.append(k, v));
                }
            });

            const res = await axios.get(`http://localhost:5000/api/sales?${p.toString()}`);
            setData(res.data.data);
            setPgCount(res.data.totalPages);
        } catch (e) {
            console.log("data fetch error", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getOpts();
    }, []);

    useEffect(() => {
        getData();
    }, [f]);

    // helper to update filter
    const onFilter = (k, v) => {
        setF(prev => ({ ...prev, [k]: v, page: 1 }));
    };

    const onPage = (e, v) => {
        setF(prev => ({ ...prev, page: v }));
    };

    // reset everything
    const clearAll = () => {
        setF({
            page: 1, limit: 10, search: '', sortField: 'Date', sortOrder: 'desc',
            'Customer Region': [], 'Gender': [], 'Age Range': '',
            'Product Category': [], 'Payment Method': []
        });
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f8f9fc', minHeight: '100vh', width: '100%' }}>
            {/* Header section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Sales Management System</Typography>
                <TextField
                    placeholder="Name, Phone no."
                    variant="outlined"
                    size="small"
                    InputProps={{ startAdornment: <Search color="action" /> }}
                    sx={{ bgcolor: 'white', borderRadius: 1, width: 300 }}
                    value={f.search}
                    onChange={(e) => setF(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                />
            </Box>

            {/* KPI stuff */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">Total units sold ⓘ</Typography>
                        <Typography variant="h6" fontWeight="bold">10</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">Total Amount ⓘ</Typography>
                        <Typography variant="h6" fontWeight="bold">₹89,000 (19 SRs)</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">Total Discount ⓘ</Typography>
                        <Typography variant="h6" fontWeight="bold">₹15000 (45 SRs)</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Filter controls */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <IconButton onClick={clearAll}><Refresh /></IconButton>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Customer Region</InputLabel>
                    <Select
                        multiple
                        value={f['Customer Region']}
                        label="Customer Region"
                        onChange={(e) => onFilter('Customer Region', e.target.value)}
                    >
                        {opts.regions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                        multiple
                        value={f['Gender']}
                        label="Gender"
                        onChange={(e) => onFilter('Gender', e.target.value)}
                    >
                        {['Male', 'Female'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Age Range</InputLabel>
                    <Select
                        value={f['Age Range'] || ''}
                        label="Age Range"
                        onChange={(e) => onFilter('Age Range', e.target.value)}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value={[18, 25]}>18 - 25</MenuItem>
                        <MenuItem value={[26, 35]}>26 - 35</MenuItem>
                        <MenuItem value={[36, 45]}>36 - 45</MenuItem>
                        <MenuItem value={[46, 60]}>46 - 60</MenuItem>
                        <MenuItem value={[60, 100]}>60+</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Product Category</InputLabel>
                    <Select
                        multiple
                        value={f['Product Category']}
                        label="Product Category"
                        onChange={(e) => onFilter('Product Category', e.target.value)}
                    >
                        {opts.categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150, ml: 'auto' }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={f.sortField}
                        label="Sort By"
                        onChange={(e) => onFilter('sortField', e.target.value)}
                    >
                        <MenuItem value="Date">Date</MenuItem>
                        <MenuItem value="Customer Name">Customer Name (A-Z)</MenuItem>
                        <MenuItem value="Quantity">Quantity</MenuItem>
                        <MenuItem value="Total Amount">Total Amount</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            {/* Main Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                        <TableRow>
                            <TableCell>Transaction ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer ID</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Product Category</TableCell>
                            <TableCell>Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={9} align="center">Loading...</TableCell></TableRow>
                        ) : data.map((row) => (
                            <TableRow key={row.transaction_id || row.id}>
                                <TableCell>{row.transaction_id || row.id}</TableCell>
                                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                <TableCell>{row.customer_id}</TableCell>
                                <TableCell>{row.customer_name}</TableCell>
                                <TableCell>{row.phone_number} <FileCopy sx={{ fontSize: 14, ml: 1, color: 'action.active' }} /></TableCell>
                                <TableCell>{row.gender}</TableCell>
                                <TableCell>{row.age}</TableCell>
                                <TableCell><Typography fontWeight="bold">{row.product_category}</Typography></TableCell>
                                <TableCell>{row.quantity.toString().padStart(2, '0')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box display="flex" justifyContent="center" p={3}>
                    <Pagination count={pgCount} page={f.page} onChange={onPage} />
                </Box>
            </TableContainer>
        </Box>
    );
};

export default SalesDashboard;
