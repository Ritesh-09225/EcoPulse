import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { SimulationPanel } from '@/components/simulation-panel'
import { LeafyChatWidget } from '@/components/leafy-chat-widget'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[256px_1fr]">
      <DashboardSidebar />
      <div className="flex flex-col h-screen overflow-hidden relative">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6 lg:p-8">{children}</main>
        <SimulationPanel />
        <LeafyChatWidget />
      </div>
    </div>
  )
}
