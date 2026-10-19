import { ChangeEvent, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { MAX_CONSENT_FILE_MB } from '@/constants/pdpa';
import useSnackbar from '@/hooks/useSnackbar';
import { getErrorMessage } from '@/services/api/axios';
import { useUploadConsentDocumentMutation } from '@/services/queries/consent';
import { TypeConsentDocument } from '@/types/products/consent';
import formatFileSize from '@/utils/formatFileSize';

type Props = {
  open: boolean;
  latest: TypeConsentDocument | null;
  onClose: () => void;
};

function UploadConsentDocumentModal({ open, latest, onClose }: Props) {
  const { openSnackbar } = useSnackbar();
  // ใช้ชื่อเดิมเป็นค่าเริ่มต้น — ส่วนใหญ่แก้แค่เนื้อหา
  const [title, setTitle] = useState(latest?.title ?? 'นโยบายความเป็นส่วนตัว');
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const { mutateAsync: upload, isPending } = useUploadConsentDocumentMutation();

  const nextVersion = (latest?.version ?? 0) + 1;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    e.target.value = '';
    if (!selected) return;

    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setFile(null);
      setFileError('รองรับเฉพาะไฟล์ PDF');
    } else if (selected.size > MAX_CONSENT_FILE_MB * 1024 * 1024) {
      setFile(null);
      setFileError(`ไฟล์ต้องมีขนาดไม่เกิน ${MAX_CONSENT_FILE_MB} MB`);
    } else {
      setFile(selected);
      setFileError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    try {
      const res = await upload({ file, title: title.trim(), note: note.trim() || undefined });
      openSnackbar(`อัปโหลดเอกสารเวอร์ชัน ${res.payload.version} สำเร็จ`);
      onClose();
    } catch (error) {
      openSnackbar(getErrorMessage(error), 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>อัปโหลดเอกสาร PDPA เวอร์ชันใหม่</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Alert severity="info">
            จะบันทึกเป็น <b>เวอร์ชัน {nextVersion}</b> และมีผลทันที
            {latest && ` — ผู้ใช้ที่ยอมรับเวอร์ชัน ${latest.version} หรือเก่ากว่าจะมีสถานะ "ต้องยอมรับใหม่"`}
          </Alert>
          <TextField
            size="small"
            fullWidth
            required
            label="ชื่อเอกสาร"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 200 }}
          />
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={2}
            label="สรุปสิ่งที่เปลี่ยน (ไม่บังคับ)"
            placeholder="เช่น เพิ่มวัตถุประสงค์การใช้ข้อมูลเพื่อการตลาด"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            inputProps={{ maxLength: 500 }}
          />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button component="label" variant="outlined" startIcon={<AttachFileIcon />} sx={{ whiteSpace: 'nowrap' }}>
              เลือกไฟล์ PDF
              <input hidden type="file" accept="application/pdf,.pdf" onChange={handleFile} />
            </Button>
            <Typography variant="body2" color={fileError ? 'error' : file ? 'text.primary' : 'text.secondary'} sx={{ wordBreak: 'break-all' }}>
              {fileError ?? (file ? `${file.name} (${formatFileSize(file.size)})` : `ยังไม่ได้เลือกไฟล์ — ไม่เกิน ${MAX_CONSENT_FILE_MB} MB`)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          ยกเลิก
        </Button>
        <Button variant="contained" disabled={!file || !title.trim() || isPending} onClick={handleSubmit}>
          อัปโหลดเป็นเวอร์ชัน {nextVersion}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadConsentDocumentModal;
