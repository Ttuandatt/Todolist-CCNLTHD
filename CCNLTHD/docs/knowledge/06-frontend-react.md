# 📘 Phần 6: Frontend React

> **Thời gian học:** 5-6 ngày  
> **Độ khó:** ⭐⭐⭐ Trung bình  
> **Yêu cầu:** JavaScript, HTML/CSS

---

## 1. React Fundamentals

### 1.1 Functional Components

```tsx
// components/TaskCard.tsx
interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="actions">
        <button onClick={() => onComplete(task.id)}>Complete</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}
```

### 1.2 Essential Hooks

```tsx
// useState - Local state
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// useEffect - Side effects
useEffect(() => {
  fetchUser().then(setUser);
}, []); // Empty deps = run once on mount

useEffect(() => {
  document.title = `${count} items`;
}, [count]); // Run when count changes

// useCallback - Memoized callbacks
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []); // Stable reference

// useMemo - Memoized values
const sortedTasks = useMemo(() => {
  return tasks.sort((a, b) => a.position - b.position);
}, [tasks]);

// useRef - Refs and mutable values
const inputRef = useRef<HTMLInputElement>(null);
const timerRef = useRef<number>();

// Custom hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 2. State Management với Zustand

### 2.1 Cài đặt

```bash
npm install zustand
```

### 2.2 Store cơ bản

```tsx
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
```

### 2.3 Task Store

```tsx
// store/taskStore.ts
interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskFilters;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: number, data: Partial<Task>) => void;
  removeTask: (id: number) => void;
  selectTask: (task: Task | null) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTask: null,
  filters: { status: null, priority: null, search: '' },

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  selectTask: (task) => set({ selectedTask: task }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
```

### 2.4 Selectors

```tsx
// Derived state với selectors
const filteredTasks = useTaskStore((state) => {
  return state.tasks.filter((task) => {
    if (state.filters.status && task.status !== state.filters.status) {
      return false;
    }
    if (state.filters.search && !task.title.includes(state.filters.search)) {
      return false;
    }
    return true;
  });
});

// Shallow comparison for better performance
import { shallow } from 'zustand/shallow';

const { tasks, selectedTask } = useTaskStore(
  (state) => ({ tasks: state.tasks, selectedTask: state.selectedTask }),
  shallow
);
```

---

## 3. Server State với React Query

### 3.1 Cài đặt

```bash
npm install @tanstack/react-query
```

### 3.2 Setup Provider

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

### 3.3 useQuery - Fetching Data

```tsx
// hooks/useTasks.ts
import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../services/api';

export function useTasks(projectId: number, filters: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: () => tasksApi.getAll(projectId, filters),
    enabled: !!projectId, // Only fetch when projectId exists
  });
}

// Usage in component
function TaskList({ projectId }: { projectId: number }) {
  const { data: tasks, isLoading, error } = useTasks(projectId, {});

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  
  return (
    <ul>
      {tasks?.map(task => <TaskCard key={task.id} task={task} />)}
    </ul>
  );
}
```

### 3.4 useMutation - Modifying Data

```tsx
// hooks/useCreateTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateTask(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => tasksApi.create(projectId, data),
    
    onSuccess: (newTask) => {
      // Update cache
      queryClient.setQueryData(['tasks', projectId], (old: Task[] = []) => {
        return [...old, newTask];
      });
    },

    // Optimistic update
    onMutate: async (newTaskData) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
      
      const previousTasks = queryClient.getQueryData(['tasks', projectId]);
      
      queryClient.setQueryData(['tasks', projectId], (old: Task[] = []) => {
        return [...old, { id: Date.now(), ...newTaskData }];
      });

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks', projectId], context?.previousTasks);
    },
  });
}

// Usage
function CreateTaskForm({ projectId }: { projectId: number }) {
  const createTask = useCreateTask(projectId);

  const handleSubmit = (data: CreateTaskDto) => {
    createTask.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createTask.isPending}>
        {createTask.isPending ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

---

## 4. API Service Layer

### 4.1 Axios Setup

```tsx
// services/axios.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 4.2 API Functions

```tsx
// services/tasksApi.ts
import api from './axios';

export const tasksApi = {
  getAll: async (projectId: number, filters: TaskFilters) => {
    const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`, {
      params: filters,
    });
    return data;
  },

  getOne: async (taskId: number) => {
    const { data } = await api.get<Task>(`/tasks/${taskId}`);
    return data;
  },

  create: async (projectId: number, dto: CreateTaskDto) => {
    const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, dto);
    return data;
  },

  update: async (taskId: number, dto: UpdateTaskDto) => {
    const { data } = await api.patch<Task>(`/tasks/${taskId}`, dto);
    return data;
  },

  delete: async (taskId: number) => {
    await api.delete(`/tasks/${taskId}`);
  },
};
```

---

## 5. Routing với React Router

### 5.1 Setup

```tsx
// router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/workspaces" replace /> },
      { path: 'workspaces', element: <WorkspacesPage /> },
      {
        path: 'workspaces/:workspaceId',
        element: <WorkspaceLayout />,
        children: [
          { index: true, element: <WorkspaceDashboard /> },
          { path: 'projects/:projectId', element: <ProjectPage /> },
          { path: 'settings', element: <WorkspaceSettings /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);
```

### 5.2 Protected Routes

```tsx
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Usage
<Route 
  path="/workspaces" 
  element={
    <ProtectedRoute>
      <WorkspacesPage />
    </ProtectedRoute>
  } 
/>
```

---

## 6. Forms với React Hook Form

### 6.1 Cài đặt

```bash
npm install react-hook-form @hookform/resolvers zod
```

### 6.2 Form với Validation

```tsx
// components/CreateTaskForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function CreateTaskForm({ onSubmit }: { onSubmit: (data: TaskFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'NORMAL',
    },
  });

  const onFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div>
        <label>Title</label>
        <input {...register('title')} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div>
        <label>Description</label>
        <textarea {...register('description')} />
      </div>

      <div>
        <label>Priority</label>
        <select {...register('priority')}>
          <option value="LOW">Low</option>
          <option value="NORMAL">Normal</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div>
        <label>Due Date</label>
        <input type="date" {...register('dueDate')} />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

---

## 7. Drag & Drop với dnd-kit

### 7.1 Cài đặt

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 7.2 Kanban Board

```tsx
// components/KanbanBoard.tsx
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE'] as const;

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const newStatus = over.id as TaskStatus;

    if (activeTask && activeTask.status !== newStatus) {
      // Update task status
      updateTaskStatus(activeTask.id, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByColumn[status]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}

// KanbanColumn.tsx
function KanbanColumn({ status, tasks }: { status: string; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="kanban-column">
      <h3>{status}</h3>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <SortableTaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}
```

---

## 8. Component Patterns

### 8.1 Compound Components

```tsx
// components/Modal/index.tsx
const ModalContext = createContext<{ onClose: () => void } | null>(null);

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

Modal.Header = function ModalHeader({ children }: { children: React.ReactNode }) {
  const { onClose } = useContext(ModalContext)!;
  return (
    <div className="modal-header">
      {children}
      <button onClick={onClose}>×</button>
    </div>
  );
};

Modal.Body = function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="modal-body">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="modal-footer">{children}</div>;
};

// Usage
<Modal isOpen={isOpen} onClose={close}>
  <Modal.Header>Create Task</Modal.Header>
  <Modal.Body>
    <CreateTaskForm />
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={close}>Cancel</Button>
    <Button variant="primary">Create</Button>
  </Modal.Footer>
</Modal>
```

---

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/)
- [dnd-kit](https://dndkit.com/)
