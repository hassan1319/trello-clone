'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Edit3, Trash2 } from 'lucide-react'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuickEdit = async () => {
    if (!editedTitle.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onUpdate(task.id, { title: editedTitle.trim() })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update task:', error)
      setEditedTitle(task.title) // Reset on error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalUpdate = async () => {
    if (!editedTitle.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onUpdate(task.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim() || null
      })
      setShowModal(false)
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(task.id)
      setShowModal(false)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const resetEditing = () => {
    setEditedTitle(task.title)
    setEditedDescription(task.description || '')
    setIsEditing(false)
  }

  return (
    <>
      <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow group bg-white">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQuickEdit()
                if (e.key === 'Escape') resetEditing()
              }}
              onBlur={handleQuickEdit}
              className="text-sm"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
        ) : (
          <div onClick={() => setShowModal(true)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Edit Task"
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              id="task-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Task title"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="task-description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Add a description..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleModalUpdate}
                disabled={!editedTitle.trim() || isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}