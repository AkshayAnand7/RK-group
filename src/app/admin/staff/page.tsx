import { getStaffMembers } from "./actions";
import StaffClient from "./staff-client";

export const dynamic = 'force-dynamic';

export default async function StaffManagementPage() {
  const staff = await getStaffMembers();

  return <StaffClient initialStaff={staff} />;
}
