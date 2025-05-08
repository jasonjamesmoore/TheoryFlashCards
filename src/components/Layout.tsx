import { Outlet } from 'react-router-dom';
import { AppShell } from '@mantine/core';

export default function Layout() {
  return (
    <AppShell header={{ height: 60 }} padding="md" navbar={{ width: 200, breakpoint: 'sm' }}>
        <AppShell.Header/>
        <AppShell.Main>
        <Outlet />
        </AppShell.Main>
      <Outlet />
    </AppShell>
  );
}
