/** ตรวจ checksum เลขบัตรประชาชนไทย 13 หลัก (ต้องตรงกับฝั่ง API) */
export function isThaiCitizenId(value: string): boolean {
  const d = value.replace(/\D/g, '');
  if (d.length !== 13) return false;
  const sum = Array.from(d.slice(0, 12)).reduce((acc, n, i) => acc + Number(n) * (13 - i), 0);
  return (11 - (sum % 11)) % 10 === Number(d[12]);
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^[\d\s+-]{9,15}$/;
