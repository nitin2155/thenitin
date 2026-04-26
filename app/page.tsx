export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          thenitin.space
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Something is brewing. Check back soon.
        </p>
        <div className="mt-4 h-px w-16 bg-primary" />
      </main>
    </div>
  )
}
