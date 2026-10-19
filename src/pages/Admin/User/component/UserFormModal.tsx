import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import ConsentAcceptBox from '@/components/ProductComponent/Consent/ConsentAcceptBox';
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
  const { form, onSubmit, isSubmitting, consentDocument, consentAccepted, setConsentAccepted, isLoadingConsent } = useUserForm({
    mode,
    user,
    onSuccess: onClose
  });
  const consentRequired = mode === 'create' && !!consentDocument;

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

          {mode === 'create' && !isLoadingConsent && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                ความยินยอม PDPA
              </Typography>
              {consentDocument ? (
                <ConsentAcceptBox
                  key={consentDocument.version}
                  document={consentDocument}
                  checked={consentAccepted}
                  onChange={setConsentAccepted}
                />
              ) : (
                <Alert severity="warning">ยังไม่มีเอกสาร PDPA ในระบบ — ผู้ใช้จะถูกบันทึกโดยยังไม่มีการยอมรับ</Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting || isLoadingConsent || (consentRequired && !consentAccepted)}>
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UserFormModal;
