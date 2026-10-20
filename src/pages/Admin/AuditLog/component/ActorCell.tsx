import { Chip, Link, Stack, Tooltip, Typography } from '@mui/material';
import { AUDIT_ROLE_LABEL } from '@/constants/pdpa';
import { TypeResAuditLog } from '@/types/products/auditLog';

function ActorCell({ actor, onFilter }: { actor: TypeResAuditLog['actor']; onFilter: (username: string) => void }) {
  if (actor.username) {
    return (
      <Stack spacing={0.25}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {actor.displayName}
          </Typography>
          <Chip size="small" variant="outlined" label={AUDIT_ROLE_LABEL[actor.role]} sx={{ height: 20 }} />
          {actor.isActive === false && <Chip size="small" color="default" label="ปิดบัญชีแล้ว" sx={{ height: 20 }} />}
        </Stack>
        <Tooltip title="ดูทุกรายการของพนักงานคนนี้">
          <Link
            component="button"
            variant="caption"
            underline="hover"
            color="text.secondary"
            onClick={() => onFilter(actor.username!)}
            sx={{ textAlign: 'left' }}
          >
            {actor.username}
          </Link>
        </Tooltip>
      </Stack>
    );
  }

  // ไม่ใช่บัญชีพนักงาน: job ของระบบ หรือ login ด้วย username ที่ไม่มีอยู่จริง
  return (
    <Stack spacing={0.25}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {AUDIT_ROLE_LABEL[actor.role] ?? actor.role}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
        {actor.id}
      </Typography>
    </Stack>
  );
}

export default ActorCell;
