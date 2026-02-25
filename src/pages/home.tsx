import { HeadingField, MessageBanner, RichTextDisplayField, TextItem } from '@pglevy/sailwind'
import { useLocation } from 'wouter'

export default function Home() {
  const [, setLocation] = useLocation()

  const pages = [
    { title: 'Task Dashboard', path: '/task-dashboard', description: 'Example task management interface' },
    { title: 'Application Status', path: '/application-status', description: 'Application tracking with milestones' },
    { title: 'Document Review', path: '/document-review', description: 'Document approval workflow' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <HeadingField text="Sailwind Starter" size="LARGE_PLUS" fontWeight="BOLD" align="CENTER" />

      <MessageBanner
        primaryText="Welcome to Sailwind Starter! This template is ready for rapid prototyping with SAIL-style components."
        backgroundColor="INFO"
        highlightColor="INFO"
        icon="info"
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <HeadingField text="Example Pages" size="MEDIUM_PLUS" fontWeight="SEMI_BOLD" marginBelow="STANDARD" />
        <div className="space-y-3">
          {pages.map((page, index) => (
            <div key={index}>
              <RichTextDisplayField
                value={[
                  <TextItem
                    key="title"
                    text={page.title}
                    color="ACCENT"
                    size="MEDIUM"
                    link={() => setLocation(page.path)}
                    linkStyle="STANDALONE"
                  />,
                  <br key="br" />,
                  <TextItem
                    key="desc"
                    text={page.description}
                    color="SECONDARY"
                    size="STANDARD"
                  />
                ]}
                marginBelow="EVEN_LESS"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <HeadingField text="Getting Started" size="MEDIUM_PLUS" fontWeight="SEMI_BOLD" marginBelow="STANDARD" />
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">1. Create New Pages</h3>
            <p>Add new .tsx files in <code className="bg-gray-100 px-2 py-1 rounded">src/pages/</code></p>
            <p className="mt-1 text-gray-500">Example: <code className="bg-gray-100 px-2 py-1 rounded">src/pages/my-prototype.tsx</code></p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Register Routes</h3>
            <p>Add your page to the routes array in <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code></p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Import Sailwind Components</h3>
            <p>Use any Sailwind component:</p>
            <code className="block bg-gray-100 px-2 py-1 rounded mt-1">
              import {`{ CardLayout, HeadingField, TextField }`} from '@pglevy/sailwind'
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Prompt Your LLM</h3>
            <p>Describe the interface you want to prototype and let the LLM build it!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
