import { createContext, ReactNode, useEffect, useState } from "react";
import { Task } from "../entities/Task";
import { tasksService } from "../services/api";

export interface TasksContextData {
  tasks: Task[];
  createTask: (attributes: Omit<Task, "id">) => Promise<void>;
  updateTask: (
    id: string,
    attributes: Partial<Omit<Task, "id">>
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const TasksContext = createContext({} as TasksContextData);

interface TasksContextProviderProps {
  children: ReactNode;
}

export const TasksContextProvider: React.FC<TasksContextProviderProps> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    tasksService.fetchTasks().then((data) => setTasks(data));
  }, []);

  const createTask = async (attributes: Omit<Task, "id">) => {
    const newTask = await tasksService.createTask(attributes);
    setTasks((currentState) => {
      const updatedTasks = [...currentState, newTask];
      return updatedTasks;
    });
  };

  const updateTask = async (
    id: string,
    attributes: Partial<Omit<Task, "id">>
  ) => {
    await tasksService.updateTask(id, attributes);
    setTasks((currentState) => {
      const updatedTasks = [...currentState];
      const TaskIndex = updatedTasks.findIndex((task) => task.id === id);
      Object.assign(updatedTasks[TaskIndex], attributes);
      return updatedTasks;
    });
  };

  const deleteTask = async (id: string) => {
    await tasksService.deleteTask(id);
    setTasks((currentState) => currentState.filter((task) => task.id !== id));
  };

  return (
    <TasksContext.Provider
      value={{ tasks, createTask, updateTask, deleteTask }}
    >
      {children}
    </TasksContext.Provider>
  );
};
