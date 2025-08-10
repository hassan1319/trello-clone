'use client'

import { Droppable } from '@hello-pangea/dnd'
import { ReactNode } from 'react'

interface DroppableListProps {
  droppableId: string
  children: ReactNode
}

export function DroppableList({ droppableId, children }: DroppableListProps) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`space-y-2 min-h-[100px] p-2 rounded-md transition-colors ${
            snapshot.isDraggingOver 
              ? 'bg-blue-50 border-2 border-blue-300 border-dashed' 
              : 'bg-transparent'
          }`}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}