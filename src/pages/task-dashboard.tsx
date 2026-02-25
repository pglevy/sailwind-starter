import { HeadingField, CardLayout, ButtonWidget, TagField, ProgressBar, RichTextDisplayField, TextItem } from '@pglevy/sailwind'
import { Link } from 'wouter'

export default function TaskDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>

      <HeadingField text="Task Dashboard" size="LARGE" />

      <CardLayout>
        <HeadingField text="My Active Tasks" size="MEDIUM" />

        <div className="space-y-4">
          <div className="">
            <HeadingField text="Review Application #1234" size="MEDIUM" fontWeight="SEMI_BOLD" marginBelow="NONE" />
            <RichTextDisplayField
              value={[
                <TextItem
                  key="meta"
                  text="Assigned to you • Due in 2 days"
                  color="SECONDARY"
                  size="SMALL"
                />
              ]}
            />
            <TagField
              tags={[
                { text: 'High Priority', backgroundColor: 'NEGATIVE' },
                { text: 'Review', backgroundColor: 'SECONDARY' },
              ]}
              marginAbove="STANDARD"
              size="SMALL"
            />
            <ProgressBar percentage={65} label="Progress" labelPosition="COLLAPSED" marginAbove="STANDARD" />
          </div>

          <div className="">
            <HeadingField text="Process Document Review" size="MEDIUM" fontWeight="SEMI_BOLD" marginBelow="NONE" />
            <RichTextDisplayField
              value={[
                <TextItem
                  key="meta"
                  text="Assigned to you • Due in 5 days"
                  color="SECONDARY"
                  size="SMALL"
                />
              ]}
            />
            <TagField
              tags={[
                { text: 'Normal', backgroundColor: 'STANDARD' },
                { text: 'Documentation', backgroundColor: 'ACCENT' },
              ]}
              marginAbove="STANDARD"
              size="SMALL"
            />
            <ProgressBar percentage={30} label="Progress" labelPosition="COLLAPSED" marginAbove="STANDARD" />
          </div>

          <div className="">
            <HeadingField text="Update Vendor Information" size="MEDIUM" fontWeight="SEMI_BOLD" marginBelow="NONE" />
            <RichTextDisplayField
              value={[
                <TextItem
                  key="meta"
                  text="Assigned to you • Due in 7 days"
                  color="SECONDARY"
                  size="SMALL"
                />
              ]}
            />
            <TagField
              tags={[
                { text: 'Low Priority', backgroundColor: 'POSITIVE' },
                { text: 'Data Entry', backgroundColor: 'SECONDARY' },
              ]}
              marginAbove="STANDARD"
              size="SMALL"
            />
            <ProgressBar percentage={10} label="Progress" labelPosition="COLLAPSED" marginAbove="STANDARD" />
          </div>
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
