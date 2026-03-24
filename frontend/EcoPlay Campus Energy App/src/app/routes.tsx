import { createBrowserRouter } from 'react-router';
import { VotePage } from './components/vote-page';
import { StatsPage } from './components/stats-page';
import { ChatPage } from './components/chat-page';
import { BottomNav } from './components/bottom-nav';
import { SettingsPage } from './components/settings-page';

function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-7xl min-h-screen mx-auto bg-white flex flex-col shadow-none md:shadow-2xl">
      <div className="flex-1 overflow-hidden min-h-0">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-3xl min-h-screen mx-auto bg-white flex flex-col shadow-none sm:shadow-xl">
      <div className="flex-1 overflow-hidden min-h-0">{children}</div>
      <BottomNav publicOnly />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <OperatorLayout>
        <VotePage />
      </OperatorLayout>
    ),
  },
  {
    path: '/stats',
    element: (
      <OperatorLayout>
        <StatsPage />
      </OperatorLayout>
    ),
  },
  {
    path: '/chat',
    element: (
      <OperatorLayout>
        <ChatPage />
      </OperatorLayout>
    ),
  },
  {
    path: '/settings',
    element: (
      <OperatorLayout>
        <SettingsPage />
      </OperatorLayout>
    ),
  },
  {
    path: '/user',
    element: (
      <PublicLayout>
        <VotePage />
      </PublicLayout>
    ),
  },
  {
    path: '/user/stats',
    element: (
      <PublicLayout>
        <StatsPage />
      </PublicLayout>
    ),
  },
  {
    path: '/user/chat',
    element: (
      <PublicLayout>
        <ChatPage />
      </PublicLayout>
    ),
  },
]);
