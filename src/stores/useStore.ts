'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Board, List, Task, AuthUser } from '@/types'

interface AppState {
  // Auth state
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  
  // Boards state
  boards: Board[]
  setBoards: (boards: Board[]) => void
  addBoard: (board: Board) => void
  updateBoard: (id: string, updates: Partial<Board>) => void
  removeBoard: (id: string) => void
  
  // Current board state
  currentBoard: Board | null
  setCurrentBoard: (board: Board | null) => void
  
  // Lists state
  lists: List[]
  setLists: (lists: List[]) => void
  addList: (list: List) => void
  updateList: (id: string, updates: Partial<List>) => void
  removeList: (id: string) => void
  
  // Tasks state
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  moveTask: (taskId: string, newListId: string, newPosition: number) => void
  
  // UI state
  isLoading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Auth state
      user: null,
      setUser: (user) => set({ user }),
      
      // Boards state
      boards: [],
      setBoards: (boards) => set({ boards }),
      addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
      updateBoard: (id, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id ? { ...board, ...updates } : board
          ),
        })),
      removeBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
        })),
      
      // Current board state
      currentBoard: null,
      setCurrentBoard: (board) => set({ currentBoard: board }),
      
      // Lists state
      lists: [],
      setLists: (lists) => set({ lists }),
      addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
      updateList: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, ...updates } : list
          ),
        })),
      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),
      
      // Tasks state
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      moveTask: (taskId, newListId, newPosition) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, list_id: newListId, position: newPosition }
              : task
          ),
        })),
      
      // UI state
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
    }),
    {
      name: 'trello-clone-store',
    }
  )
)