import { supabase } from './supabase'
import type { Board, List, Task, CreateBoardData, CreateListData, CreateTaskData } from '@/types'

export const api = {
  // Board operations
  async getBoards(): Promise<Board[]> {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createBoard(boardData: CreateBoardData): Promise<Board> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('boards')
      .insert([{ ...boardData, user_id: user.id }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateBoard(id: string, updates: Partial<Board>): Promise<Board> {
    const { data, error } = await supabase
      .from('boards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteBoard(id: string): Promise<void> {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // List operations
  async getLists(boardId: string): Promise<List[]> {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('board_id', boardId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async createList(listData: CreateListData): Promise<List> {
    const { data, error } = await supabase
      .from('lists')
      .insert([listData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateList(id: string, updates: Partial<List>): Promise<List> {
    const { data, error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteList(id: string): Promise<void> {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Task operations
  async getTasks(listId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('list_id', listId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async getTasksByBoard(boardId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        lists!inner (
          board_id
        )
      `)
      .eq('lists.board_id', boardId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async createTask(taskData: CreateTaskData): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}