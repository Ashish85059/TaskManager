export type TodoList = {
  _id: string;
  title: string;
  description: string;
  date: string;
  priority: string;
  isCompleted: boolean;
  history: Array<{ date: string; action: string }>;
};