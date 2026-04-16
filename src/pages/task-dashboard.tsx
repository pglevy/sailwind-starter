import { useState, useEffect } from 'react'
import { HeadingField, CardLayout, ButtonWidget, TagField, ProgressBar, RichTextDisplayField, TextItem } from '@pglevy/sailwind'
import { Link } from 'wouter'
import { getTasks, type Task } from '../db/tasks'
import { getDisplayName } from '../db/users'

const priorityColor: Record<string, string> = {
  High: 'NEGATIVE',
  Normal: 'STANDARD',
  Low: 'POSITIVE',
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>

      <HeadingField text="Task Dashboard" size="LARGE" />

      <CardLayout>
        <HeadingField text="My Active Tasks" size="MEDIUM" />

        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id}>
              <HeadingField text={task.title} size="MEDIUM" fontWeight="SEMI_BOLD" marginBelow="NONE" />
              <RichTextDisplayField
                value={[
                  <TextItem
                    key="meta"
                    text={`Assigned to ${getDisplayName(task.assignee)} • Due ${task.dueDate}`}
                    color="SECONDARY"
                    size="SMALL"
                  />
                ]}
              />
              <TagField
                tags={[
                  { text: `${task.priority} Priority`, backgroundColor: priorityColor[task.priority] ?? 'STANDARD' },
                  { text: task.category, backgroundColor: task.category === 'Review' ? 'SECONDARY' : 'ACCENT' },
                ]}
                marginAbove="STANDARD"
                size="SMALL"
              />
              <ProgressBar percentage={task.progress} label="Progress" labelPosition="COLLAPSED" marginAbove="STANDARD" />
            </div>
          ))}
        </div>
      </CardLayout>

      <CardLayout>
        <HeadingField text="Quick Actions" size="MEDIUM" />
        <div className="flex gap-3 flex-wrap">
          <ButtonWidget label="Create New Task" style="SOLID" />
          <ButtonWidget label="View All Tasks" />
          <ButtonWidget label="Filter Tasks" />
        </div>
      </CardLayout>
    </div>
  )
}
