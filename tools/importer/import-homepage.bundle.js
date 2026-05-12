/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('.card-hero__image img, img[alt="homepage_new"], img');
    const heading = element.querySelector('h1.card-hero__headline, h1, h2, [class*="headline"]');
    const cells = [];
    if (bgImage) {
      const imageFragment = document.createDocumentFragment();
      imageFragment.appendChild(document.createComment(" field:image "));
      imageFragment.appendChild(bgImage);
      cells.push([imageFragment]);
    } else {
      cells.push([""]);
    }
    if (heading) {
      const textFragment = document.createDocumentFragment();
      textFragment.appendChild(document.createComment(" field:text "));
      textFragment.appendChild(heading);
      cells.push([textFragment]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-solutions.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(".card-two-sided");
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".card-two-sided__image, .card-two-sided__front img");
      const title = card.querySelector(".card-two-sided__title--back, .card-two-sided__back h3");
      const description = card.querySelector(".card-two-sided__text, .card-two-sided__back p");
      const link = card.querySelector("a.card-two-sided__link, .card-two-sided__back a");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (image) {
        const currentSrc = image.getAttribute("src");
        if (!currentSrc || currentSrc === "") {
          const mediaSrc = image.getAttribute("data-mediasrc") || image.getAttribute("data-src") || image.getAttribute("data-lazy");
          if (mediaSrc) {
            image.setAttribute("src", mediaSrc);
          }
        }
        imageCell.appendChild(image);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (title) {
        const strong = document.createElement("strong");
        strong.textContent = title.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(strong);
        textCell.appendChild(p);
      }
      if (description) {
        textCell.appendChild(description);
      }
      if (link) {
        const cleanLink = link.cloneNode(true);
        const hiddenSpan = cleanLink.querySelector(".visually-hidden");
        if (hiddenSpan) {
          hiddenSpan.remove();
        }
        const linkP = document.createElement("p");
        linkP.appendChild(cleanLink);
        textCell.appendChild(linkP);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-solutions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-about.js
  function parse3(element, { document }) {
    const mediaItem = element.querySelector(".inline-media__item[data-mediasrc], .lazy-bg[data-mediasrc]");
    const thumbnailImg = element.querySelector(".inline-media__item img, .inline-media img");
    const playLink = element.querySelector('.inline-media__play-button, a[class*="play"]');
    const col1Content = [];
    let imgEl = null;
    if (mediaItem && mediaItem.getAttribute("data-mediasrc")) {
      imgEl = document.createElement("img");
      imgEl.src = mediaItem.getAttribute("data-mediasrc");
      imgEl.alt = "Video thumbnail";
    } else if (thumbnailImg) {
      imgEl = thumbnailImg;
    }
    if (imgEl && playLink) {
      const link = document.createElement("a");
      link.href = playLink.href;
      link.appendChild(imgEl);
      col1Content.push(link);
    } else if (imgEl) {
      col1Content.push(imgEl);
    } else if (playLink) {
      const link = document.createElement("a");
      link.href = playLink.href;
      link.textContent = playLink.textContent.trim() || "Watch Now";
      col1Content.push(link);
    }
    const contentBlock = element.querySelector(".content-block, .sf_colsIn.col-md-6:last-child");
    const heading = element.querySelector(".content-block h2, .content-block h1, h2, h1");
    const paragraphs = Array.from(
      element.querySelectorAll(".content-block p, .content-block div > p")
    );
    const ctaLink = element.querySelector(".content-block a.btn, .content-block a.button, a.btn, a.button");
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
    const cells = [
      [col1Content, col2Content]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-about", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-investor.js
  function parse4(element, { document }) {
    const iconCards = element.querySelectorAll(".icon-card");
    const cells = [];
    iconCards.forEach((card) => {
      const iconImg = card.querySelector('img.icon-card__icon, img[class*="icon-card__icon"]');
      const imageCell = document.createDocumentFragment();
      if (iconImg) {
        if (!iconImg.getAttribute("src") || iconImg.getAttribute("src") === "") {
          const lazySrc = iconImg.getAttribute("data-mediasrc") || iconImg.getAttribute("data-src") || "";
          if (lazySrc) {
            iconImg.setAttribute("src", lazySrc);
          }
        }
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(iconImg);
      }
      const title = card.querySelector("h3.icon-card__title, .icon-card__title");
      const description = card.querySelector("div.icon-card__text, .icon-card__text");
      const link = card.querySelector("a.icon-card__link, .icon-card__link");
      const textCell = document.createDocumentFragment();
      let hasTextContent = false;
      if (title) {
        hasTextContent = true;
        textCell.appendChild(document.createComment(" field:text "));
        textCell.appendChild(title);
      }
      if (description) {
        if (!hasTextContent) {
          textCell.appendChild(document.createComment(" field:text "));
          hasTextContent = true;
        }
        textCell.appendChild(description);
      }
      if (link) {
        if (!hasTextContent) {
          textCell.appendChild(document.createComment(" field:text "));
          hasTextContent = true;
        }
        textCell.appendChild(link);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-investor", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse5(element, { document }) {
    var _a;
    const formPath = "/forms/contact-form";
    const formLink = document.createElement("a");
    formLink.href = formPath;
    formLink.textContent = formPath;
    const refFrag = document.createDocumentFragment();
    refFrag.appendChild(document.createComment(" field:reference "));
    refFrag.appendChild(formLink);
    const formAction = element.getAttribute("action") || ((_a = element.closest("form")) == null ? void 0 : _a.getAttribute("action")) || "";
    const actionFrag = document.createDocumentFragment();
    if (formAction) {
      actionFrag.appendChild(document.createComment(" field:action "));
      const actionLink = document.createElement("a");
      actionLink.href = formAction;
      actionLink.textContent = formAction;
      actionFrag.appendChild(actionLink);
    }
    const cells = [];
    cells.push([refFrag]);
    if (formAction) {
      cells.push([actionFrag]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cintas-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".ins-preview-wrapper",
        ".ins-ghost"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#site-header",
        "footer#site-footer",
        "nav",
        ".grecaptcha-badge",
        "#insider-worker",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/cintas-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metadataBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "cards-solutions": parse2,
    "columns-about": parse3,
    "cards-investor": parse4,
    "form": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Cintas corporate homepage with hero, services, and promotional content",
    urls: [
      "https://www.cintas.com/"
    ],
    blocks: [
      {
        name: "hero-homepage",
        instances: [".card-hero.card-hero--wide.homepage"]
      },
      {
        name: "cards-solutions",
        instances: [".solution-grid"]
      },
      {
        name: "columns-about",
        instances: [".section--about-us"]
      },
      {
        name: "cards-investor",
        instances: [".card-section.card-section--investor-information"]
      },
      {
        name: "form",
        instances: [".card-section.card-section--new-services form"]
      }
    ],
    sections: [
      {
        id: "section-1-announcement",
        name: "Announcement Banner",
        selector: ".background-color-280.box-shadow",
        style: "dark-blue",
        blocks: [],
        defaultContent: [".background-color-280.box-shadow .content-block p"]
      },
      {
        id: "section-2-hero",
        name: "Hero",
        selector: ".card-hero.card-hero--wide.homepage",
        style: null,
        blocks: ["hero-homepage"],
        defaultContent: []
      },
      {
        id: "section-3-solutions",
        name: "Solutions Grid",
        selector: "#Main_C002_Col00.background-light-gray",
        style: "light-grey",
        blocks: ["cards-solutions"],
        defaultContent: ["#Main_C016_Col00 .content-block h2"]
      },
      {
        id: "section-4-about",
        name: "About Us",
        selector: ".section--about-us",
        style: null,
        blocks: ["columns-about"],
        defaultContent: []
      },
      {
        id: "section-5-investor",
        name: "Investor Information",
        selector: ".card-section.card-section--investor-information",
        style: null,
        blocks: ["cards-investor"],
        defaultContent: [".card-section--investor-information .content-block h2", ".card-section--investor-information .content-block a.button"]
      },
      {
        id: "section-6-contact",
        name: "Contact / New Services",
        selector: "#Main_C062_Col00.background-light-gray",
        style: "light-grey",
        blocks: ["form"],
        defaultContent: [".card-section--new-services .background-white .content-block"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
