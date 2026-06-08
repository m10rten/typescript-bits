import { forwardRef, type AnchorHTMLAttributes } from "react";

export const ExternalLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ children, ...props }, ref) => {
    return (
      <a ref={ref} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
);

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
