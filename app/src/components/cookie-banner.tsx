"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-banner-dismissed";

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div role="alert" className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
      <div className="container-main flex items-center justify-between gap-4 py-3">
        <p className="text-sm text-muted-foreground">
          By accessing this site, you agree to our{" "}
          <a href="/terms-of-service" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Terms of Service
          </a>
          .
        </p>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss notice"
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
