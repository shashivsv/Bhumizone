import { ROLES } from '../config/roles';

export function getRoleDashboardPath(role) {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin/dashboard';
    case ROLES.DEALER:
      return '/dealer/dashboard';
    case ROLES.OWNER:
      return '/owner/dashboard';
    case ROLES.BUYER:
    default:
      return '/saved-properties';
  }
}
