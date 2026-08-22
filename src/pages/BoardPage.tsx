import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Column } from "../components/board/Column";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { getUsersById } from "../lib/users";
import { useBoardStore } from "../store/boardStore";
import type { Task, TaskStatus } from "../types";
import { useCallback, useMemo, useState } from "react";
import { TaskCard } from "../components/board/TaskCard";
import { AddTaskModal } from "../components/board/AddTaskModal";
import { TaskDrawer } from "../components/board/TaskDrawer";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "backlog", title: "Backlog" },
  { status: "in-progress", title: "In Progress" },
  { status: "review", title: "Review" },
  { status: "done", title: "Done" },
];

export function BoardPage() {
  const { isLoading: tasksLoading, isError: tasksError } = useTasks();
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();

  const tasks = useBoardStore((state) => state.tasks);
  const moveTask = useBoardStore((state) => state.moveTask);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const usersById = useMemo(() => (users ? getUsersById(users) : {}), [users]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // must move 8px before a drag "activates"
      },
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      setActiveTask(task ?? null);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const taskId = Number(active.id);
      const overId = over.id;

      const overTask = tasks.find((t) => t.id === overId);
      const newStatus = (overTask ? overTask.status : overId) as TaskStatus;

      const columnTasks = tasks
        .filter((t) => t.status === newStatus && t.id !== taskId)
        .sort((a, b) => a.order - b.order);

      const newIndex = overTask
        ? columnTasks.findIndex((t) => t.id === overTask.id)
        : columnTasks.length;

      moveTask(taskId, newStatus, newIndex);
    },
    [tasks, moveTask],
  );

  if (tasksLoading || usersLoading) {
    return (
      <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="flex-1 min-w-62.5 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasksError || usersError || !users) {
    return <div className="p-8">Failed to load board data.</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Board
        </h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Task</Button>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto">
          {COLUMNS.map((col) => (
            <Column
              key={col.status}
              status={col.status}
              title={col.title}
              tasks={tasks}
              usersById={usersById}
              onTaskClick={(task) => setSelectedTaskId(task.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              assignee={usersById[activeTask.assigneeId]}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {isAddModalOpen && (
        <AddTaskModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          assignee={usersById[selectedTask.assigneeId]}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
