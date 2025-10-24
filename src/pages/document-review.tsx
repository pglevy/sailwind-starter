import { HeadingField, CardLayout, TextField, CheckboxField, RadioButtonField, ButtonWidget, MessageBanner } from '@pglevy/sailwind'
import { Link } from 'wouter'

export default function DocumentReview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
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
          value="Policy Update Proposal - 2025"
          disabled={true}
        />

        <TextField
          label="Submitted By"
          value="Jane Doe"
          disabled={true}
        />

        <TextField
          label="Submission Date"
          value="October 20, 2025"
          disabled={true}
        />
      </CardLayout>

      <CardLayout>
        <HeadingField text="Review Checklist" size="MEDIUM" />

        <CheckboxField
          label="Please confirm the following:"
          choiceLabels={[
            'Document is complete and all required sections are filled',
            'Information provided is accurate and up-to-date',
            'Document follows standard formatting guidelines',
            'No sensitive information is improperly disclosed'
          ]}
          choiceValues={['complete', 'accurate', 'formatted', 'secure']}
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
