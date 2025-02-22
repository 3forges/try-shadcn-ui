import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar.tsx"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className={`h-7 w-7`} />
        {children}
      </main>
    </SidebarProvider>
    </>
  )
}