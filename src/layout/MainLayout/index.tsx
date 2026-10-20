import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppBar, Box, Button, Chip, Container, Stack, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { ROLE_POLICY } from '@/constants/pdpa';
import useAuth from '@/hooks/useAuth';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  if (!user) return null;
  const policy = ROLE_POLICY[user.role];

  // เมนูที่ role ไม่มีสิทธิ์จะไม่แสดง
  const menus = [
    { path: '/admin/users', label: 'จัดการผู้ใช้', icon: <PeopleOutlineIcon fontSize="small" />, show: true },
    { path: '/admin/consent-documents', label: 'เอกสาร PDPA', icon: <DescriptionOutlinedIcon fontSize="small" />, show: true },
    { path: '/admin/audit-logs', label: 'Audit log', icon: <HistoryOutlinedIcon fontSize="small" />, show: policy.audit },
    { path: '/admin/login-history', label: 'ประวัติการเข้าสู่ระบบ', icon: <LoginOutlinedIcon fontSize="small" />, show: policy.audit }
  ].filter((menu) => menu.show);
  const current = menus.find((menu) => pathname.startsWith(menu.path))?.path ?? false;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
          <ShieldOutlinedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            PDPA POC
          </Typography>
          <Tabs value={current} sx={{ flexGrow: 1, minHeight: 40 }}>
            {menus.map((menu) => (
              <Tab
                key={menu.path}
                value={menu.path}
                label={menu.label}
                icon={menu.icon}
                iconPosition="start"
                component={Link}
                to={menu.path}
                sx={{ minHeight: 40, textTransform: 'none' }}
              />
            ))}
          </Tabs>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.username}
              </Typography>
            </Box>
            <Tooltip title={policy.reveal}>
              <Chip size="small" color="primary" variant="outlined" label={policy.label} />
            </Tooltip>
            <Button size="small" color="inherit" startIcon={<LogoutIcon fontSize="small" />} onClick={logout}>
              ออกจากระบบ
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
