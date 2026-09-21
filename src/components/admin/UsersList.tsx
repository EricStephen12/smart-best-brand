'use client'

import React, { useState } from 'react'
import {
  Users,
  Shield,
  ShieldAlert,
  Search,
  Loader2,
  Calendar,
  ShoppingBag,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateUserRole, type UserListItem } from '@/actions/users'

interface UsersListProps {
  initialUsers: UserListItem[]
  currentAdminId: string
}

export default function UsersList({ initialUsers, currentAdminId }: UsersListProps) {
  const [users, setUsers] = useState<UserListItem[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase()
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term))
    )
  })

  const totalAdmins = users.filter((u) => u.role === 'ADMIN').length
  const totalCustomers = users.filter((u) => u.role === 'CUSTOMER').length

  const handleRoleToggle = async (user: UserListItem) => {
    const newRole = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'
    const confirmMsg =
      newRole === 'ADMIN'
        ? `Are you sure you want to promote ${user.name || user.email} to ADMIN? They will have full access to orders, products, and site settings.`
        : `Are you sure you want to remove ADMIN privileges from ${user.name || user.email}?`

    if (!window.confirm(confirmMsg)) return

    setUpdatingId(user.id)
    try {
      const result = await updateUserRole(user.id, newRole)
      if (result.success) {
        setUsers((prev) =>
          prev.map((item) => (item.id === user.id ? { ...item, role: newRole } : item))
        )
        toast.success(
          newRole === 'ADMIN'
            ? `${user.name || user.email} is now an Admin`
            : `Admin privileges removed for ${user.name || user.email}`
        )
      } else {
        toast.error(result.error || 'Failed to update role')
      }
    } catch {
      toast.error('Network error updating user role')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Accounts</p>
            <p className="text-2xl font-bold text-blue-950 mt-0.5">{users.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administrators</p>
            <p className="text-2xl font-bold text-blue-950 mt-0.5">{totalAdmins}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shoppers / Customers</p>
            <p className="text-2xl font-bold text-blue-950 mt-0.5">{totalCustomers}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search registered accounts by name, email, or phone number..."
          className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredUsers.map((user) => {
                const isCurrentAdmin = user.id === currentAdminId
                const isAdmin = user.role === 'ADMIN'
                const isUpdating = updatingId === user.id

                return (
                  <tr key={user.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* User Name & ID */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-blue-950">
                          {user.name || 'Unnamed Account'}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          ID: {user.id.slice(0, 8)}…
                        </p>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium">{user.email}</span>
                        </div>
                        {user.phone ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        ) : null}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          <Shield className="w-3.5 h-3.5 text-sky-600" />
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-slate-600">
                          CUSTOMER
                        </span>
                      )}
                    </td>

                    {/* Orders count */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        {user._count.orders}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            dateStyle: 'medium',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-right">
                      {isCurrentAdmin ? (
                        <span className="text-xs font-medium text-slate-400 italic">
                          (Your Session)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(user)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer ${
                            isAdmin
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-blue-950 text-white hover:bg-sky-700'
                          }`}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : isAdmin ? (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          ) : (
                            <Shield className="w-3.5 h-3.5" />
                          )}
                          <span>{isAdmin ? 'Revoke Admin' : 'Make Admin'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    {searchTerm
                      ? `No accounts found matching "${searchTerm}".`
                      : 'No registered accounts found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
