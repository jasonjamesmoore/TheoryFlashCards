import { NotebookStateProvider } from '@/notebook/state/NotebookStateContext';
import { NotebookPage } from '@/notebook/editor/NotebookPage';

export function NotebookRoute() {
  return (
    <NotebookStateProvider>
      <NotebookPage />
    </NotebookStateProvider>
  );
}
