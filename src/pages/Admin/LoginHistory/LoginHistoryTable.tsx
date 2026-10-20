import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { AUDIT_ACTION_LABEL, AUDIT_RESULT_LABEL, AUTH_ACTIONS } from '@/constants/pdpa';
import { TypeAuditAction, TypeAuditResult } from '@/types/products/auditLog';
import ActorCell from '../AuditLog/component/ActorCell';
import useListAuditLogTable from '../AuditLog/useListAuditLogTable';

// login ไม่มีผล not_found — username ผิดบันทึกเป็น denied
const RESULTS: TypeAuditResult[] = ['ok', 'denied'];

function LoginHistoryTable() {
  const hook = useListAuditLogTable('auth');

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          ประวัติการเข้าสู่ระบบ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          การเข้าสู่ระบบ / ออกจากระบบของพนักงาน รวมถึงครั้งที่ไม่สำเร็จและบัญชีถูกล็อก
        </Typography>
      </Box>

      <Paper variant="outlined">
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                select
                size="small"
                fullWidth
                label="การกระทำ"
                value={hook.form.action}
                onChange={(e) => hook.setField('action', e.target.value as TypeAuditAction | '')}
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {AUTH_ACTIONS.map((action) => (
                  <MenuItem key={action} value={action}>
                    {AUDIT_ACTION_LABEL[action]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                select
                size="small"
                fullWidth
                label="ผลลัพธ์"
                value={hook.form.result}
                onChange={(e) => hook.setField('result', e.target.value as TypeAuditResult | '')}
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {RESULTS.map((result) => (
                  <MenuItem key={result} value={result}>
                    {AUDIT_RESULT_LABEL[result].label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                size="small"
                fullWidth
                label="Username พนักงาน"
                value={hook.form.username}
                onChange={(e) => hook.setField('username', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && hook.handleSearch()}
              />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <TextField
                size="small"
                fullWidth
                type="date"
                label="ตั้งแต่วันที่"
                InputLabelProps={{ shrink: true }}
                value={hook.form.from}
                onChange={(e) => hook.setField('from', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <TextField
                size="small"
                fullWidth
                type="date"
                label="ถึงวันที่"
                InputLabelProps={{ shrink: true }}
                value={hook.form.to}
                onChange={(e) => hook.setField('to', e.target.value)}
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1.5 }}>
            <Button
              color="inherit"
              startIcon={<FilterAltOffOutlinedIcon />}
              onClick={hook.handleReset}
              disabled={!hook.hasFilter && !Object.values(hook.form).some(Boolean)}
            >
              ล้างตัวกรอง
            </Button>
            <Button variant="contained" startIcon={<SearchIcon />} onClick={hook.handleSearch}>
              ค้นหา
            </Button>
          </Stack>
          {hook.formError && (
            <Alert severity="warning" sx={{ mt: 1.5 }}>
              {hook.formError}
            </Alert>
          )}
        </Box>

        {hook.isLoading && <LinearProgress />}
        {hook.errorMessage && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
            {hook.errorMessage}
          </Alert>
        )}

        <TableContainer>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>เวลา</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>พนักงาน</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>การกระทำ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ผลลัพธ์</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>สาเหตุ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hook.data.map((log) => (
                <TableRow key={log.id} hover sx={{ verticalAlign: 'top' }}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium' })}
                  </TableCell>
                  <TableCell>
                    <ActorCell actor={log.actor} onFilter={hook.handleFilterActor} />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{AUDIT_ACTION_LABEL[log.action] ?? log.action}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      color={AUDIT_RESULT_LABEL[log.result]?.color ?? 'default'}
                      label={AUDIT_RESULT_LABEL[log.result]?.label ?? log.result}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 320, wordBreak: 'break-word' }}>{log.reason || '-'}</TableCell>
                </TableRow>
              ))}
              {!hook.isLoading && hook.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {hook.hasFilter ? 'ไม่พบรายการที่ตรงกับตัวกรอง' : 'ยังไม่มีประวัติการเข้าสู่ระบบ'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={hook.total}
          page={hook.page - 1}
          rowsPerPage={hook.pageSize}
          rowsPerPageOptions={[25, 50, 100]}
          onPageChange={(_e, page) => hook.handleChangePage(page + 1)}
          onRowsPerPageChange={(e) => hook.handleChangePageSize(Number(e.target.value))}
          labelRowsPerPage="แถวต่อหน้า"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        />
      </Paper>
    </Stack>
  );
}

export default LoginHistoryTable;
