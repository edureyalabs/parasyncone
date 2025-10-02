interface Agent {
  id: string
  name: string
  bio: string
  type: 'SALES' | 'PROCUREMENT'
  avatar_url: string
  created_at: string
}

interface AgentCardProps {
  agent: Agent
}

export default function AgentCard({ agent }: AgentCardProps) {
  const typeConfig = {
    SALES: {
      icon: '💼',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    PROCUREMENT: {
      icon: '🛒',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    }
  }

  const config = typeConfig[agent.type]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={agent.avatar_url}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">{agent.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} flex items-center gap-1 flex-shrink-0 ml-2`}>
              <span>{config.icon}</span>
              {agent.type}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{agent.bio}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Created {new Date(agent.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}