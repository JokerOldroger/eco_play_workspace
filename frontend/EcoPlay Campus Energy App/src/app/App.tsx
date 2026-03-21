import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      <RouterProvider router={router} />
    </div>
  );
}
