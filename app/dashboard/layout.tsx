import { MainNav } from "@/components/layout/main-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Data for educational purposes only. Not financial advice.
          </p>
          <p className="flex items-center gap-1">
            Built for Canadians
          </p>
        </div>
      </footer>
    </div>
  )
}
