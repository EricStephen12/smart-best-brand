import { redirect } from 'next/navigation'

/** Mock customers page removed for launch — use Orders instead. */
export default function AdminCustomersPage() {
  redirect('/account/orders')
}
