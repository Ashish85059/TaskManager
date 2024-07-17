export type TodoList = {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: string;
  isCompleted: boolean;
  history: Array<{ date: string; action: string }>;
};