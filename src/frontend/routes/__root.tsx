import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
  // notFoundComponent: NotFoundPage,
  // errorComponent: ErrorPage,
});

function RootComponent() {
  return <Outlet />;
}
