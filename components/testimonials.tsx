import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    quote: "This platform has completely transformed how our team works. The productivity gains have been incredible.",
    author: "Sarah Chen",
    role: "CTO at TechFlow",
    initials: "SC",
  },
  {
    quote: "The best investment we&apos;ve made this year. Simple to use, powerful features, and amazing support.",
    author: "Marcus Johnson",
    role: "Founder at StartupXYZ",
    initials: "MJ",
  },
  {
    quote: "We&apos;ve tried many solutions, but this is the only one that truly delivers on its promises. Highly recommended.",
    author: "Emily Rodriguez",
    role: "Product Lead at Innovate Co",
    initials: "ER",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by teams worldwide
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            See what our customers have to say about their experience.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              <blockquote className="flex-1 text-card-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
