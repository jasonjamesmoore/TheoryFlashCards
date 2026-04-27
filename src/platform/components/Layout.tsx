import { IconHome, IconSettings, IconCalendarTime, IconCalendar, IconAxe } from '@tabler/icons-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from './Header';

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  // TODO: Extract sidebar variants when Notebook navigation needs page data/date grouping.
  const isNotebook = location.pathname.startsWith('/notebook');

  const navItems = isNotebook
    ? [
        { id: 'today', label: 'Today', icon: IconCalendar, href: '/notebook' },
        { id: 'recent', label: 'Recent', icon: IconCalendarTime, href: '/notebook' },
        { id: 'tools', label: 'Tools', icon: IconAxe, href: '/' },
        { id: 'settings', label: 'Settings', icon: IconSettings, href: '/settings' },
      ]
    : [
        { id: 'tools', label: 'Tools', icon: IconHome, href: '/' },
        { id: 'settings', label: 'Settings', icon: IconSettings, href: '/settings' },
      ];

  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" gap="md" justify="space-between" style={{ position: 'relative' }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Header />
          </div>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="0">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              component={Link}
              to={item.href}
              label={item.label}
              leftSection={<item.icon size={16} />}
              active={location.pathname === item.href}
              onClick={() => {
                if (window.innerWidth < 576) {
                  toggle();
                }
              }}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Breadcrumbs />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
