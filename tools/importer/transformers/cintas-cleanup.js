/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Cintas site-wide cleanup.
 * Removes non-authorable content (header, footer, nav, cookie consent, tracking widgets).
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie consent SDK - found: <div id="onetrust-consent-sdk">
    // Insider preview/notification overlays - found: <div class="ins-preview-wrapper ...">
    // Insider ghost ad elements - found: <div class="ins-ghost textads ...">
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.ins-preview-wrapper',
      '.ins-ghost',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Site header with nav, search, utility nav - found: <header id="site-header" class="site-header ...">
    // Site footer with social links, legal, nav - found: <footer id="site-footer" class="site-footer">
    // Main navigation elements - found: <nav id="MainNav-1" class="main-nav">
    // reCAPTCHA badge - found: <div class="grecaptcha-badge">
    // Insider worker iframe - found: <iframe id="insider-worker" ...>
    // Generic iframes (reCAPTCHA, tracking) - found on lines 2001, 2009
    // Link elements (stylesheets) - non-authorable
    // Noscript elements (GTM) - found in body comment area
    WebImporter.DOMUtils.remove(element, [
      'header#site-header',
      'footer#site-footer',
      'nav',
      '.grecaptcha-badge',
      '#insider-worker',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
