import { ensureAppUser } from '@/lib/auth'
import { getUsersList } from '@/actions/users'
import UsersList from '@/components/admin/UsersList'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Staff & User Management | Admin Backoffice',
}

export default async function AdminCustomersPage() {
  const admin = await ensureAppUser()
  if (!admin || admin.role !== 'ADMIN') {
    redirect('/login?redirect=/account/customers')
  }

  const result = await getUsersList()
  const users = result.success && result.data ? result.data : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
          Accounts &amp; Team Roles
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage registered customer accounts and promote or revoke administrator privileges.
        </p>
      </div>

      <UsersList initialUsers={users} currentAdminId={admin.id} />
    </div>
  )
}
