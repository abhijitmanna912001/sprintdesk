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
import { useState } from "react";
import { TaskCard } from "../components/board/TaskCard";
import { AddTaskModal } from "../components/board/AddTaskModal";

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // must move 8px before a drag "activates"
      },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = Number(active.id);
    const overId = over.id;

    // Determine the target column: either `overId` IS a column status,
    // or `overId` is a task id — in which case we look up THAT task's status.
    const overTask = tasks.find((t) => t.id === overId);
    const newStatus = (overTask ? overTask.status : overId) as TaskStatus;

    // Determine target index within that column
    const columnTasks = tasks
      .filter((t) => t.status === newStatus && t.id !== taskId)
      .sort((a, b) => a.order - b.order);

    const newIndex = overTask
      ? columnTasks.findIndex((t) => t.id === overTask.id)
      : columnTasks.length; // dropped on empty column space → put at end

    moveTask(taskId, newStatus, newIndex);
  }

  if (tasksLoading || usersLoading) {
    return <div className="p-8">Loading board...</div>;
  }

  if (tasksError || usersError || !users) {
    return <div className="p-8">Failed to load board data.</div>;
  }

  const usersById = getUsersById(users);

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Board</h1>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Add Task
        </button>
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
    </div>
  );
}
