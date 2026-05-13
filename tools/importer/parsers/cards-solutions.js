/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-solutions
 * Base block: cards
 * Source: https://www.cintas.com/
 * Selector: .solution-grid
 * Description: Grid of 8 service category cards. Each card has an image, title,
 *   description paragraph, and "read more" link. Source uses card-two-sided elements
 *   with front (image + title) and back (title + description + link) sides.
 * UE Model: container block "cards" with child items of model "card"
 *   - image (reference): card image
 *   - text (richtext): title + description + link
 * Generated: 2026-05-11
 */
export default function parse(element, { document }) {
  // Select all card items from the solution grid
  const cards = element.querySelectorAll('.card-two-sided');

  const cells = [];

  cards.forEach((card) => {
    // Column 1: Card image from the front side
    const image = card.querySelector('.card-two-sided__image, .card-two-sided__front img');

    // Column 2: Title (from back side), description, and link
    const title = card.querySelector('.card-two-sided__title--back, .card-two-sided__back h3');
    const description = card.querySelector('.card-two-sided__text, .card-two-sided__back p');
    const link = card.querySelector('a.card-two-sided__link, .card-two-sided__back a');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) {
      // Handle lazy-loaded images: source uses data-mediasrc for lazy loading with empty src
      const currentSrc = image.getAttribute('src');
      if (!currentSrc || currentSrc === '') {
        const mediaSrc = image.getAttribute('data-mediasrc')
          || image.getAttribute('data-src')
          || image.getAttribute('data-lazy');
        if (mediaSrc) {
          image.setAttribute('src', mediaSrc);
        }
      }
      imageCell.appendChild(image);
    }

    // Build text cell with field hint: title (strong) + description + link
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (title) {
      // Wrap title text in <strong> as per library example pattern
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(strong);
      textCell.appendChild(p);
    }

    if (description) {
      textCell.appendChild(description);
    }

    if (link) {
      // Clean up "read more" link - remove visually-hidden span for cleaner text
      const cleanLink = link.cloneNode(true);
      const hiddenSpan = cleanLink.querySelector('.visually-hidden');
      if (hiddenSpan) {
        hiddenSpan.remove();
      }
      const linkP = document.createElement('p');
      linkP.appendChild(cleanLink);
      textCell.appendChild(linkP);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-solutions', cells });
  element.replaceWith(block);
}
