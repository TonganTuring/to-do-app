export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low' | 'Unassigned';
  category: 'My God' | 'Myself' | 'My People' | 'My Work' | 'Maintenance' | 'Unassigned';
  dueDate: string | null;
  archivedAt: string | null;
  userId: string;
  createdAt: string;
}

export type View = 'inbox' | 'priorities' | 'categories' | 'date' | 'archive'; 