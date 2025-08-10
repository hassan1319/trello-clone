export interface User {
  id: string
  email: string
  created_at: string
}

export interface Board {
  id: string
  title: string
  user_id: string
  created_at: string
  lists?: List[]
}

export interface List {
  id: string
  title: string
  board_id: string
  position: number
  created_at: string
  tasks?: Task[]
}

export interface Task {
  id: string
  title: string
  description: string | null
  list_id: string
  position: number
  created_at: string
}

export interface CreateBoardData {
  title: string
}

export interface CreateListData {
  title: string
  board_id: string
  position: number
}

export interface CreateTaskData {
  title: string
  description?: string
  list_id: string
  position: number
}

export interface UpdateTaskData {
  id: string
  title?: string
  description?: string
  list_id?: string
  position?: number
}