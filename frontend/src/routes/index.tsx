import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.tsx";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingFallback from "@/components/LoadingFallback";

const HomePage = lazy(() => import("@/pages/Home/index.tsx"));
const AboutPage = lazy(() => import("@/pages/About/index.tsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFound/index.tsx"));

const LayoutWrapper = () => (
    <ErrorBoundary>
        <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
                <Outlet />
            </Suspense>
        </MainLayout>
    </ErrorBoundary>
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutWrapper />,
        errorElement: <ErrorBoundary/>,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
])

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;