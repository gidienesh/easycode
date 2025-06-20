import React from 'react';

interface DevOnlyRouteProps {
    children: React.ReactNode;
}

export const DevOnlyRoute: React.FC<DevOnlyRouteProps> = ({ children }) => {
    if (process.env.NODE_ENV !== 'development') {
        return <div>This page is only available in development mode.</div>;
    }

    return <>{children}</>;
};
