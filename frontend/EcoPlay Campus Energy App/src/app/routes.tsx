import { createBrowserRouter } from 'react-router';
import { VotePage } from './components/vote-page';
import { StatsPage } from './components/stats-page';
import { ChatPage } from './components/chat-page';
import { BottomNav } from './components/bottom-nav';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[1024px] h-[600px] mx-auto bg-white flex flex-col shadow-2xl">
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <VotePage />
      </Layout>
    ),
  },
  {
    path: '/stats',
    element: (
      <Layout>
        <StatsPage />
      </Layout>
    ),
  },
  {
    path: '/chat',
    element: (
      <Layout>
        <ChatPage />
      </Layout>
    ),
  },
]);
