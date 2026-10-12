import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import UserForm from '@/components/ProductComponent/User/UserForm/UserForm';
import useUserForm from '@/components/ProductComponent/User/UserForm/useUserForm';
import { TypeResUserData } from '@/types/products/user';

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  user?: TypeResUserData | null;
  onClose: () => void;
};

function UserFormModal({ open, mode, user, onClose }: Props) {
  const { form, onSubmit, isSubmitting } = useUserForm({ mode, user, onSuccess: onClose });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={onSubmit} noValidate>
        <DialogTitle>{mode === 'create' ? 'เพิ่มผู้ใช้' : 'แก้ไขข้อมูลผู้ใช้ (มาตรา 35)'}</DialogTitle>
        <DialogContent>
          {mode === 'edit' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              กรอกเฉพาะช่องที่ต้องการแก้ไข ช่องที่เว้นว่างจะไม่ถูกเปลี่ยน — ฟอร์มไม่ดึงค่าจริงมาแสดง เพื่อไม่ต้องถอดรหัสข้อมูลโดยไม่จำเป็น
            </Alert>
          )}
          <UserForm form={form} mode={mode} current={user} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UserFormModal;
