const asmoChar = [
  ['', 'j', 'k', 'h', 'i', 'n', 'o', 'l', 'm', 'r', 's', 'p', 'q', 'v', 'w', 't', 'u', 'z', 'G', 'b', 'c', 'J', 'a', 'f', 'g', 'd', 'e'],
  ['', 'e', 'f', 'c', 'd', 'i', 'j', 'g', 'h', 'm', 'n', 'k', 'l', 'q', 'r', 'o', 'p', 'u', 'v', 's', 't', 'y', 'z', 'a', 'b', 'I', 'J'],
  ['', 'f', 'g', 'd', 'e', 'j', 'k', 'h', 'i', 'n', 'o', 'l', 'm', 'r', 's', 'p', 'q', 'v', 'w', 't', 'u', 'z', 'G', 'b', 'c', 'J', 'a'],
  ['', 'g', 'h', 'e', 'f', 'k', 'l', 'i', 'j', 'o', 'p', 'm', 'n', 's', 't', 'q', 'r', 'w', 'x', 'u', 'v', 'G', 'H', 'c', 'd', 'a', 'b']
];

const asmoNextTable = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 3, 2, 2, 2, 2, 2],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 3, 2],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2]
];

const elyoChar = [
  ['', 'i', 'h', 'k', 'j', 'm', 'l', 'o', 'n', 'q', 'p', 's', 'r', 'u', 't', 'w', 'v', 'y', 'x', 'a', 'z', 'c', 'b', 'e', 'd', 'g', 'f'],
  ['', 'd', 'c', 'f', 'e', 'h', 'g', 'j', 'i', 'l', 'k', 'n', 'm', 'p', 'o', 'r', 'q', 't', 's', 'v', 'u', 'x', 'w', 'z', 'y', 'b', 'a'],
  ['', 'e', 'd', 'g', 'f', 'i', 'h', 'k', 'j', 'm', 'l', 'o', 'n', 'q', 'p', 's', 'r', 'u', 't', 'w', 'v', 'y', 'x', 'a', 'z', 'c', 'b']
];

const elyoNextTable = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2]
];

let mode = 0;

function letterIndex(ch) {
  const code = ch.charCodeAt(0);
  return (code >= 97 && code <= 122) ? code - 96 : 0;
}

function translate() {
  const input = document.getElementById('input').value.toLowerCase();

  if (input) {
    if (input.length >= 255) {
      document.getElementById('message-limit-warning').style.visibility = 'visible';
      if (input.length > 255) {
        return;
      }
    } else {
      document.getElementById('message-limit-warning').style.visibility = 'hidden';
    }
    let output = '';
    let tableIndex = 0;

    for (let ch of input) {
      let idx = letterIndex(ch);
      if (idx !== 0) {
        output += (mode === 0)
          ? asmoChar[tableIndex][idx]
          : elyoChar[tableIndex][idx];
        tableIndex = (mode === 0)
          ? asmoNextTable[tableIndex][idx]
          : elyoNextTable[tableIndex][idx];
      } else {
        output += ch;
        tableIndex = 0;
      }
    }

    const outputEl = document.getElementById('output');
    outputEl.textContent = output;
    console.log('input: ' + input);
    console.log('output: ' + output);
    outputEl.classList.remove('asmodian', 'elyos');
    outputEl.classList.add(mode === 0 ? 'elyos' : 'asmodian');
  } else {
    const outputEl = document.getElementById('output');
    outputEl.textContent = '';
    outputEl.classList.remove('asmodian', 'elyos');
    document.getElementById('message-limit-warning').style.visibility = 'hidden';
  }
  updatePreview();
}

function toggleMode() {
  mode = 1 - mode;
  document.getElementById('mode-label').textContent =
    mode === 0 ? 'Mode: Asmodian → Elyos' : 'Mode: Elyos → Asmodian';
  bg_image = document.getElementById('bg-image')
  bg_image.src =
    mode === 0 ? bg_image.src.replace('elyos', 'asmo') : bg_image.src.replace('asmo', 'elyos');
  bg_image.srcset =
    mode === 0 ? bg_image.srcset.replaceAll('elyos', 'asmo') : bg_image.srcset.replaceAll('asmo', 'elyos');
  bg_image.alt =
    mode === 0 ? bg_image.alt.replace('Elyos', 'Asmodian') : bg_image.alt.replace('Asmodian', 'Elyos');
  translate();
}

function extractText(node, text) {
  if (node.nodeType === Node.TEXT_NODE) {
    text += node.textContent;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'IMG') {
      text += node.alt || '';
    } else {
      for (const child of node.childNodes) {
        extractText(child); // check every child recursive
      }
    }
  }
}

function copyOutput() {
  const output = document.getElementById('output');
  if (!output) return;

  let text = ''
  extractText(output, text);

  if (!text) return;

  navigator.clipboard.writeText(result)
    .then(() => alert('Translation copied to clipboard!'))
    .catch(() => alert('Failed to copy text'));
}

function setBestBackgroundImage() {
  const img = document.getElementById('bg-image');
  const width = window.innerWidth;
  let bestWidth;
  let bestHeight;

  if (width >= 7680) {
    bestWidth = 7680;
  } else if (width >= 3840) {
    bestWidth = 3840;
  } else if (width >= 2560) {
    bestWidth = 2560;
  } else if (width >= 1920) {
    bestWidth = 1920;
  } else if (width >= 1280) {
    bestWidth = 1280;
  } else if (width >= 960) {
    bestWidth = 960;
  } else if (width >= 640) {
    bestWidth = 640;
  }
  else if (width >= 412) {
    bestWidth = 412;
    bestHeight = 732;
  } else {
    bestWidth = 420;
  }

  if (!bestHeight) {
    bestHeight = Math.round(bestWidth / 16 * 9);
  }

  img.src = `resources/aion-asmo-${bestWidth}x${Math.round(bestHeight)}.png`;
  img.removeAttribute('srcset');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('input').addEventListener('input', translate);
  setBestBackgroundImage();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
});