export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low' | 'Unassigned';
  category: 'My God' | 'Myself' | 'My People' | 'My Work' | 'Maintenance' | 'Unassigned';
  dueDate: string | null;
  archivedAt: string | null;
}

export type View = 'inbox' | 'priorities' | 'categories' | 'date' | 'archive'; 