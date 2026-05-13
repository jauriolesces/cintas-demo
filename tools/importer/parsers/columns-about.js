/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-about
 * Base block: columns
 * Source selector: .section--about-us
 * Structure: 1 row, 2 columns
 *   - Col 1: Video thumbnail image with play button link
 *   - Col 2: Heading (H2) + description paragraphs + CTA button link
 *
 * xwalk Columns block: No field hint comments required (per hinting.md Rule 4 exception).
 */
export default function parse(element, { document }) {
  // --- Column 1: Video thumbnail image + play button link ---
  // The left column contains an inline-media section. The thumbnail is NOT an <img> tag;
  // it is a CSS background image via data-mediasrc on .inline-media__item.lazy-bg.
  // We create an <img> from that data attribute and wrap it in the play link.
  const mediaItem = element.querySelector('.inline-media__item[data-mediasrc], .lazy-bg[data-mediasrc]');
  const thumbnailImg = element.querySelector('.inline-media__item img, .inline-media img');
  const playLink = element.querySelector('.inline-media__play-button, a[class*="play"]');

  const col1Content = [];

  // Try to get the thumbnail: first from data-mediasrc (CSS bg), then from actual <img>
  let imgEl = null;
  if (mediaItem && mediaItem.getAttribute('data-mediasrc')) {
    imgEl = document.createElement('img');
    imgEl.src = mediaItem.getAttribute('data-mediasrc');
    imgEl.alt = 'Video thumbnail';
  } else if (thumbnailImg) {
    imgEl = thumbnailImg;
  }

  if (imgEl && playLink) {
    // Wrap image inside the video link so it acts as a clickable video thumbnail
    const link = document.createElement('a');
    link.href = playLink.href;
    link.appendChild(imgEl);
    col1Content.push(link);
  } else if (imgEl) {
    col1Content.push(imgEl);
  } else if (playLink) {
    const link = document.createElement('a');
    link.href = playLink.href;
    link.textContent = playLink.textContent.trim() || 'Watch Now';
    col1Content.push(link);
  }

  // --- Column 2: Heading + paragraphs + CTA button ---
  const contentBlock = element.querySelector('.content-block, .sf_colsIn.col-md-6:last-child');
  const heading = element.querySelector('.content-block h2, .content-block h1, h2, h1');
  const paragraphs = Array.from(
    element.querySelectorAll('.content-block p, .content-block div > p')
  );
  const ctaLink = element.querySelector('.content-block a.btn, .content-block a.button, a.btn, a.button');

  const col2Content = [];
  if (heading) {
    col2Content.push(heading);
  }
  paragraphs.forEach((p) => {
    if (p.textContent.trim()) {
      col2Content.push(p);
    }
  });
  if (ctaLink) {
    col2Content.push(ctaLink);
  }

  // Build cells: 1 row with 2 columns
  const cells = [
    [col1Content, col2Content],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-about', cells });
  element.replaceWith(block);
}
