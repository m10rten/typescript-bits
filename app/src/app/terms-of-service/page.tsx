import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — typescript-bits",
  description: "Terms of Service for the typescript-bits website and documentation.",
};

export const pageContent =
  "Terms of Service for the typescript-bits website and documentation. " +
  "The site hosts documentation about the typescript-bits open-source TypeScript library. " +
  "The library source code is released under the MIT License. " +
  "Content on this site includes text documentation graphics logos code samples and design. " +
  "Site is provided as-is without warranties. " +
  "Terms governed by the laws of the Netherlands. " +
  "Contact via GitHub issues at github.com/m10rten/typescript-bits.";

export default function TosPage() {
  return (
    <div className="container-main py-12 md:py-16">
      <article className="max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 31, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using the typescript-bits website (the &ldquo;Site&rdquo;), you agree to be bound by these
            Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not use the Site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. The Site vs. The Library</h2>
          <p className="text-muted-foreground leading-relaxed">
            This Site hosts documentation and information about the typescript-bits open-source TypeScript library. The
            library source code is released under the{" "}
            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors">
              MIT License
            </a>{" "}
            and is governed by that license, not by these Terms. These Terms apply solely to your use of the Site
            itself.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content on this Site&mdash;including text, documentation, graphics, logos, code samples, and
            design&mdash;is owned by typescript-bits and its creators unless otherwise noted. You may not reproduce,
            distribute, modify, or publicly display any Site content without prior written permission, except as
            explicitly permitted by the underlying open-source license for code samples.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Use of the Site</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of others
            or restrict their use of the Site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. No Warranties</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Site and all content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any
            warranties of any kind, express or implied. We make no guarantees that the Site will be uninterrupted,
            error-free, secure, or free of harmful components.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the fullest extent permitted by law, typescript-bits and its creators shall not be liable for any
            direct, indirect, incidental, consequential, or special damages arising out of or in connection with your
            use of the Site, even if advised of the possibility of such damages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">7. External Links</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Site may contain links to third-party websites or resources. We have no control over, and assume no
            responsibility for, the content, privacy policies, or practices of any third-party sites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">8. Changes to These Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to update or modify these Terms at any time without prior notice. Changes are
            effective immediately upon posting. Your continued use of the Site after any changes constitutes acceptance
            of the new Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">9. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms are governed by the laws of the Netherlands, without regard to its conflict-of-law provisions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">10. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions about these Terms, please open an issue on{" "}
            <a
              href="https://github.com/m10rten/typescript-bits"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors">
              GitHub
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
