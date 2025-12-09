import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Box, Typography, Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Timeline as NexusIcon,
  Input as IntakeIcon,
  MiscellaneousServices as ServicesIcon,
  PlayCircleOutline as PreActiveIcon,
  PlayCircleFilled as ActiveIcon,
  Block as BlockedIcon,
  CheckCircle as ClosedIcon,
  Receipt as InvoicesIcon,
  Description as ProformaIcon,
  AssignmentTurnedIn as FinalIcon,
  ExpandLess, ExpandMore
} from '@mui/icons-material';

const Sidebar = () => {
  const [servicesOpen, setServicesOpen] = useState(true);
  const [invoicesOpen, setInvoicesOpen] = useState(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', bgcolor: '#f5f7fa' },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#000' }}>V</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">Vault</Typography>
          <Typography variant="caption" color="textSecondary">Anurag Yadav</Typography>
        </Box>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><NexusIcon /></ListItemIcon>
            <ListItemText primary="Nexus" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><IntakeIcon /></ListItemIcon>
            <ListItemText primary="Intake" />
          </ListItemButton>
        </ListItem>

        {/* Services Dropdown */}
        <ListItemButton onClick={() => setServicesOpen(!servicesOpen)}>
          <ListItemIcon><ServicesIcon /></ListItemIcon>
          <ListItemText primary="Services" />
          {servicesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={servicesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon><PreActiveIcon /></ListItemIcon>
              <ListItemText primary="Pre-active" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} selected>
              <ListItemIcon><ActiveIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Active" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon><BlockedIcon /></ListItemIcon>
              <ListItemText primary="Blocked" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon><ClosedIcon /></ListItemIcon>
              <ListItemText primary="Closed" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Invoices Dropdown */}
        <ListItemButton onClick={() => setInvoicesOpen(!invoicesOpen)}>
          <ListItemIcon><InvoicesIcon /></ListItemIcon>
          <ListItemText primary="Invoices" />
          {invoicesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={invoicesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon><ProformaIcon /></ListItemIcon>
              <ListItemText primary="Proforma Invoices" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon><FinalIcon /></ListItemIcon>
              <ListItemText primary="Final Invoices" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
