import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import useSnackbar from '@/hooks/useSnackbar';
import { getErrorMessage } from '@/services/api/axios';
import { useDeleteUserMutation } from '@/services/queries/user';
import { TypeResUserData } from '@/types/products/user';

type Props = {
  open: boolean;
  user: TypeResUserData;
  onClose: () => void;
};

function DeleteUserModal({ open, user, onClose }: Props) {
  const { openSnackbar } = useSnackbar();
  const [reason, setReason] = useState('');
  const { mutateAsync: deleteUser, isPending } = useDeleteUserMutation();

  const handleSubmit = async () => {
    try {
      await deleteUser({ id: user.id, reason: reason.trim() });
      openSnackbar('ลบข้อมูลสำเร็จ — ทำลาย key แล้ว ข้อมูลไม่สามารถกู้คืนได้');
      onClose();
    } catch (error) {
      openSnackbar(getErrorMessage(error), 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>ยืนยันการลบข้อมูล (มาตรา 33)</DialogTitle>
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          ระบบจะทำลาย key ของผู้ใช้ {user.email} (crypto-shredding) ข้อมูลทุกที่รวมถึงใน backup จะถอดรหัสไม่ได้อีก และ<b>กู้คืนไม่ได้</b>
        </Alert>
        <TextField
          fullWidth
          size="small"
          label="เหตุผลในการลบ"
          placeholder="เช่น เจ้าของข้อมูลขอลบบัญชี"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          ยกเลิก
        </Button>
        <Button variant="contained" color="error" disabled={!reason.trim() || isPending} onClick={handleSubmit}>
          ยืนยันการลบข้อมูล
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteUserModal;
