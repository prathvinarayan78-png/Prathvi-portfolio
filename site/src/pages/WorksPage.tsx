import { PageTransition } from '../components/ui/PageTransition'
import { Works } from '../components/sections/Works'

export default function WorksPage() {
  return (
    <PageTransition>
      <div className="pt-24 md:pt-32">
        <Works />
      </div>
    </PageTransition>
  )
}
