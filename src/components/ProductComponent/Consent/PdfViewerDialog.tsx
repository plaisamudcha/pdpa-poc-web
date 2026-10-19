import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getErrorMessage } from '@/services/api/axios';
import { useGetConsentDocumentFileQuery } from '@/services/queries/consent';
import { TypeConsentDocument } from '@/types/products/consent';

type Props = {
  open: boolean;
  document: Pick<TypeConsentDocument, 'version' | 'title' | 'fileName'>;
  onClose: () => void;
  /** เรียกเมื่อโหลดไฟล์สำเร็จ — ใช้ยืนยันว่าเปิดเอกสารให้เจ้าของข้อมูลอ่านแล้ว */
  onLoaded?: () => void;
};

/** แสดงไฟล์ PDF ของเอกสาร PDPA — ดึงผ่าน API (ส่ง cookie) แล้วแสดงเป็น blob URL */
function PdfViewerDialog({ open, document, onClose, onLoaded }: Props) {
  const { data: blob, isLoading, error } = useGetConsentDocumentFileQuery({ version: document.version, enable: open });
  const [url, setUrl] = useState<string | null>(null);

  // สร้าง/คืน blob URL ใน effect เดียวกัน (StrictMode รัน effect ซ้ำได้โดยไม่ได้ URL ที่ถูก revoke ไปแล้ว)
  useEffect(() => {
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    onLoaded?.();
    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blob]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {document.title}
        <Typography variant="body2" color="text.secondary">
          เวอร์ชัน {document.version} · {document.fileName}
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: '75vh', display: 'flex' }}>
        {isLoading && (
          <Box sx={{ m: 'auto' }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ m: 2, flexGrow: 1, alignSelf: 'flex-start' }}>
            {getErrorMessage(error)}
          </Alert>
        )}
        {url && <Box component="iframe" src={url} title={document.title} sx={{ border: 0, width: '100%', height: '100%' }} />}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button
          startIcon={<OpenInNewIcon />}
          disabled={!url}
          href={url ?? ''}
          target="_blank"
          rel="noopener"
          sx={{ mr: 'auto' }}
        >
          เปิดในแท็บใหม่
        </Button>
        <Button startIcon={<FileDownloadOutlinedIcon />} disabled={!url} href={url ?? ''} download={document.fileName}>
          ดาวน์โหลด
        </Button>
        <Button variant="contained" onClick={onClose}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PdfViewerDialog;
