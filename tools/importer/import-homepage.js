/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import cardsSolutionsParser from './parsers/cards-solutions.js';
import columnsAboutParser from './parsers/columns-about.js';
import cardsInvestorParser from './parsers/cards-investor.js';
import formParser from './parsers/form.js';

// TRANSFORMER IMPORTS
import cintasCleanupTransformer from './transformers/cintas-cleanup.js';
import cintasSectionsTransformer from './transformers/cintas-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'cards-solutions': cardsSolutionsParser,
  'columns-about': columnsAboutParser,
  'cards-investor': cardsInvestorParser,
  'form': formParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Cintas corporate homepage with hero, services, and promotional content',
  urls: [
    'https://www.cintas.com/'
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.card-hero.card-hero--wide.homepage']
    },
    {
      name: 'cards-solutions',
      instances: ['.solution-grid']
    },
    {
      name: 'columns-about',
      instances: ['.section--about-us']
    },
    {
      name: 'cards-investor',
      instances: ['.card-section.card-section--investor-information']
    },
    {
      name: 'form',
      instances: ['.card-section.card-section--new-services form']
    }
  ],
  sections: [
    {
      id: 'section-1-announcement',
      name: 'Announcement Banner',
      selector: '.background-color-280.box-shadow',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['.background-color-280.box-shadow .content-block p']
    },
    {
      id: 'section-2-hero',
      name: 'Hero',
      selector: '.card-hero.card-hero--wide.homepage',
      style: null,
      blocks: ['hero-homepage'],
      defaultContent: []
    },
    {
      id: 'section-3-solutions',
      name: 'Solutions Grid',
      selector: '#Main_C002_Col00.background-light-gray',
      style: 'light-grey',
      blocks: ['cards-solutions'],
      defaultContent: ['#Main_C016_Col00 .content-block h2']
    },
    {
      id: 'section-4-about',
      name: 'About Us',
      selector: '.section--about-us',
      style: null,
      blocks: ['columns-about'],
      defaultContent: []
    },
    {
      id: 'section-5-investor',
      name: 'Investor Information',
      selector: '.card-section.card-section--investor-information',
      style: null,
      blocks: ['cards-investor'],
      defaultContent: ['.card-section--investor-information .content-block h2', '.card-section--investor-information .content-block a.button']
    },
    {
      id: 'section-6-contact',
      name: 'Contact / New Services',
      selector: '#Main_C062_Col00.background-light-gray',
      style: 'light-grey',
      blocks: ['form'],
      defaultContent: ['.card-section--new-services .background-white .content-block']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cintasCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [cintasSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
