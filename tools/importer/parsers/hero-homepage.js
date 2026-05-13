/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage
 * Base block: hero
 * Selector: .card-hero.card-hero--wide.homepage
 * Source: https://www.cintas.com/
 *
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Target structure (from library example):
 *   Row 1: background image (field: image)
 *   Row 2: heading text (field: text)
 */
export default function parse(element, { document }) {
  // Extract background image from .card-hero__image container
  const bgImage = element.querySelector('.card-hero__image img, img[alt="homepage_new"], img');

  // Extract heading from .card-hero__copy container
  const heading = element.querySelector('h1.card-hero__headline, h1, h2, [class*="headline"]');

  const cells = [];

  // Row 1: Background image with field hint
  if (bgImage) {
    const imageFragment = document.createDocumentFragment();
    imageFragment.appendChild(document.createComment(' field:image '));
    imageFragment.appendChild(bgImage);
    cells.push([imageFragment]);
  } else {
    // Empty row to maintain structure (xwalk requires all rows)
    cells.push(['']);
  }

  // Row 2: Heading text with field hint
  if (heading) {
    const textFragment = document.createDocumentFragment();
    textFragment.appendChild(document.createComment(' field:text '));
    textFragment.appendChild(heading);
    cells.push([textFragment]);
  } else {
    // Empty row to maintain structure (xwalk requires all rows)
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
