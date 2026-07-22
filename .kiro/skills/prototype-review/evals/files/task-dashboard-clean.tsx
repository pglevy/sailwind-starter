import { HeadingField, CardLayout, MessageBanner, TagField } from '@pglevy/sailwind'
import { CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getTasks, type Task } from '../db/tasks'

export default function TaskDashboardClean() {
  const [tasks, setTasks] = useState<Task[]>([])

  const tabs = [
    { label: 'Open', value: 'open' },
    { label: 'Done', value: 'done' },
  ]

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <HeadingField text="Task Dashboard" size="LARGE" align="CENTER" />

      <MessageBanner
        primaryText="Tasks sync from the connected board."
        backgroundColor="INFO"
        highlightColor="INFO"
        icon="info"
      />

      <CardLayout padding="MORE" showShadow={true}>
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-2">
            {task.isDone && <CheckCircle className="text-green-600" size={16} />}
            <span>{task.title}</span>
            <TagField text={task.isDone ? 'Done' : 'Open'} />
          </div>
        ))}
      </CardLayout>
    </div>
  )
}
