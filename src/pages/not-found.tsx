import { HeadingField, CardLayout, ButtonWidget } from '@pglevy/sailwind'
import { useLocation } from 'wouter'

export default function NotFound() {
  const [, setLocation] = useLocation()

  return (
    <div className="space-y-6 text-center">
      <HeadingField text="404 - Page Not Found" size="LARGE" />

      <CardLayout>
        <p className="text-gray-700">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-4">
          <ButtonWidget
            label="Go Home"
            onClick={() => setLocation('/')}
          />
        </div>
      </CardLayout>
    </div>
  )
}
