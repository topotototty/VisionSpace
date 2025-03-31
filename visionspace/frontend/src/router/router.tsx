import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Outlet
} from 'react-router-dom';
import Layout from 'components/Layout/root';
import Home from 'pages/home/page';
import Meeting from 'pages/meetings/meeting';
import Meetings from 'pages/meetings/meetings';
import Profile from 'pages/profile/page';
import Login from 'pages/auth/page';
import SignUp from "pages/reg/page";

// import Calendar from 'pages/calendar/page';
// import Plugins from 'pages/plugins/page';
// import OutlookPlugin from 'pages/plugins/outlook/page';

import PrivateRoute from 'components/PrivateRoutes/privateRoute';
import Dashboard from 'pages/dashboard/page';
import NotFound from 'pages/errors/404/page';
import ForgotPassword from 'pages/auth/forgotPassword';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Главная страница и общий макет */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                {/* Приватные маршруты для авторизованных пользователей */}
                <Route
                    element={
                        <PrivateRoute requiredPermission="MEMBER">
                            <Outlet />
                        </PrivateRoute>
                    }
                >
                    <Route path="/meetings" element={<Meetings />} />
                    {/* <Route path="/calendar" element={<Calendar />} /> */}
                    <Route path="/profile" element={<Profile />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute requiredPermission="TECH_SUPPORT">
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                </Route>

                {/* Плагины (доступ без авторизации) */}
                {/* <Route path="/plugins" element={<Plugins />} />
                <Route path="/plugins/outlook" element={<OutlookPlugin />} /> */}

                {/* Ошибка 404 */}
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Приватный маршрут для отдельных встреч */}
            <Route
                path="/meeting/:id"
                element={
                    <Meeting />
                }
            />

            {/* Страница авторизации */}
            <Route path="/sign-in" element={<Login />} />
            
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

        </>
    )
);