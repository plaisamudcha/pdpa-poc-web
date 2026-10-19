import { useState } from 'react';
import { ROLE_POLICY } from '@/constants/pdpa';
import useAuth from '@/hooks/useAuth';
import { getErrorMessage } from '@/services/api/axios';
import { useGetConsentDocumentsQuery } from '@/services/queries/consent';
import { TypeConsentDocument } from '@/types/products/consent';

const useConsentDocumentTable = () => {
  const role = useAuth().user!.role;
  const policy = ROLE_POLICY[role];

  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewing, setViewing] = useState<TypeConsentDocument | null>(null);

  const { data: documentsData, isLoading, isFetching, error } = useGetConsentDocumentsQuery();

  // API เรียงใหม่สุดก่อน — ตัวแรกคือเวอร์ชันที่ใช้อยู่
  const data = documentsData?.payload ?? [];
  const latest = data[0] ?? null;

  return {
    policy,
    data,
    latest,
    isLoading: isLoading || isFetching,
    errorMessage: error ? getErrorMessage(error) : null,
    uploadOpen,
    handleOpenUpload: () => setUploadOpen(true),
    handleCloseUpload: () => setUploadOpen(false),
    viewing,
    handleView: (doc: TypeConsentDocument) => setViewing(doc),
    handleCloseView: () => setViewing(null)
  };
};

export default useConsentDocumentTable;
