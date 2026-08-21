import { create } from "zustand";
import type { Task, TaskStatus } from "../types";
import { persist } from "zustand/middleware";

interface BoardState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: number, newStatus: TaskStatus, newIndex: number) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],

      setTasks: (tasks) => set({ tasks }),

      moveTask: (taskId, newStatus, newIndex) =>
        set((state) => {
          const movingTask = state.tasks.find((t) => t.id === taskId);
          if (!movingTask) return state;

          // Remove the task from its current position
          const remaining = state.tasks.filter((t) => t.id !== taskId);

          // Tasks in the destination column (excluding the moving task)
          const destColumnTasks = remaining
            .filter((t) => t.status === newStatus)
            .sort((a, b) => a.order - b.order);

          // Insert the moving task at newIndex within that column
          destColumnTasks.splice(newIndex, 0, {
            ...movingTask,
            status: newStatus,
          });

          // Re-number order for the destination column
          const renumbered = destColumnTasks.map((t, index) => ({
            ...t,
            order: index,
          }));

          // Merge: everything NOT in the destination column, plus the renumbered column
          const untouched = remaining.filter((t) => t.status !== newStatus);

          return { tasks: [...untouched, ...renumbered] };
        }),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

      deleteTask: (taskId) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t,
          ),
        })),
    }),
    {
      name: "sprintdesk-board",
    },
  ),
);
