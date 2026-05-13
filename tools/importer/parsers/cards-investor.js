/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-investor
 * Base block: cards
 * Source selector: .card-section.card-section--investor-information
 * Source: https://www.cintas.com/
 * Generated: 2026-05-11
 *
 * Extracts icon cards from the investor information section.
 * Each card has: icon image (.icon-card__icon), title (h3.icon-card__title),
 * description (div.icon-card__text), and link (a.icon-card__link).
 *
 * UE Model (card): image (reference), text (richtext)
 * Container block: each card item = one row with 2 columns (image | text)
 */
export default function parse(element, { document }) {
  // Find all icon-card elements within the investor section
  const iconCards = element.querySelectorAll('.icon-card');

  const cells = [];

  iconCards.forEach((card) => {
    // Column 1: Icon image with field hint
    // Images may use lazy loading with data-mediasrc instead of src
    const iconImg = card.querySelector('img.icon-card__icon, img[class*="icon-card__icon"]');
    const imageCell = document.createDocumentFragment();
    if (iconImg) {
      // Resolve lazy-loaded image src from data-mediasrc or data-src
      if (!iconImg.getAttribute('src') || iconImg.getAttribute('src') === '') {
        const lazySrc = iconImg.getAttribute('data-mediasrc') || iconImg.getAttribute('data-src') || '';
        if (lazySrc) {
          iconImg.setAttribute('src', lazySrc);
        }
      }
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(iconImg);
    }

    // Column 2: Title + description + link as richtext with field hint
    const title = card.querySelector('h3.icon-card__title, .icon-card__title');
    const description = card.querySelector('div.icon-card__text, .icon-card__text');
    const link = card.querySelector('a.icon-card__link, .icon-card__link');

    const textCell = document.createDocumentFragment();
    let hasTextContent = false;

    if (title) {
      hasTextContent = true;
      textCell.appendChild(document.createComment(' field:text '));
      textCell.appendChild(title);
    }
    if (description) {
      if (!hasTextContent) {
        textCell.appendChild(document.createComment(' field:text '));
        hasTextContent = true;
      }
      textCell.appendChild(description);
    }
    if (link) {
      if (!hasTextContent) {
        textCell.appendChild(document.createComment(' field:text '));
        hasTextContent = true;
      }
      textCell.appendChild(link);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-investor', cells });
  element.replaceWith(block);
}
