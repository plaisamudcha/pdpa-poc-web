import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getConsentDocumentFile,
  getLatestConsentDocument,
  getUserConsent,
  listConsentDocument,
  recordUserConsent,
  uploadConsentDocument
} from '@/services/api/consent';

function useGetConsentDocumentsQuery() {
  return useQuery({
    queryFn: listConsentDocument,
    queryKey: ['GET_LIST_CONSENT_DOCUMENTS']
  });
}

function useGetLatestConsentDocumentQuery({ enable }: { enable?: boolean } = {}) {
  return useQuery({
    queryFn: getLatestConsentDocument,
    queryKey: ['GET_LATEST_CONSENT_DOCUMENT'],
    enabled: enable
  });
}

/** ไฟล์ของแต่ละเวอร์ชันไม่เปลี่ยนแล้ว — cache ได้ตลอด session */
function useGetConsentDocumentFileQuery({ version, enable }: { version: number; enable?: boolean }) {
  return useQuery({
    queryFn: () => getConsentDocumentFile({ version }),
    queryKey: ['GET_CONSENT_DOCUMENT_FILE', version],
    enabled: enable,
    staleTime: Infinity
  });
}

function useUploadConsentDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadConsentDocument,
    mutationKey: ['UPLOAD_CONSENT_DOCUMENT'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_LIST_CONSENT_DOCUMENTS'] });
      queryClient.invalidateQueries({ queryKey: ['GET_LATEST_CONSENT_DOCUMENT'] });
      // เวอร์ชันใหม่ทำให้สถานะของทุกคนที่ยอมรับเวอร์ชันเก่าเปลี่ยนเป็น "ต้องยอมรับใหม่"
      queryClient.invalidateQueries({ queryKey: ['GET_LIST_USERS'] });
      queryClient.invalidateQueries({ queryKey: ['GET_USER_CONSENT'] });
    }
  });
}

function useGetUserConsentQuery({ id }: { id: string }) {
  return useQuery({
    queryFn: () => getUserConsent({ id }),
    queryKey: ['GET_USER_CONSENT', id]
  });
}

function useRecordUserConsentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordUserConsent,
    mutationKey: ['RECORD_USER_CONSENT'],
    // refetch แม้ล้มเหลว — เช่น 409 เพราะมีเวอร์ชันใหม่ระหว่างเปิด modal
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['GET_USER_CONSENT', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['GET_LIST_USERS'] });
    }
  });
}

export {
  useGetConsentDocumentsQuery,
  useGetLatestConsentDocumentQuery,
  useGetConsentDocumentFileQuery,
  useUploadConsentDocumentMutation,
  useGetUserConsentQuery,
  useRecordUserConsentMutation
};
