'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { BoardCard } from '@/components/board/BoardCard'
import { CreateBoardModal } from '@/components/board/CreateBoardModal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Plus, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { useStore } from '@/stores/useStore'
import type { Board } from '@/types'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, signOut } = useAuth()
  const { boards, setBoards, addBoard, removeBoard } = useStore()
  const router = useRouter()

  useEffect(() => {
    loadBoards()
  }, [])

  const loadBoards = async () => {
    try {
      setIsLoading(true)
      const boardsData = await api.getBoards()
      setBoards(boardsData)
    } catch (error) {
      console.error('Failed to load boards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBoard = async (data: { title: string }) => {
    try {
      const newBoard = await api.createBoard(data)
      addBoard(newBoard)
    } catch (error) {
      console.error('Failed to create board:', error)
      throw error
    }
  }

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await api.deleteBoard(boardId)
      removeBoard(boardId)
    } catch (error) {
      console.error('Failed to delete board:', error)
    }
  }

  const handleBoardClick = (board: Board) => {
    router.push(`/board/${board.id}`)
  }

  const handleSignOut = async () => {
    console.log('Sign out button clicked') // Debug log
    try {
      await signOut()
      console.log('Sign out successful') // Debug log
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your boards...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trello Clone</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Boards</h2>
            <p className="text-gray-600">
              {boards.length === 0 
                ? 'Get started by creating your first board'
                : `${boards.length} ${boards.length === 1 ? 'board' : 'boards'}`
              }
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Board</span>
          </Button>
        </div>

        {/* Boards Grid */}
        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
            <p className="text-gray-600 mb-4">Create your first board to get started with task management</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onDelete={handleDeleteBoard}
                onClick={handleBoardClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
        loading={isLoading}
      />
    </div>
    </ProtectedRoute>
  )
}