import apiClient from '../axios';
import { TypeConsentDocument, TypeRecordConsent, TypeUploadConsentDocument, TypeUserConsent } from '@/types/products/consent';

async function listConsentDocument(): Promise<IReturnResponse<TypeConsentDocument[]>> {
  const res = await apiClient({
    method: 'GET',
    url: '/consent-document'
  });

  return res.data;
}

/** payload เป็น null ถ้ายังไม่เคยอัปโหลดเอกสาร */
async function getLatestConsentDocument(): Promise<IReturnResponse<TypeConsentDocument | null>> {
  const res = await apiClient({
    method: 'GET',
    url: '/consent-document/latest'
  });

  return res.data;
}

/** ส่งไฟล์ PDF เป็น body ตรงๆ — เลขเวอร์ชัน API กำหนดให้เอง (ล่าสุด + 1) */
async function uploadConsentDocument({ file, title, note }: TypeUploadConsentDocument): Promise<IReturnResponse<TypeConsentDocument>> {
  const params = new URLSearchParams({ title, fileName: file.name });

  if (note) params.append('note', note);

  const res = await apiClient({
    method: 'POST',
    url: `/consent-document?${params.toString()}`,
    headers: { 'Content-Type': 'application/pdf' },
    data: file
  });

  return res.data;
}

async function getConsentDocumentFile({ version }: { version: number }): Promise<Blob> {
  const res = await apiClient({
    method: 'GET',
    url: `/consent-document/${version}/file`,
    responseType: 'blob'
  });

  return res.data;
}

async function getUserConsent({ id }: { id: string }): Promise<IReturnResponse<TypeUserConsent>> {
  const res = await apiClient({
    method: 'GET',
    url: `/user/${id}/consent`
  });

  return res.data;
}

async function recordUserConsent({ id, data }: { id: string; data: TypeRecordConsent }): Promise<IReturnResponse<{ id: string }>> {
  const res = await apiClient({
    method: 'POST',
    url: `/user/${id}/consent`,
    data
  });

  return res.data;
}

export { listConsentDocument, getLatestConsentDocument, uploadConsentDocument, getConsentDocumentFile, getUserConsent, recordUserConsent };
