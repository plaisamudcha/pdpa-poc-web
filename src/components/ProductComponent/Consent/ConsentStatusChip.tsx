import { Chip, ChipProps } from '@mui/material';
import { CONSENT_STATUS_LABEL } from '@/constants/pdpa';
import { TypeConsentSummary } from '@/types/products/consent';

/** ป้ายสถานะความยินยอม พร้อมเวอร์ชันที่ยอมรับ เช่น "ยอมรับแล้ว v3", "ต้องยอมรับใหม่ v2 → v3" */
function ConsentStatusChip({ consent, ...props }: { consent: TypeConsentSummary } & Omit<ChipProps, 'label' | 'color'>) {
  const { label, color } = CONSENT_STATUS_LABEL[consent.status];
  const version =
    consent.status === 'accepted'
      ? ` v${consent.version}`
      : consent.status === 'outdated'
        ? ` v${consent.version} → v${consent.latestVersion}`
        : consent.status === 'withdrawn'
          ? ` v${consent.version}`
          : '';

  return <Chip size="small" variant={consent.status === 'accepted' ? 'outlined' : 'filled'} color={color} label={`${label}${version}`} {...props} />;
}

export default ConsentStatusChip;
