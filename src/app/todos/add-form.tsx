'use client'

import { addTodo } from './actions'
import { Plus, Loader2 } from 'lucide-react'
import { useRef, useTransition } from 'react'

export default function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  async function clientAction(formData: FormData) {
    startTransition(async () => {
      await addTodo(formData)
      formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} action={clientAction} className="flex gap-2 mb-12">
      <div className="relative flex-1">
        <input
          name="name"
          placeholder="What needs to be done?"
          required
          className="w-full glass h-14 px-6 rounded-2xl outline-hidden focus:ring-2 focus:ring-primary/50 font-medium text-text-primary placeholder:text-text-muted transition-all"
        />
      </div>
      <button 
        type="submit" 
        disabled={isPending}
        className="h-14 w-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
      </button>
    </form>
  )
}
