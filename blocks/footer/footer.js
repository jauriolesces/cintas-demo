import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const temp = document.createElement('div');
  temp.innerHTML = html;

  block.textContent = '';
  const footer = document.createElement('div');

  // Extract content divs from wrapper, skipping any stray head elements
  let contentDivs = [...temp.querySelectorAll(':scope > div > div')];
  if (contentDivs.length < 2) {
    contentDivs = [...temp.querySelectorAll(':scope > div')];
  }
  contentDivs.forEach((div) => footer.append(div));

  // Strip button classes from footer links
  footer.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
    const btn = bc.querySelector('.button');
    if (btn) btn.classList.remove('button');
  });

  block.append(footer);
}
