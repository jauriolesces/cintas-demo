/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form variant.
 * Base block: form
 * Source: https://www.cintas.com/
 * Generated: 2026-05-11
 *
 * EDS Form block expects a link to a form definition spreadsheet and an action URL.
 * The source HTML contains a complex contact form with fields for name, company,
 * address, phone, email, comments, and service interest checkboxes.
 * For EDS, this is represented as a simple block table with a reference to a
 * form definition path and an optional action URL.
 */
export default function parse(element, { document }) {
  // Build the form definition link
  // EDS forms use a spreadsheet-based form definition rather than inline HTML fields
  const formPath = '/forms/contact-form';
  const formLink = document.createElement('a');
  formLink.href = formPath;
  formLink.textContent = formPath;

  // Build the reference cell with field hint
  const refFrag = document.createDocumentFragment();
  refFrag.appendChild(document.createComment(' field:reference '));
  refFrag.appendChild(formLink);

  // Build the action URL cell with field hint
  // Extract any action attribute from the source form element if available
  const formAction = element.getAttribute('action') || element.closest('form')?.getAttribute('action') || '';
  const actionFrag = document.createDocumentFragment();
  if (formAction) {
    actionFrag.appendChild(document.createComment(' field:action '));
    const actionLink = document.createElement('a');
    actionLink.href = formAction;
    actionLink.textContent = formAction;
    actionFrag.appendChild(actionLink);
  }

  // Build cells array matching the UE model structure:
  // Row 1: reference (form definition path)
  // Row 2: action (submit URL) - only if action exists
  const cells = [];
  cells.push([refFrag]);
  if (formAction) {
    cells.push([actionFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
