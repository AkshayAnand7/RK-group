'use client'

import { toggleTodo } from './actions'
import { CheckCircle2, Circle } from 'lucide-react'
import { useTransition } from 'react'

export default function TodoItem({ todo }: { todo: any }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div 
      className={`glass p-6 rounded-3xl flex items-center justify-between group card-hover transition-opacity ${isPending ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => startTransition(async () => { await toggleTodo(todo.id, !todo.is_completed) })}
          disabled={isPending}
          className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors"
        >
          {todo.is_completed ? (
            <CheckCircle2 className="w-6 h-6 text-lottery" />
          ) : (
            <Circle className="w-6 h-6 text-text-muted" />
          )}
        </button>
        <div>
          <h3 className={`font-bold text-lg transition-all ${todo.is_completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
            {todo.name}
          </h3>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
            {new Date(todo.inserted_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
