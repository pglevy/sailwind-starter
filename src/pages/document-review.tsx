import { useState, useEffect } from 'react'
import { HeadingField, CardLayout, TextField, CheckboxField, RadioButtonField, ButtonWidget, MessageBanner } from '@pglevy/sailwind'
import { Link } from 'wouter'
import { getDocument, reviewChecklist, type Document } from '../db/documents'
import { getDisplayName } from '../db/users'

export default function DocumentReview() {
  const [doc, setDoc] = useState<Document | undefined>()

  useEffect(() => {
    getDocument(1).then(setDoc)
  }, [])

  if (!doc) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>

      <HeadingField text="Document Review" size="LARGE" />

      <MessageBanner
        primaryText="Please review the document carefully and provide your feedback below."
        backgroundColor="INFO"
        highlightColor="INFO"
        icon="info"
      />

      <CardLayout>
        <HeadingField text="Document Information" size="MEDIUM" />

        <TextField
          label="Document Title"
          value={doc.title}
          disabled={true}
        />

        <TextField
          label="Submitted By"
          value={getDisplayName(doc.submittedBy)}
          disabled={true}
        />

        <TextField
          label="Submission Date"
          value={doc.submissionDate}
          disabled={true}
        />
      </CardLayout>

      <CardLayout>
        <HeadingField text="Review Checklist" size="MEDIUM" />

        <CheckboxField
          label="Please confirm the following:"
          choiceLabels={reviewChecklist.map(c => c.label)}
          choiceValues={reviewChecklist.map(c => c.value)}
        />
      </CardLayout>

      <CardLayout>
        <HeadingField text="Review Decision" size="MEDIUM" />

        <RadioButtonField
          label="Recommendation"
          choiceLabels={['Approve', 'Request Changes', 'Reject']}
          choiceValues={['approve', 'changes', 'reject']}
        />

        <TextField
          label="Comments"
          placeholder="Enter your review comments..."
          instructions="Provide detailed feedback for the submitter"
        />

        <div className="flex gap-3">
          <ButtonWidget label="Submit Review" style="SOLID" />
          <ButtonWidget label="Save Draft" />
        </div>
      </CardLayout>
    </div>
  )
}
