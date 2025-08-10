'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Trash2, ExternalLink } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import type { Board } from '@/types'

interface BoardCardProps {
  board: Board
  onDelete: (id: string) => void
  onClick: (board: Board) => void
}

export function BoardCard({ board, onDelete, onClick }: BoardCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    onDelete(board.id)
    setShowDeleteModal(false)
  }

  return (
    <>
      <Card className="cursor-pointer transition-all hover:shadow-md group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle 
              className="text-lg cursor-pointer flex-1"
              onClick={() => onClick(board)}
            >
              {board.title}
            </CardTitle>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClick(board)}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent 
          className="pt-0 cursor-pointer"
          onClick={() => onClick(board)}
        >
          <p className="text-sm text-gray-600">
            Created {new Date(board.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Board"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete &quot;<strong>{board.title}</strong>&quot;? 
            This action cannot be undone and will delete all lists and tasks in this board.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Board
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}