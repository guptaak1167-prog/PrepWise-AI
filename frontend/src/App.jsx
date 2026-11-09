import { RouterProvider } from 'react-router';
import { router } from './app.routes.jsx';
import { AuthProvider } from './features/auth/auth.context.jsx';
import { InterviewProvider } from './features/interview/interview.context.jsx';

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App; //Here, <RouterProvider router={router} /> is passed to AuthProvider as its children prop.
