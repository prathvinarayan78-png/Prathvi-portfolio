import { PageTransition } from '../components/ui/PageTransition'
import { Studio } from '../components/sections/Studio'

export default function StudioPage() {
  return (
    <PageTransition>
      <div className="pt-24 md:pt-32">
        <Studio />
      </div>
    </PageTransition>
  )
}
