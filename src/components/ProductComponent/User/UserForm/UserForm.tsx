import { Grid, TextField } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { PII_LABEL } from '@/constants/pdpa';
import { TypeCreateUser, TypePiiField, TypeResUserData } from '@/types/products/user';
import { EMAIL_PATTERN, isThaiCitizenId, PHONE_PATTERN } from '@/utils/validators';

type UserFormProps = {
  form: UseFormReturn<TypeCreateUser>;
  mode: 'create' | 'edit';
  // ข้อมูลปัจจุบันแบบ mask — ใช้เป็น placeholder ตอนแก้ไข (ไม่ถอดรหัสค่าจริงมาใส่ฟอร์ม)
  current?: TypeResUserData | null;
};

const FIELDS: { name: TypePiiField; required?: boolean; multiline?: boolean; half?: boolean }[] = [
  { name: 'firstName', required: true, half: true },
  { name: 'lastName', required: true, half: true },
  { name: 'email', required: true, half: true },
  { name: 'phone', half: true },
  { name: 'citizenId' },
  { name: 'address', multiline: true },
  { name: 'healthNote', multiline: true }
];

const RULES: Partial<Record<TypePiiField, object>> = {
  email: { pattern: { value: EMAIL_PATTERN, message: 'รูปแบบอีเมลไม่ถูกต้อง' } },
  phone: { pattern: { value: PHONE_PATTERN, message: 'รูปแบบเบอร์โทรไม่ถูกต้อง' } },
  citizenId: { validate: (v?: string) => !v || isThaiCitizenId(v) || 'เลขบัตรประชาชนไม่ถูกต้อง' }
};

function UserForm({ form, mode, current }: UserFormProps) {
  const {
    register,
    formState: { errors }
  } = form;
  const isEdit = mode === 'edit';

  return (
    <Grid container spacing={2} sx={{ pt: 1 }}>
      {FIELDS.map(({ name, required, multiline, half }) => {
        const error = errors[name]?.message as string | undefined;
        const placeholder = isEdit ? current?.[name] || '-' : undefined;

        return (
          <Grid item xs={12} sm={half ? 6 : 12} key={name}>
            <TextField
              fullWidth
              size="small"
              label={PII_LABEL[name]}
              required={required && !isEdit}
              multiline={multiline}
              minRows={multiline ? 2 : undefined}
              placeholder={placeholder}
              InputLabelProps={isEdit ? { shrink: true } : undefined}
              error={Boolean(error)}
              helperText={error}
              {...register(name, {
                ...(required && !isEdit ? { required: `กรุณากรอก${PII_LABEL[name]}` } : {}),
                ...RULES[name]
              })}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default UserForm;
