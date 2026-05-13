/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Cintas section breaks and section metadata.
 * Inserts <hr> section dividers and Section Metadata blocks based on template sections.
 * All selectors from page-templates.json, verified against captured DOM in migration-work/cleaned.html:
 *   - section-1: ".background-color-280.box-shadow" (style: dark-blue)
 *   - section-2: ".card-hero.card-hero--wide.homepage" (no style)
 *   - section-3: "#Main_C002_Col00.background-light-gray" (style: light-grey)
 *   - section-4: ".section--about-us" (no style)
 *   - section-5: ".card-section.card-section--investor-information" (no style)
 *   - section-6: "#Main_C062_Col00.background-light-gray" (style: light-grey)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = template.sections;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Insert Section Metadata block after the section element if it has a style
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metadataBlock);
      }

      // Insert <hr> before the section element (skip the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
