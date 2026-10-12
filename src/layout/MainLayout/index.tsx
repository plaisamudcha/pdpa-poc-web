import { Outlet } from 'react-router-dom';
import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { ROLE_POLICY } from '@/constants/pdpa';
import useAuth from '@/hooks/useAuth';

export default function MainLayout() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const policy = ROLE_POLICY[user.role];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
          <ShieldOutlinedIcon color="primary" />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            PDPA POC
          </Typography>
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
