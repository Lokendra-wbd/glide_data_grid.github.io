export default function UserPresenceBar({ activeUsers, currentUserId, sessionCount }) {
  return (
    <div className="flex items-center gap-2" aria-label="Active collaborators">
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
        {sessionCount} session{sessionCount !== 1 ? 's' : ''} active
      </span>
      <div className="flex items-center gap-1">
        {activeUsers.map((user) => (
          <div
            key={user.tabId ?? user.id}
            className="group relative"
            title={`${user.name} (${user.initials})${user.isCurrent || user.id === currentUserId ? ' — you' : ''}`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ${
                user.isCurrent || user.id === currentUserId ? 'ring-purple-400 ring-offset-1' : 'ring-transparent'
              }`}
              style={{ backgroundColor: user.color }}
            >
              {user.initials}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
