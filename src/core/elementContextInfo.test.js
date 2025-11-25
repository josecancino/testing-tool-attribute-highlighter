import { getElementContextInfo } from './elementContextInfo.js';

function el(tag) {
  const e = document.createElement(tag);
  return e;
}

test('truncates long text content', () => {
  const e = el('div');
  e.textContent = 'x'.repeat(100);
  const info = getElementContextInfo(e);
  expect(info).toMatch(/Text: ".*\.\.\."/);
});

test('image alt and filename', () => {
  const e = el('img');
  e.setAttribute('alt', 'logo');
  e.setAttribute('src', 'https://cdn.example.com/assets/logo.png');
  const info = getElementContextInfo(e);
  expect(info).toMatch(/Alt: logo/);
  expect(info).toMatch(/Image: logo\.png|Src:/);
});

test('link href truncated', () => {
  const e = el('a');
  e.setAttribute('href', 'https://example.com/a/very/long/path/that/should/be/truncated');
  const info = getElementContextInfo(e);
  expect(info).toMatch(/Link:/);
});

test('input type and placeholder', () => {
  const e = el('input');
  e.setAttribute('type', 'email');
  e.setAttribute('placeholder', 'Enter your email');
  const info = getElementContextInfo(e);
  expect(info).toMatch(/Type: email/);
  expect(info).toMatch(/Placeholder: Enter your email/);
});

test('button type included', () => {
  const e = el('button');
  e.setAttribute('type', 'submit');
  const info = getElementContextInfo(e);
  expect(info).toMatch(/Button type: submit/);
});

test('video src or poster present', () => {
  const e = el('video');
  e.setAttribute('src', 'https://cdn.example.com/video.mp4');
  e.setAttribute('poster', 'https://cdn.example.com/poster.jpg');
  const info = getElementContextInfo(e);
  expect(info).toMatch(/Video:/);
  expect(info).toMatch(/Poster:/);
});
