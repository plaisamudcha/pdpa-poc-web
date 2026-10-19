import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/services/api/axios';
import { useGetLatestConsentDocumentQuery } from '@/services/queries/consent';
import { useCreateUserMutation, useUpdateUserMutation } from '@/services/queries/user';
import useSnackbar from '@/hooks/useSnackbar';
import { TypeCreateUser, TypeResUserData, TypeUpdateUser } from '@/types/products/user';

const EMPTY_FORM: TypeCreateUser = { firstName: '', lastName: '', email: '', citizenId: '', phone: '', address: '', healthNote: '' };

/** ส่งเฉพาะ field ที่กรอก — field ที่เว้นว่างตอนแก้ไขหมายถึง "ไม่เปลี่ยน" */
function pickFilled(values: TypeCreateUser): TypeUpdateUser {
  return Object.fromEntries(Object.entries(values).filter(([, v]) => typeof v === 'string' && v.trim() !== '')) as TypeUpdateUser;
}

const useUserForm = ({ mode, user, onSuccess }: { mode: 'create' | 'edit'; user?: TypeResUserData | null; onSuccess: () => void }) => {
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const form = useForm<TypeCreateUser>({ defaultValues: EMPTY_FORM });
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUserMutation();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  // ตอนเพิ่มผู้ใช้ เจ้าของข้อมูลต้องยอมรับเอกสาร PDPA เวอร์ชันล่าสุด (ถ้ามีเอกสารในระบบ)
  const { data: latestData, isLoading: isLoadingConsent } = useGetLatestConsentDocumentQuery({ enable: mode === 'create' });
  const consentDocument = mode === 'create' ? (latestData?.payload ?? null) : null;
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    form.reset(EMPTY_FORM);
  }, [mode, user?.id, form]);

  // มีเวอร์ชันใหม่ระหว่างกรอกฟอร์ม → ต้องเปิดอ่านและยอมรับใหม่
  useEffect(() => {
    setConsentAccepted(false);
  }, [consentDocument?.version]);

  const onSubmit = form.handleSubmit(async (values) => {
    const data = pickFilled(values);

    try {
      if (mode === 'create') {
        if (consentDocument && !consentAccepted) {
          openSnackbar('กรุณาให้เจ้าของข้อมูลอ่านและยอมรับเอกสาร PDPA ก่อน', 'warning');
          return;
        }
        await createUser({ data: { ...(data as TypeCreateUser), consentVersion: consentDocument?.version } });
        openSnackbar('เพิ่มผู้ใช้สำเร็จ — ข้อมูลถูกเข้ารหัสก่อนบันทึก');
      } else {
        if (!user) return;
        if (Object.keys(data).length === 0) {
          openSnackbar('กรุณากรอกอย่างน้อย 1 ช่องที่ต้องการแก้ไข', 'warning');
          return;
        }
        await updateUser({ id: user.id, data });
        openSnackbar('แก้ไขข้อมูลสำเร็จ');
      }
      onSuccess();
    } catch (error) {
      // อาจล้มเพราะมีเอกสารเวอร์ชันใหม่ — ดึงเวอร์ชันล่าสุดมาแสดงใหม่
      if (mode === 'create') queryClient.invalidateQueries({ queryKey: ['GET_LATEST_CONSENT_DOCUMENT'] });
      openSnackbar(getErrorMessage(error), 'error');
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: isCreating || isUpdating,
    consentDocument,
    consentAccepted,
    setConsentAccepted,
    isLoadingConsent: mode === 'create' && isLoadingConsent
  };
};

export default useUserForm;
