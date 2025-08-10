'use client'

import { Draggable } from '@hello-pangea/dnd'
import { TaskCard } from '@/components/board/TaskCard'
import type { Task } from '@/types'

interface DraggableTaskProps {
  task: Task
  index: number
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
}

export function DraggableTask({ task, index, onUpdate, onDelete }: DraggableTaskProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? provided.draggableProps.style?.transform 
              : 'none',
          }}
          className={snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}
        >
          <TaskCard
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      )}
    </Draggable>
  )
}