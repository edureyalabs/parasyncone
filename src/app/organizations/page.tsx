import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import CreateOrganizationForm from '@/components/CreateOrganizationForm'
import OrganizationCard from '@/components/OrganizationCard'

export default async function OrganizationsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's organization
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parasync One</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Organization</h2>
          <p className="text-gray-600">Manage your organization and AI agents</p>
        </div>

        {!organization ? (
          <CreateOrganizationForm userId={user.id} />
        ) : (
          <OrganizationCard organization={organization} />
        )}
      </main>
    </div>
  )
}