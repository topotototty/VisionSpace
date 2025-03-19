import { FC } from "react";
import { useAuth } from "hooks/useAuth";
import { PrivateRouteProps } from "models/Routes";
import { Navigate, Outlet } from "react-router-dom";
import UserService from "services/user/service";

const PrivateRoute: FC<PrivateRouteProps> = ({
    requiredPermission,
    children,
}) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        const permissions = UserService.getPermissions();
        const hasAccess = permissions.includes(requiredPermission);
        return hasAccess
            ? (children ? <>{children}</> : <Outlet />)
            : <Navigate to='/home' replace />;
    }

}


export default PrivateRoute;