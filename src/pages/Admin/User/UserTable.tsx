import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
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
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ReactElement } from 'react';
import { PII_LABEL } from '@/constants/pdpa';
import { TypePiiField } from '@/types/products/user';
import useListUserTable from './useListUserTable';
import UserFormModal from './component/UserFormModal';
import UserDetailModal from './component/UserDetailModal';
import DeleteUserModal from './component/DeleteUserModal';

const COLUMNS: TypePiiField[] = ['firstName', 'lastName', 'email', 'citizenId', 'phone', 'healthNote'];

function ActionButton({ title, disabled, onClick, children }: { title: string; disabled?: boolean; onClick: () => void; children: ReactElement }) {
  return (
    <Tooltip title={disabled ? `${title} (ไม่มีสิทธิ์)` : title}>
      <span>
        <IconButton size="small" disabled={disabled} onClick={onClick} aria-label={title}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function UserTable() {
  const hook = useListUserTable();

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          รายการผู้ใช้
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ข้อมูลส่วนบุคคลทุก field ถูกเข้ารหัส (AES-256-GCM แยก key ต่อผู้ใช้) ก่อนบันทึกลง MongoDB — ตารางนี้แสดงแบบ mask เสมอ
        </Typography>
      </Box>

      <Paper variant="outlined">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2 }} alignItems={{ md: 'flex-start' }}>
          <TextField
            size="small"
            fullWidth
            placeholder="ชื่อ / นามสกุล / อีเมล (3 ตัวแรกขึ้นไป), 4 ตัวท้ายเบอร์โทรหรือเลขบัตร, อีเมลเต็ม, เลขบัตร 13 หลัก"
            helperText="ข้อมูลถูกเข้ารหัส จึงค้นหาผ่าน blind index — ชื่อ/อีเมลค้นได้แบบขึ้นต้นด้วย (ใช้ 5 ตัวแรกของคำค้น), เบอร์โทร/เลขบัตรค้นด้วย 4 ตัวท้าย"
            value={hook.searchInput}
            onChange={(e) => hook.setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && hook.handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: hook.searchInput ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={hook.handleClearSearch} aria-label="ล้างคำค้น">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={hook.handleSearch} sx={{ whiteSpace: 'nowrap' }}>
              ค้นหา
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={hook.handleCreate} disabled={!hook.policy.create} sx={{ whiteSpace: 'nowrap' }}>
              เพิ่มผู้ใช้
            </Button>
          </Stack>
        </Stack>

        {hook.isLoading && <LinearProgress />}
        {hook.errorMessage && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
            {hook.errorMessage}
          </Alert>
        )}

        <TableContainer>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                {COLUMNS.map((field) => (
                  <TableCell key={field} sx={{ fontWeight: 600 }}>
                    {PII_LABEL[field]}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600 }}>วันที่สร้าง</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  จัดการ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hook.data.map((user) => (
                <TableRow key={user.id} hover>
                  {COLUMNS.map((field) => (
                    <TableCell key={field} sx={{ fontFamily: field === 'citizenId' || field === 'phone' ? 'monospace' : undefined }}>
                      {user[field] || '-'}
                    </TableCell>
                  ))}
                  <TableCell>{new Date(user.createdAt).toLocaleDateString('th-TH')}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <ActionButton title="ดูรายละเอียด" onClick={() => hook.handleView(user)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </ActionButton>
                    <ActionButton title="แก้ไข" disabled={!hook.policy.update} onClick={() => hook.handleEdit(user)}>
                      <EditOutlinedIcon fontSize="small" />
                    </ActionButton>
                    <ActionButton title="ส่งออกข้อมูล (JSON)" disabled={!hook.policy.export} onClick={() => hook.handleExport(user)}>
                      <FileDownloadOutlinedIcon fontSize="small" />
                    </ActionButton>
                    <ActionButton title="ลบข้อมูล" disabled={!hook.policy.erase} onClick={() => hook.handleDelete(user)}>
                      <DeleteOutlineIcon fontSize="small" color={hook.policy.erase ? 'error' : undefined} />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
              {!hook.isLoading && hook.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 2} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {hook.search.search ? 'ไม่พบผู้ใช้ที่ตรงกับคำค้น' : 'ยังไม่มีข้อมูลผู้ใช้'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={hook.total}
          page={hook.search.page - 1}
          rowsPerPage={hook.search.pageSize}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(_e, page) => hook.handleChangePage(page + 1)}
          onRowsPerPageChange={(e) => hook.handleChangePageSize(Number(e.target.value))}
          labelRowsPerPage="แถวต่อหน้า"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        />
      </Paper>

      {(hook.modal.type === 'create' || hook.modal.type === 'edit') && (
        <UserFormModal
          open
          mode={hook.modal.type}
          user={hook.modal.type === 'edit' ? hook.modal.user : null}
          onClose={hook.handleCloseModal}
        />
      )}
      {hook.modal.type === 'view' && <UserDetailModal open user={hook.modal.user} onClose={hook.handleCloseModal} />}
      {hook.modal.type === 'delete' && <DeleteUserModal open user={hook.modal.user} onClose={hook.handleCloseModal} />}
    </Stack>
  );
}

export default UserTable;
