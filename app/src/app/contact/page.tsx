import { ContactForm } from "./contact-form";

export const pageContent =
  "Get in touch with the typescript-bits team. " +
  "Send a message via the contact form or report bugs on GitHub Issues. " +
  "Found a bug? Request a feature? Have a question? We are happy to help.";

export default function ContactPage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero section */}
      <section className="hero-bg relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle, oklch(0 0 0 / 0.03) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] -z-10"
          aria-hidden="true"
        />

        <div className="container-main py-12 md:py-16">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Get in touch</h1>
            <p className="text-muted-foreground text-base md:text-lg text-balance">
              Have a question, found a bug, or want to contribute? Send a message or find us on GitHub.
            </p>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
