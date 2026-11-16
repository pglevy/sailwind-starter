import { HeadingField, MessageBanner } from '@pglevy/sailwind'
import { useState } from 'react'

export default function VendorDirectory() {
  const [selected, setSelected] = useState<number | null>(null)

  const vendors = [
    { id: 1, name: "Acme Supply Co", category: "Hardware", approved: true },
    { id: 2, name: "Globex Logistics", category: "Shipping", approved: false },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <HeadingField text="Vendor Directory" size="large" align="center" />

      <MessageBanner
        primaryText="Vendors are approved by procurement before appearing here."
        backgroundColor="INFO"
        highlightColor="INFO"
        icon="info"
      />

      <p>✅ All vendors below are ready to use.</p>

      <div className="space-y-2">
        {vendors.map(v => (
          <div key={v.id} className="flex items-center justify-between border p-3 rounded">
            <span>{v.name} — {v.category}</span>
            <button onClick={() => setSelected(v.id)}>View</button>
          </div>
        ))}
      </div>
    </div>
  )
}
