import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import ConsentAcceptBox from '@/components/ProductComponent/Consent/ConsentAcceptBox';
import ConsentStatusChip from '@/components/ProductComponent/Consent/ConsentStatusChip';
import PdfViewerDialog from '@/components/ProductComponent/Consent/PdfViewerDialog';
import { CONSENT_ACTION_LABEL, ROLE_POLICY } from '@/constants/pdpa';
import useAuth from '@/hooks/useAuth';
import useSnackbar from '@/hooks/useSnackbar';
import { getErrorMessage } from '@/services/api/axios';
import { useGetUserConsentQuery, useRecordUserConsentMutation } from '@/services/queries/consent';
import { TypeConsentDocument } from '@/types/products/consent';
import { TypeResUserData } from '@/types/products/user';

type Props = {
  open: boolean;
  user: TypeResUserData;
  onClose: () => void;
};

/** สถานะความยินยอม + บันทึกการยอมรับ / ถอนความยินยอมแทนเจ้าของข้อมูล + ประวัติ */
function UserConsentModal({ open, user, onClose }: Props) {
  const role = useAuth().user!.role;
  const canRecord = ROLE_POLICY[role].consent;
  const { openSnackbar } = useSnackbar();
  const [accepted, setAccepted] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [reason, setReason] = useState('');
  const [viewing, setViewing] = useState<Pick<TypeConsentDocument, 'version' | 'title' | 'fileName'> | null>(null);

  const { data, isLoading, error } = useGetUserConsentQuery({ id: user.id });
  const { mutateAsync: record, isPending } = useRecordUserConsentMutation();

  const consent = data?.payload;
  const latest = consent?.latestDocument ?? null;
  const needAccept = !!latest && consent?.status !== 'accepted';
  // ถอนได้เมื่อรายการล่าสุดเป็นการยอมรับ (แม้เป็นเวอร์ชันเก่า)
  const canWithdraw = consent?.status === 'accepted' || consent?.status === 'outdated';

  const handleAccept = async () => {
    if (!latest) return;
    try {
      await record({ id: user.id, data: { action: 'accept', version: latest.version } });
      openSnackbar(`บันทึกการยอมรับเอกสารเวอร์ชัน ${latest.version} แล้ว`);
      setAccepted(false);
    } catch (err) {
      openSnackbar(getErrorMessage(err), 'error');
    }
  };

  const handleWithdraw = async () => {
    try {
      await record({ id: user.id, data: { action: 'withdraw', reason: reason.trim() } });
      openSnackbar('บันทึกการถอนความยินยอมแล้ว');
      setWithdrawing(false);
      setReason('');
    } catch (err) {
      openSnackbar(getErrorMessage(err), 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        ความยินยอม PDPA
        <Typography variant="body2" color="text.secondary">
          {[user.firstName, user.lastName].filter(Boolean).join(' ')} · {user.email}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {isLoading && <LinearProgress />}
        {error && <Alert severity="error">{getErrorMessage(error)}</Alert>}

        {consent && (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                สถานะ
              </Typography>
              <ConsentStatusChip consent={consent} />
              {consent.status === 'outdated' && (
                <Typography variant="body2" color="warning.main">
                  มีเอกสารเวอร์ชันใหม่ — ต้องให้เจ้าของข้อมูลยอมรับอีกครั้ง
                </Typography>
              )}
            </Stack>

            {!latest && <Alert severity="info">ยังไม่มีเอกสาร PDPA ในระบบ — DPO ต้องอัปโหลดที่เมนู "เอกสาร PDPA" ก่อน</Alert>}

            {needAccept && latest && (
              <Stack spacing={1.5}>
                <ConsentAcceptBox key={latest.version} document={latest} checked={accepted} onChange={setAccepted} disabled={!canRecord} />
                <Box sx={{ textAlign: 'right' }}>
                  <Button variant="contained" disabled={!canRecord || !accepted || isPending} onClick={handleAccept}>
                    บันทึกการยอมรับ
                  </Button>
                </Box>
              </Stack>
            )}

            {canWithdraw && !withdrawing && (
              <Box>
                <Button color="error" variant="outlined" size="small" disabled={!canRecord} onClick={() => setWithdrawing(true)}>
                  ถอนความยินยอม
                </Button>
              </Box>
            )}
            {canWithdraw && withdrawing && (
              <Stack spacing={1.5}>
                <Alert severity="warning">
                  เจ้าของข้อมูลถอนความยินยอมได้ทุกเมื่อ (มาตรา 19) — การถอนไม่ลบข้อมูลที่เก็บไว้แล้ว ถ้าต้องการลบให้ดำเนินการลบข้อมูล (มาตรา 33) แยกต่างหาก
                </Alert>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField
                    size="small"
                    fullWidth
                    label="เหตุผลในการถอน"
                    placeholder="เช่น เจ้าของข้อมูลแจ้งทางโทรศัพท์ คำขอ #123"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    inputProps={{ maxLength: 300 }}
                  />
                  <Button onClick={() => setWithdrawing(false)} disabled={isPending}>
                    ยกเลิก
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={!reason.trim() || isPending}
                    onClick={handleWithdraw}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    ยืนยันการถอน
                  </Button>
                </Stack>
              </Stack>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                ประวัติ
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>วันที่</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>รายการ</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>เอกสาร</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>บันทึกโดย</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>เหตุผล</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consent.history.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {new Date(r.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                      </TableCell>
                      <TableCell sx={{ color: r.action === 'withdraw' ? 'error.main' : undefined }}>{CONSENT_ACTION_LABEL[r.action]}</TableCell>
                      <TableCell>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => setViewing({ version: r.version, title: `เอกสาร PDPA เวอร์ชัน ${r.version}`, fileName: `pdpa-v${r.version}.pdf` })}
                        >
                          v{r.version}
                        </Link>
                      </TableCell>
                      <TableCell>{r.recordedBy.displayName ?? r.recordedBy.id}</TableCell>
                      <TableCell>{r.reason ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                  {consent.history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        ยังไม่มีประวัติ
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>ปิด</Button>
      </DialogActions>

      {viewing && <PdfViewerDialog open document={viewing} onClose={() => setViewing(null)} />}
    </Dialog>
  );
}

export default UserConsentModal;
