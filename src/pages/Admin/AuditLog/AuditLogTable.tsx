import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Link,
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
  Tooltip,
  Typography
} from '@mui/material';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { AUDIT_ACTION_LABEL, AUDIT_RESULT_LABEL, AUTH_ACTIONS, PII_LABEL } from '@/constants/pdpa';
import { TypeAuditAction, TypeAuditResult } from '@/types/products/auditLog';
import ActorCell from './component/ActorCell';
import useListAuditLogTable from './useListAuditLogTable';

// login/logout แยกไปหน้าประวัติการเข้าสู่ระบบ
const ACTIONS = (Object.keys(AUDIT_ACTION_LABEL) as TypeAuditAction[]).filter((action) => !AUTH_ACTIONS.includes(action));
const RESULTS = Object.keys(AUDIT_RESULT_LABEL) as TypeAuditResult[];

/** action ที่ field ในคอลัมน์หมายถึง "field ที่ถอดรหัสแบบเต็ม" — update หมายถึง "field ที่ถูกแก้" */
const FIELD_HINT: Partial<Record<TypeAuditAction, string>> = {
  read: 'ถอดรหัส',
  export: 'ถอดรหัส',
  update: 'แก้ไข'
};

function AuditLogTable() {
  const hook = useListAuditLogTable('data');

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Audit log
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ประวัติการเข้าถึงข้อมูลส่วนบุคคล — ใครทำอะไร กับข้อมูลของใคร เมื่อไร และเหตุผล (log ไม่เก็บข้อมูลส่วนบุคคลของผู้ใช้
          เก็บแค่รหัสอ้างอิง)
        </Typography>
      </Box>

      <Paper variant="outlined">
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                size="small"
                fullWidth
                label="การกระทำ"
                value={hook.form.action}
                onChange={(e) => hook.setField('action', e.target.value as TypeAuditAction | '')}
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {ACTIONS.map((action) => (
                  <MenuItem key={action} value={action}>
                    {AUDIT_ACTION_LABEL[action]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                size="small"
                fullWidth
                label="Username พนักงาน"
                value={hook.form.username}
                onChange={(e) => hook.setField('username', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && hook.handleSearch()}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                size="small"
                fullWidth
                label="รหัสผู้ใช้ (เจ้าของข้อมูล)"
                value={hook.form.subjectId}
                onChange={(e) => hook.setField('subjectId', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && hook.handleSearch()}
                inputProps={{ style: { fontFamily: 'monospace' } }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
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
            <Grid item xs={6} md={2}>
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
          <Table size="small" sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>เวลา</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ผู้ทำรายการ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>การกระทำ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ผลลัพธ์</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>รหัสผู้ใช้ (เจ้าของข้อมูล)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Field ที่เกี่ยวข้อง</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>เหตุผล</TableCell>
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
                  <TableCell>
                    {log.subjectId ? (
                      <Tooltip title="ดูประวัติทั้งหมดของผู้ใช้คนนี้">
                        <Link
                          component="button"
                          variant="body2"
                          underline="hover"
                          onClick={() => hook.handleFilterSubject(log.subjectId!)}
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {log.subjectId}
                        </Link>
                      </Tooltip>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {log.fields.length > 0 ? (
                      <Stack spacing={0.5}>
                        {FIELD_HINT[log.action] && (
                          <Typography variant="caption" color="text.secondary">
                            {FIELD_HINT[log.action]}
                          </Typography>
                        )}
                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                          {log.fields.map((field) => (
                            <Chip
                              key={field}
                              size="small"
                              label={PII_LABEL[field] ?? field}
                              color={field === 'healthNote' ? 'warning' : 'default'}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280, wordBreak: 'break-word' }}>{log.reason || '-'}</TableCell>
                </TableRow>
              ))}
              {!hook.isLoading && hook.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {hook.hasFilter ? 'ไม่พบรายการที่ตรงกับตัวกรอง' : 'ยังไม่มี audit log'}
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

export default AuditLogTable;
