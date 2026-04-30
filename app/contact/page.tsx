"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Send, Mail, MessageSquare, Bug, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Footer } from "@/components/footer"

const contactReasons = [
  { id: "general", label: "General Inquiry", icon: MessageSquare },
  { id: "feedback", label: "Feedback", icon: Lightbulb },
  { id: "bug", label: "Report a Bug", icon: Bug },
  { id: "partnership", label: "Partnership", icon: Mail },
]

export default function ContactPage() {
  const [selectedReason, setSelectedReason] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Info Section */}
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Contact Us
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Have a question, suggestion, or found something that needs fixing? 
                We&apos;d love to hear from you.
              </p>
            </div>

            <div className="space-y-4 rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">Response Times</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between">
                  <span>General inquiries</span>
                  <span className="text-foreground">1-2 business days</span>
                </li>
                <li className="flex justify-between">
                  <span>Bug reports</span>
                  <span className="text-foreground">24 hours</span>
                </li>
                <li className="flex justify-between">
                  <span>Partnership</span>
                  <span className="text-foreground">3-5 business days</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Other Ways to Reach Us</h3>
              <p className="text-sm text-muted-foreground">
                Email us directly at{" "}
                <a 
                  href="mailto:hello@forewire.com" 
                  className="text-primary hover:underline underline-offset-4"
                >
                  hello@forewire.com
                </a>
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            {isSubmitted ? (
              <div className="rounded-lg border border-chart-1/20 bg-chart-1/5 p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-chart-1/10">
                  <Send className="h-6 w-6 text-chart-1" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Message Sent</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="mt-6"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Reason Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {contactReasons.map((reason) => {
                      const Icon = reason.icon
                      return (
                        <button
                          key={reason.id}
                          type="button"
                          onClick={() => setSelectedReason(reason.id)}
                          className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                            selectedReason === reason.id
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{reason.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    className="bg-card"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="bg-card"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                    className="bg-card resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
