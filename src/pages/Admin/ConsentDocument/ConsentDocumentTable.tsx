import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import PdfViewerDialog from '@/components/ProductComponent/Consent/PdfViewerDialog';
import formatFileSize from '@/utils/formatFileSize';
import useConsentDocumentTable from './useConsentDocumentTable';
import UploadConsentDocumentModal from './component/UploadConsentDocumentModal';

function ConsentDocumentTable() {
  const hook = useConsentDocumentTable();

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ md: 'flex-end' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            เอกสาร PDPA
          </Typography>
          <Typography variant="body2" color="text.secondary">
            นโยบายความเป็นส่วนตัว / หนังสือขอความยินยอม (มาตรา 19, 23) — อัปโหลดไฟล์ใหม่จะได้เวอร์ชันถัดไปอัตโนมัติ
            และผู้ใช้ที่ยอมรับเวอร์ชันเก่าจะต้องยอมรับใหม่
          </Typography>
        </Box>
        <Tooltip title={hook.policy.document ? '' : 'อัปโหลดเอกสาร (เฉพาะ DPO)'}>
          <span>
            <Button
              variant="contained"
              startIcon={<UploadFileOutlinedIcon />}
              disabled={!hook.policy.document}
              onClick={hook.handleOpenUpload}
              sx={{ whiteSpace: 'nowrap' }}
            >
              อัปโหลดเวอร์ชันใหม่
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Paper variant="outlined">
        {hook.isLoading && <LinearProgress />}
        {hook.errorMessage && (
          <Alert severity="error" sx={{ m: 2 }}>
            {hook.errorMessage}
          </Alert>
        )}

        <TableContainer>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>เวอร์ชัน</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ชื่อเอกสาร</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ไฟล์</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>อัปโหลดโดย</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>วันที่ประกาศ</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  เอกสาร
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hook.data.map((doc) => (
                <TableRow key={doc.id} hover selected={doc.id === hook.latest?.id}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        v{doc.version}
                      </Typography>
                      {doc.id === hook.latest?.id && <Chip size="small" color="primary" label="ใช้อยู่" />}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{doc.title}</Typography>
                    {doc.note && (
                      <Typography variant="caption" color="text.secondary">
                        {doc.note}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {doc.fileName}
                    </Typography>
                    <Tooltip title={`SHA-256: ${doc.sha256}`}>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(doc.fileSize)} · {doc.sha256.slice(0, 12)}…
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{doc.uploadedBy.displayName ?? doc.uploadedBy.id}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Date(doc.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="เปิดเอกสาร">
                      <IconButton size="small" onClick={() => hook.handleView(doc)} aria-label="เปิดเอกสาร">
                        <PictureAsPdfOutlinedIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!hook.isLoading && hook.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    ยังไม่มีเอกสาร PDPA — ระหว่างนี้เพิ่มผู้ใช้ได้โดยยังไม่มีการยอมรับ
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {hook.uploadOpen && <UploadConsentDocumentModal open latest={hook.latest} onClose={hook.handleCloseUpload} />}
      {hook.viewing && <PdfViewerDialog open document={hook.viewing} onClose={hook.handleCloseView} />}
    </Stack>
  );
}

export default ConsentDocumentTable;
