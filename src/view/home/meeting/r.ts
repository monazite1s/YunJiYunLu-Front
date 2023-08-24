import type { RouterInfo } from '@/types/route';
import { role } from '@/types/route';

export default {
  meta: {
    role: role.Admin | role.Dapartment | role.Total,
    intro: '会议',
  },
  props: true,
} as RouterInfo;