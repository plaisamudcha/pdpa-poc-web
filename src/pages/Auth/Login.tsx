import { Alert, Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import useLogin from './useLogin';

function Login() {
  const { form, onSubmit, errorMessage, showPassword, toggleShowPassword } = useLogin();
  const {
    register,
    formState: { errors, isSubmitting }
  } = form;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 400 }}>
        <form onSubmit={onSubmit} noValidate>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ShieldOutlinedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                PDPA POC
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              เข้าสู่ระบบสำหรับเจ้าหน้าที่
            </Typography>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
              label="ชื่อผู้ใช้"
              size="small"
              autoComplete="username"
              autoFocus
              error={Boolean(errors.username)}
              helperText={errors.username?.message}
              {...register('username', { required: 'กรุณากรอกชื่อผู้ใช้' })}
            />
            <TextField
              label="รหัสผ่าน"
              size="small"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={toggleShowPassword} aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}>
                      {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('password', { required: 'กรุณากรอกรหัสผ่าน' })}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              เข้าสู่ระบบ
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
