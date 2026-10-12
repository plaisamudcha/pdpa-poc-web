import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { PII_LABEL, ROLE_POLICY } from '@/constants/pdpa';
import useAuth from '@/hooks/useAuth';
import useSnackbar from '@/hooks/useSnackbar';
import { getErrorMessage } from '@/services/api/axios';
import { useRevealUserMutation } from '@/services/queries/user';
import { TypePiiField, TypeResUserData } from '@/types/products/user';

type Props = {
  open: boolean;
  user: TypeResUserData;
  onClose: () => void;
};

const FIELDS = Object.keys(PII_LABEL) as TypePiiField[];

function UserDetailModal({ open, user, onClose }: Props) {
  const role = useAuth().user!.role;
  const { openSnackbar } = useSnackbar();
  const [reason, setReason] = useState('');
  const [revealed, setRevealed] = useState<TypeResUserData | null>(null);
  const { mutateAsync: reveal, isPending } = useRevealUserMutation();

  const canReveal = role !== 'support';
  const data = revealed ?? user;

  const handleReveal = async () => {
    try {
      const res = await reveal({ id: user.id, reason: reason.trim() });
      setRevealed(res.payload);
    } catch (error) {
      openSnackbar(getErrorMessage(error), 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>รายละเอียดผู้ใช้</DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableBody>
            {FIELDS.map((field) => (
              <TableRow key={field}>
                <TableCell sx={{ width: 200, color: 'text.secondary' }}>{PII_LABEL[field]}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {data[field] || '-'}
                    </Typography>
                    {data.revealed?.includes(field) && <Chip size="small" color="success" variant="outlined" label="ถอดรหัสแล้ว" />}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>ลบอัตโนมัติเมื่อ</TableCell>
              <TableCell>{new Date(data.retentionUntil).toLocaleDateString('th-TH', { dateStyle: 'long' })}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box sx={{ mt: 3 }}>
          {!canReveal && <Alert severity="warning">สิทธิ์ {ROLE_POLICY[role].label} เห็นข้อมูลแบบ mask เท่านั้น</Alert>}
          {canReveal && !revealed && (
            <Stack spacing={1.5}>
              <Alert severity="info">การเปิดดูข้อมูลเต็มต้องระบุเหตุผล และจะถูกบันทึกใน audit log ({ROLE_POLICY[role].reveal})</Alert>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                  size="small"
                  fullWidth
                  label="เหตุผลในการเปิดดู"
                  placeholder="เช่น ยืนยันตัวตนตามคำขอ #123"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <Button
                  variant="contained"
                  startIcon={<LockOpenOutlinedIcon />}
                  disabled={!reason.trim() || isPending}
                  onClick={handleReveal}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  เปิดดูข้อมูลเต็ม
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>ปิด</Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserDetailModal;
