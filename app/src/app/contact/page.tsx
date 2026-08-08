import { ContactForm } from "./contact-form";
import { Hero } from "#/hero";

export const pageContent =
  "Get in touch with the typescript-bits team. " +
  "Send a message via the contact form or report bugs on GitHub Issues. " +
  "Found a bug? Request a feature? Have a question? We are happy to help.";

export default function ContactPage() {
  return (
    <div className="flex flex-col flex-1">
      <Hero intensity="subtle">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Get in touch</h1>
          <p className="text-foreground/80 text-base md:text-lg text-balance">
            Have a question, found a bug, or want to contribute? Send a message or find us on GitHub.
          </p>
        </div>
      </Hero>

      <ContactForm />
    </div>
  );
}
