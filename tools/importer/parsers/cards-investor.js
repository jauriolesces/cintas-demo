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
 * Images use lazy loading via data-mediasrc attribute instead of src.
 *
 * UE Model (card): image (reference), text (richtext)
 * Container block: each card item = one row with 2 columns (image | text)
 */
export default function parse(element, { document }) {
  const iconCards = element.querySelectorAll('.icon-card');

  const cells = [];

  iconCards.forEach((card) => {
    // Column 1: Icon image with field hint
    const iconImg = card.querySelector('img.icon-card__icon, img[class*="icon-card__icon"]');
    const imageCell = document.createDocumentFragment();

    if (iconImg) {
      // Resolve lazy-loaded image: check data-mediasrc, data-src, srcset
      const lazySrc = iconImg.getAttribute('data-mediasrc')
        || iconImg.getAttribute('data-src')
        || iconImg.getAttribute('srcset')
        || iconImg.getAttribute('src');

      if (lazySrc && lazySrc !== '') {
        const newImg = document.createElement('img');
        newImg.src = lazySrc;
        newImg.alt = iconImg.alt || '';
        imageCell.appendChild(document.createComment(' field:image '));
        const p = document.createElement('p');
        const picture = document.createElement('picture');
        picture.appendChild(newImg);
        p.appendChild(picture);
        imageCell.appendChild(p);
      }
    }

    // Column 2: Title + description + link as richtext with field hint
    const title = card.querySelector('h3.icon-card__title, .icon-card__title');
    const description = card.querySelector('div.icon-card__text, .icon-card__text');
    const link = card.querySelector('a.icon-card__link, .icon-card__link');

    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.appendChild(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }
    if (link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-investor', cells });
  element.replaceWith(block);
}
