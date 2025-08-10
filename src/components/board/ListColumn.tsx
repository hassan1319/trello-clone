'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, X, Trash2 } from 'lucide-react'
import { DraggableTask } from '@/components/dnd/DraggableTask'
import { DroppableList } from '@/components/dnd/DroppableList'
import type { List, Task } from '@/types'

interface ListColumnProps {
  list: List
  tasks: Task[]
  onAddTask: (listId: string, title: string) => Promise<void>
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDeleteTask: (taskId: string) => Promise<void>
  onDeleteList: (listId: string) => Promise<void>
  onUpdateList: (listId: string, updates: Partial<List>) => Promise<void>
}

export function ListColumn({ 
  list, 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onDeleteList,
  onUpdateList 
}: ListColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(list.title)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onAddTask(list.id, newTaskTitle.trim())
      setNewTaskTitle('')
      setIsAddingTask(false)
    } catch (error) {
      console.error('Failed to add task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTitle = async () => {
    if (!editedTitle.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onUpdateList(list.id, { title: editedTitle.trim() })
      setIsEditingTitle(false)
    } catch (error) {
      console.error('Failed to update list title:', error)
      setEditedTitle(list.title) // Reset on error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteList = async () => {
    if (tasks.length > 0) {
      if (!confirm(`Delete "${list.title}" and all ${tasks.length} tasks in it?`)) {
        return
      }
    }
    
    try {
      await onDeleteList(list.id)
    } catch (error) {
      console.error('Failed to delete list:', error)
    }
  }

  return (
    <Card className="w-72 bg-gray-50 flex-shrink-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateTitle()
                  if (e.key === 'Escape') {
                    setEditedTitle(list.title)
                    setIsEditingTitle(false)
                  }
                }}
                onBlur={handleUpdateTitle}
                className="text-sm font-medium"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
          ) : (
            <h3 
              className="font-medium text-gray-900 cursor-pointer flex-1"
              onClick={() => setIsEditingTitle(true)}
            >
              {list.title}
            </h3>
          )}
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              {tasks.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteList}
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <DroppableList droppableId={list.id}>
          {tasks.map((task, index) => (
            <DraggableTask
              key={task.id}
              task={task}
              index={index}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </DroppableList>

        {isAddingTask ? (
          <div className="space-y-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask()
                if (e.key === 'Escape') {
                  setNewTaskTitle('')
                  setIsAddingTask(false)
                }
              }}
              autoFocus
              disabled={isSubmitting}
            />
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim() || isSubmitting}
              >
                Add Task
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewTaskTitle('')
                  setIsAddingTask(false)
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
            className="w-full justify-start text-gray-600 hover:bg-gray-200"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a task
          </Button>
        )}
      </CardContent>
    </Card>
  )
}