'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const createBoardSchema = z.object({
  title: z.string().min(1, 'Board title is required').max(50, 'Title must be less than 50 characters'),
})

type CreateBoardFormData = z.infer<typeof createBoardSchema>

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateBoardFormData) => Promise<void>
  loading?: boolean
}

export function CreateBoardModal({ isOpen, onClose, onSubmit, loading = false }: CreateBoardModalProps) {
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
  })

  const handleFormSubmit = async (data: CreateBoardFormData) => {
    try {
      setError(null)
      await onSubmit(data)
      reset()
      onClose()
    } catch (err) {
      setError((err as Error).message || 'Failed to create board')
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Board">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Board Title
          </label>
          <Input
            id="title"
            placeholder="Enter board title"
            {...register('title')}
            autoFocus
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              'Create Board'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}