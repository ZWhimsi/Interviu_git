/**
 * Configuration for private pages that should respect dark mode
 * Public pages (Landing, About, Contact, Pricing, Terms, Privacy) should NOT be affected by dark mode
 */
export const PRIVATE_PAGES = [
  "/dashboard",
  "/user-profile",
  "/cv-analysis",
  "/profile",
];

/**
 * Check if current page is a private page
 */
export function isPrivatePage(
  pathname: string = window.location.pathname
): boolean {
  return PRIVATE_PAGES.some((page) => pathname.includes(page));
}


