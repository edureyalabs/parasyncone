import Link from 'next/link'

interface Organization {
  id: string
  name: string
  description: string
  created_at: string
}

interface OrganizationCardProps {
  organization: Organization
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link href={`/organizations/${organization.id}/workforce`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer max-w-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{organization.name}</h3>
            <p className="text-gray-600">{organization.description}</p>
          </div>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Active
          </div>
        </div>
        
        <div className="mt-6 flex items-center text-blue-600 font-medium">
          <span>View Workforce</span>
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}