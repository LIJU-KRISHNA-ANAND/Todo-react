import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

const API_URL = "http://127.0.0.1:10000/api/tasks";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await fetch(API_URL);
  return await res.json();
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: Omit<Task, "id">) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return await res.json();
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task) => {
    const res = await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return await res.json();
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    return id;
  }
);

export const toggleComplete = createAsyncThunk(
  "tasks/toggleComplete",
  async (id: number) => {
    const res = await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
    return await res.json();
  }
);

export const moveTask = createAsyncThunk(
  "tasks/moveTask",
  async ({ id, direction }: { id: number; direction: "up" | "down" }) => {
    const res = await fetch(`${API_URL}/${id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    return await res.json();
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(toggleComplete.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        const { moved, swapped_with } = action.payload;
        const movedIndex = state.tasks.findIndex((t) => t.id === moved.id);
        const swappedIndex = state.tasks.findIndex(
          (t) => t.id === swapped_with.id
        );
        if (movedIndex !== -1 && swappedIndex !== -1) {
          [state.tasks[movedIndex], state.tasks[swappedIndex]] = [
            state.tasks[swappedIndex],
            state.tasks[movedIndex],
          ];
        }
      });
  },
});

export default taskSlice.reducer;
