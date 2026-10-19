import { useState } from 'react';
import { Box, Button, Checkbox,FormControlLabel, FormHelperText, Paper, Stack, Typography } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { TypeConsentDocument } from '@/types/products/consent';
import PdfViewerDialog from './PdfViewerDialog';

type Props = {
  document: TypeConsentDocument;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

/**
 * เปิดเอกสาร PDPA ให้เจ้าของข้อมูลอ่าน แล้วติ๊กยอมรับ — ติ๊กได้หลังเปิดเอกสารแล้วเท่านั้น
 * ใส่ key={document.version} ที่ตัวที่เรียกใช้ เพื่อให้เริ่มใหม่เมื่อมีเวอร์ชันใหม่
 */
function ConsentAcceptBox({ document, checked, onChange, disabled }: Props) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewed, setViewed] = useState(false);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2">{document.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            เวอร์ชัน {document.version} · ประกาศเมื่อ {new Date(document.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
          </Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<PictureAsPdfOutlinedIcon />} onClick={() => setViewerOpen(true)}>
          เปิดอ่านเอกสาร
        </Button>
      </Stack>

      <FormControlLabel
        sx={{ mt: 1.5, alignItems: 'flex-start' }}
        control={<Checkbox checked={checked} disabled={disabled || !viewed} onChange={(e) => onChange(e.target.checked)} sx={{ pt: 0.25 }} />}
        label={
          <Typography variant="body2">
            เจ้าของข้อมูลได้อ่านและยอมรับ <b>{document.title}</b> เวอร์ชัน {document.version}
          </Typography>
        }
      />
      {!viewed && <FormHelperText sx={{ ml: 4 }}>ต้องเปิดเอกสารให้เจ้าของข้อมูลอ่านก่อน จึงจะติ๊กยอมรับได้</FormHelperText>}

      <PdfViewerDialog open={viewerOpen} document={document} onClose={() => setViewerOpen(false)} onLoaded={() => setViewed(true)} />
    </Paper>
  );
}

export default ConsentAcceptBox;
