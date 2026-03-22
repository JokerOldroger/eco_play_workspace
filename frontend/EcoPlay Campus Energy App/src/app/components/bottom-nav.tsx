import { Link, useLocation } from 'react-router';
import { ThumbsUp, BarChart3, MessageCircle, Settings } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Vote', icon: ThumbsUp },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
    { path: '/chat', label: 'Chat', icon: MessageCircle },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
