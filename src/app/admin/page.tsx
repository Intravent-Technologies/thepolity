import { permanentRedirect } from 'next/navigation';

export default function LegacyAdminRedirect() {
  permanentRedirect('/secure-admin-dashboard');
}
