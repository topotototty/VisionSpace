import 'assets/tailwind.css'
import 'react-toastify/dist/ReactToastify.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { AuthProvider } from 'hooks/useAuth';
import { ConferencesProvider } from 'hooks/useConferences';
import { InvitationsProvider } from 'hooks/useInvitations';
import { ToastContainer } from 'react-toastify';

const container = document.getElementById('vision');

if (!container) {
  throw new Error("Контейнер для приложения не найден. Пожалуйста, обратитесь к разработчику.");
}

const root = createRoot(container);

root.render(
  <AuthProvider>
    <ConferencesProvider>
      <InvitationsProvider>
        <>
          <RouterProvider router={router} />
          <ToastContainer // <-- вот он
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
            theme="dark"
          />
        </>
      </InvitationsProvider>
    </ConferencesProvider>
  </AuthProvider>
);
