import { HeadingField, CardLayout, TextField, TagField, MilestoneField } from '@pglevy/sailwind'
import { Link } from 'wouter'

export default function ApplicationStatus() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>

      <HeadingField text="Application Status" size="LARGE" />

      <CardLayout>
        <HeadingField text="Application #12345" size="MEDIUM" />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Applicant Name"
            value="John Smith"
            disabled={true}
          />
          <TextField
            label="Application Date"
            value="October 1, 2025"
            disabled={true}
          />
        </div>

        <TagField
          tags={[
            { text: 'Approved', backgroundColor: 'POSITIVE' }
          ]}
          marginAbove="STANDARD"
        />
      </CardLayout>

      <CardLayout>
        <HeadingField text="Application Timeline" size="MEDIUM" />

        <MilestoneField
          steps={[
            'Application Submitted',
            'Initial Review',
            'Documentation Verified',
            'Final Approval',
            'Notification Sent',
          ]}
          active={3}
        />
      </CardLayout>
    </div>
  )
}
