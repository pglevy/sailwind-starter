import { useState, useEffect } from 'react'
import { HeadingField, CardLayout, TextField, TagField, MilestoneField } from '@pglevy/sailwind'
import { Link } from 'wouter'
import { getApplication, applicationSteps, type Application } from '../db/applications'

export default function ApplicationStatus() {
  const [app, setApp] = useState<Application | undefined>()

  useEffect(() => {
    getApplication(12345).then(setApp)
  }, [])

  if (!app) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>

      <HeadingField text="Application Status" size="LARGE" />

      <CardLayout>
        <HeadingField text={`Application #${app.id}`} size="MEDIUM" />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Applicant Name"
            value={app.applicantName}
            disabled={true}
          />
          <TextField
            label="Application Date"
            value={app.applicationDate}
            disabled={true}
          />
        </div>

        <TagField
          tags={[
            { text: app.status, backgroundColor: app.status === 'Approved' ? 'POSITIVE' : 'STANDARD' }
          ]}
          marginAbove="STANDARD"
        />
      </CardLayout>

      <CardLayout>
        <HeadingField text="Application Timeline" size="MEDIUM" />

        <MilestoneField
          steps={applicationSteps}
          active={app.currentStep}
        />
      </CardLayout>
    </div>
  )
}
