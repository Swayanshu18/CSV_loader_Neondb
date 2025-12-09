import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import SalesDashboard from './components/SalesDashboard';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <SalesDashboard />
      </Box>
    </Box>
  );
}

export default App;
