import {
  IconAxe,
  IconCalendar,
  IconCalendarTime,
  IconNotebook,
  IconSettings,
} from '@tabler/icons-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNotebookState } from '@/notebook/state/NotebookStateContext';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from './Header';

export default function Layout() {
  const { savedPages, openPage, activeDate } = useNotebookState();
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  const today = new Date().toISOString().slice(0, 10);

  // TODO: Extract sidebar variants when Notebook navigation needs page data/date grouping.

  const isNotebook = location.pathname.startsWith('/notebook');

  const closeMobileNavbar = () => {
    if (window.innerWidth < 576) {
      toggle();
    }
  };

  const notebookTopNavItems = [{ id: 'today', label: 'Today', icon: IconCalendar, href: '/notebook' }];

  const notebookBottomNavItems = [
    { id: 'tools', label: 'Back to Tools', icon: IconAxe, href: '/' },
    { id: 'settings', label: 'Settings', icon: IconSettings, href: '/settings' },
  ];

  const globalNavItems = [
    { id: 'notebook', label: 'Notebook', icon: IconNotebook, href: '/notebook' },
    { id: 'tools', label: 'Tools', icon: IconAxe, href: '/' },
    { id: 'settings', label: 'Settings', icon: IconSettings, href: '/settings' },
  ];

  const recentPages = savedPages.filter((page) => page.date !== today).slice(0, 3);

  const formatRecentDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);

    return parsedDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

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
          {(isNotebook ? notebookTopNavItems : globalNavItems).map((item) => (
            <NavLink
              key={item.id}
              component={Link}
              to={item.href}
              label={item.label}
              leftSection={<item.icon size={16} />}
              active={
                item.id === 'today'
                  ? isNotebook && activeDate === today
                  : location.pathname === item.href
              }
              onClick={() => {
                if (item.id === 'today') {
                  openPage(today);
                }
                closeMobileNavbar();
              }}
            />
          ))}

          {isNotebook ? (
            <>
              <NavLink
                label="Recent"
                leftSection={<IconCalendarTime size={16} />}
                defaultOpened
                active={recentPages.some((page) => page.date === activeDate)}
              >
                {recentPages.map((page) => (
                  <NavLink
                    key={page.id}
                    component={Link}
                    to="/notebook"
                    label={formatRecentDate(page.date)}
                    active={activeDate === page.date}
                    onClick={() => {
                      openPage(page.date);
                      closeMobileNavbar();
                    }}
                  />
                ))}
              </NavLink>

              {notebookBottomNavItems.map((item) => (
                <NavLink
                  key={item.id}
                  component={Link}
                  to={item.href}
                  label={item.label}
                  leftSection={<item.icon size={16} />}
                  active={location.pathname === item.href}
                  onClick={closeMobileNavbar}
                />
              ))}
            </>
          ) : null}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Breadcrumbs />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
