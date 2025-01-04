import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:3000/api' 
    : import.meta.env.VITE_API_URL || '/api',  // Use VITE_API_URL for production
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }
});

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await api.get('/todos');
  return response.data;
});

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todo: Omit<Todo, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/todos', todo);
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: string) => {
  await api.delete(`/todos/${id}`);
  return id;
});

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ _id, ...updates }: Partial<Todo> & { _id: string }) => {
    const response = await api.patch(`/todos/${_id}`, updates);
    return response.data;
  }
);

export const toggleTodo = createAsyncThunk('todos/toggleTodo', async (id: string) => {
  const response = await api.patch(`/todos/toggle/${id}`);
  return response.data;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'idle';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      });
  },
});

export default todoSlice.reducer;