import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) {
    resp = await fetch('/footer.plain.html');
  }
  if (!resp.ok) return;

  const html = await resp.text();
  const temp = document.createElement('div');
  temp.innerHTML = html;

  block.textContent = '';
  const footer = document.createElement('div');

  let contentDivs = [...temp.querySelectorAll(':scope > div > div')];
  if (contentDivs.length < 2) {
    contentDivs = [...temp.querySelectorAll(':scope > div')];
  }
  contentDivs.forEach((div) => footer.append(div));

  footer.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
    const btn = bc.querySelector('.button');
    if (btn) btn.classList.remove('button');
  });

  block.append(footer);
}
