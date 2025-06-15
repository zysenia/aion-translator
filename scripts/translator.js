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
  const bg_avif = document.getElementById('bg-avif');
  //const bg_webp = document.getElementById('bg-webp')
  const bg_image = document.getElementById('bg-image');
  const toggle_button = document.getElementById('toggle-mode');

  if (mode === 0) {
    bg_avif.srcset = bg_avif.srcset.replace('elyos', 'asmodian');
    //bg_webp.srcset = bg_webp.srcset.replace('elyos', 'asmodian');
    bg_image.src = bg_image.src.replace('elyos', 'asmodian');
    bg_image.alt = bg_image.alt.replace('Elyos', 'Asmodian');
    toggle_button.setAttribute('aria-pressed', 'false');
    toggle_button.setAttribute('aria-label', 'Switch translation mode to Elyos → Asmodian');
    toggle_button.setAttribute('title', 'Switch translation mode to Elyos → Asmodian');
  } else {
    bg_avif.srcset = bg_avif.srcset.replace('asmodian', 'elyos');
    //bg_webp.srcset = bg_webp.srcset.replace('asmodian', 'elyos');
    bg_image.src = bg_image.src.replace('asmodian', 'elyos');
    bg_image.alt = bg_image.alt.replace('Asmodian', 'Elyos');
    toggle_button.setAttribute('aria-pressed', 'true');
    toggle_button.setAttribute('aria-label', 'Switch translation mode to Asmodian → Elyos');
    toggle_button.setAttribute('title', 'Switch translation mode to Asmodian → Elyos');
  }
  translate();
}

function extractText(node) {
  let text = '';
  if (node.nodeType === Node.TEXT_NODE) {
    text += node.textContent;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'IMG') {
      text += node.alt || '';
    } else {
      for (const child of node.childNodes) {
        text += extractText(child); // check every child recursive
      }
    }
  }
  return text;
}

function copyOutput() {
  const output = document.getElementById('output');
  if (!output) return;

  let text = extractText(output);

  if (!text) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(document.getElementById('copyOutputToast'), 'success', 'Copied to clipboard!');
      })
      .catch(() => {
        showToast(document.getElementById('copyOutputToast'), 'error', 'Failed to copy text');
      });
  } else {
    showToast(document.getElementById('copyOutputToast'), 'error', 'Clipboard not supported or HTTPS required');
  }
}

function showToast(toast, type = 'success', message, duration = 2000) {
  toast.textContent = message;
  toast.setAttribute('aria-hidden', 'false');
  toast.className = 'toast show ' + type;
  setTimeout(() => {
    toast.className = 'toast ' + type;
    toast.setAttribute('aria-hidden', 'true');
    toast.textContent = '';
  }, duration);
}

function setBestBackgroundImage() {
  const avif = document.getElementById('bg-avif');
  //const webp = document.getElementById('bg-webp')
  const img = document.getElementById('bg-image');

  let currentFaction = 'asmodian';
  if (img.src.includes('elyos')) {
    currentFaction = 'elyos';
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  const imageSizes = [
    { width: 320, height: 568 },
    { width: 360, height: 640 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 412, height: 732 },
    { width: 414, height: 896 },
    { width: 428, height: 926 },
    { width: 430, height: 932 },
    { width: 440, height: 956 },
    { width: 420, height: 236 }, // Fallback for very small screens
    { width: 640, height: 360 },
    { width: 960, height: 540 },
    { width: 1280, height: 720 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 },
    { width: 3840, height: 2160 },
    { width: 7680, height: 4320 }
  ];

  let bestMatch = imageSizes.find(size => width <= size.width && height <= size.height);

  if (!bestMatch) {
    bestMatch = imageSizes[imageSizes.length - 1];
  }
  console.log('width x height: ' + width + ' x ' + height);
  console.log('bestMatch: ' + bestMatch.width + ' x ' + bestMatch.height);
  avif.srcset = `/assets/images/backgrounds/aion-${currentFaction}-faction-bg-${bestMatch.width}x${Math.round(bestMatch.height)}.avif`;
  //webp.srcset = `/assets/images/backgrounds/aion-${currentFaction}-faction-bg-${bestMatch.width}x${Math.round(bestMatch.height)}.webp`;
  img.src = `/assets/images/backgrounds/aion-${currentFaction}-faction-bg-${bestMatch.width}x${Math.round(bestMatch.height)}.png`;
  img.removeAttribute('srcset');
}

function resizeBgWrapper() {
  document.querySelector('.bg-image-wrapper').style.height = document.body.scrollHeight + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('input').addEventListener('input', translate);
  setBestBackgroundImage();
  window.addEventListener('resize', setBestBackgroundImage);
  window.addEventListener('resize', resizeBgWrapper);
  window.addEventListener('scroll', resizeBgWrapper);
  window.addEventListener('touchmove', resizeBgWrapper);
  document.getElementsByClassName('translator-info')[0].classList.add('appear');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
});