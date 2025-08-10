'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ListColumn } from '@/components/board/ListColumn'
import { DragDropProvider } from '@/components/dnd/DragDropContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DropResult } from '@hello-pangea/dnd'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/stores/useStore'
import { api } from '@/lib/api'
import type { List, Task, CreateListData, CreateTaskData } from '@/types'

export default function BoardPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { 
    currentBoard, 
    setCurrentBoard,
    lists, 
    setLists, 
    addList, 
    updateList, 
    removeList,
    tasks, 
    setTasks, 
    addTask, 
    updateTask, 
    removeTask,
    isLoading,
    setLoading 
  } = useStore()

  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const boardId = params.id as string

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (authLoading) return
    
    // Only redirect if auth is done loading and there's no user
    if (!authLoading && !user) {
      router.push('/')
      return
    }
    
    // Load board data when user is authenticated and boardId exists
    // Only load if we haven't loaded yet, or if the board ID changed
    if (user && boardId && (!hasLoadedOnce || !currentBoard || currentBoard.id !== boardId)) {
      loadBoardData(boardId)
    }
  }, [boardId, user, authLoading, router, hasLoadedOnce, currentBoard])

  const loadBoardData = async (id: string) => {
    try {
      console.log('Loading board data for ID:', id)
      setLoading(true)
      
      // Load board details
      const boards = await api.getBoards()
      console.log('Available boards:', boards.map(b => ({ id: b.id, title: b.title })))
      const board = boards.find(b => b.id === id)
      
      if (!board) {
        console.warn('Board not found:', id, 'Available boards:', boards.length)
        setLoading(false)
        return
      }

      console.log('Found board:', board.title)
      setCurrentBoard(board)
      
      // Load lists for this board
      const listsData = await api.getLists(id)
      console.log('Loaded lists:', listsData.length)
      setLists(listsData)
      
      // Load all tasks for this board
      const tasksData = await api.getTasksByBoard(id)
      console.log('Loaded tasks:', tasksData.length)
      setTasks(tasksData)
      
      console.log('Board data loading complete')
      setHasLoadedOnce(true)
    } catch (error) {
      console.error('Failed to load board data:', error)
      // Don't redirect immediately on error, let user see error state
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async () => {
    if (!newListTitle.trim() || !currentBoard || isSubmitting) return

    setIsSubmitting(true)
    try {
      const listData: CreateListData = {
        title: newListTitle.trim(),
        board_id: currentBoard.id,
        position: lists.length
      }
      
      const newList = await api.createList(listData)
      addList(newList)
      setNewListTitle('')
      setIsAddingList(false)
    } catch (error) {
      console.error('Failed to create list:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTask = async (listId: string, title: string) => {
    const listTasks = tasks.filter(task => task.list_id === listId)
    
    const taskData: CreateTaskData = {
      title,
      list_id: listId,
      position: listTasks.length
    }
    
    const newTask = await api.createTask(taskData)
    addTask(newTask)
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const updatedTask = await api.updateTask(taskId, updates)
    updateTask(taskId, updatedTask)
  }

  const handleDeleteTask = async (taskId: string) => {
    await api.deleteTask(taskId)
    removeTask(taskId)
  }

  const handleUpdateList = async (listId: string, updates: Partial<List>) => {
    const updatedList = await api.updateList(listId, updates)
    updateList(listId, updatedList)
  }

  const handleDeleteList = async (listId: string) => {
    await api.deleteList(listId)
    removeList(listId)
    // Remove all tasks in this list
    tasks.filter(task => task.list_id === listId).forEach(task => {
      removeTask(task.id)
    })
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If dropped outside a valid droppable area
    if (!destination) return

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    try {
      const taskId = draggableId
      const destListId = destination.droppableId

      // Update task position and/or list
      await api.updateTask(taskId, {
        list_id: destListId,
        position: destination.index
      })

      // Update local state
      updateTask(taskId, {
        list_id: destListId,
        position: destination.index
      })

      // Reload data to ensure consistency
      if (currentBoard) {
        const tasksData = await api.getTasksByBoard(currentBoard.id)
        setTasks(tasksData)
      }
    } catch (error) {
      console.error('Failed to move task:', error)
      // Reload data on error to revert changes
      if (currentBoard) {
        const tasksData = await api.getTasksByBoard(currentBoard.id)
        setTasks(tasksData)
      }
    }
  }

  // Show loading screen only for initial auth loading or first board data loading
  if ((authLoading && !hasLoadedOnce) || (isLoading && !currentBoard)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="text-center">
          <LoadingSpinner size="lg" className="border-white/30 border-t-white" />
          <p className="mt-4 text-white">
            {authLoading ? 'Loading...' : 'Loading board...'}
          </p>
        </div>
      </div>
    )
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="text-center">
          <p className="text-white mb-4">Board not found</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Boards
              </Button>
              <h1 className="text-xl font-semibold text-white">
                {currentBoard.title}
              </h1>
            </div>
            <div className="text-white/80 text-sm">
              {lists.length} {lists.length === 1 ? 'list' : 'lists'}
            </div>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="p-6">
        <DragDropProvider onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-6">
            {/* Existing Lists */}
            {lists.map((list) => {
              const listTasks = tasks.filter(task => task.list_id === list.id)
              return (
                <ListColumn
                  key={list.id}
                  list={list}
                  tasks={listTasks}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onUpdateList={handleUpdateList}
                  onDeleteList={handleDeleteList}
                />
              )
            })}

            {/* Add New List */}
            <div className="w-72 flex-shrink-0">
              {isAddingList ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 space-y-3">
                  <Input
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Enter list title"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateList()
                      if (e.key === 'Escape') {
                        setNewListTitle('')
                        setIsAddingList(false)
                      }
                    }}
                    autoFocus
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={handleCreateList}
                      disabled={!newListTitle.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Adding...' : 'Add List'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewListTitle('')
                        setIsAddingList(false)
                      }}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full h-auto p-4 bg-white/10 hover:bg-white/20 text-white border-2 border-dashed border-white/30 hover:border-white/50 rounded-lg justify-start"
                  onClick={() => setIsAddingList(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add a list
                </Button>
              )}
            </div>
          </div>
        </DragDropProvider>
      </div>
    </div>
    </ProtectedRoute>
  )
}