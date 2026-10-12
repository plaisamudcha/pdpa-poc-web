import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '@/services/api/axios';
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
  const form = useForm<TypeCreateUser>({ defaultValues: EMPTY_FORM });
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUserMutation();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  useEffect(() => {
    form.reset(EMPTY_FORM);
  }, [mode, user?.id, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const data = pickFilled(values);

    try {
      if (mode === 'create') {
        await createUser({ data: data as TypeCreateUser });
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
      openSnackbar(getErrorMessage(error), 'error');
    }
  });

  return { form, onSubmit, isSubmitting: isCreating || isUpdating };
};

export default useUserForm;
