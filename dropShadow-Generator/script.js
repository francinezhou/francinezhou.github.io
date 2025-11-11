const INCH_TO_PX = 96;
const el = id => document.getElementById(id);

const svgInput = el('svgInput');
const fileInput = el('fileInput');
const stepsInput = el('steps');
const stepInput = el('step');
const outlineInput = el('outline');
const shadowColorInput = el('shadowColor');
const roundRadiusInput = el('roundRadius');
const applyBtn = el('applyBtn');
const downloadBtn = el('downloadBtn');
const previewWrap = el('previewWrap');

const angleDial = el('angleDial');
const dialKnob = el('dialKnob');
const angleDisplay = el('angleDisplay');

const cornerRadios = document.querySelectorAll('input[name="cornerStyle"]');

// start at 225° on the dial (0 = top, clockwise)
let currentDialAngle = 225;
let lastOutputSVG = '';

// snapping config
const SNAP_STEP = 5;
const IMPORTANT_ANGLES = [45, 135, 225, 315];
const IMPORTANT_THRESHOLD = 6;

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => svgInput.value = ev.target.result;
  reader.readAsText(file);
});

cornerRadios.forEach(r => {
  r.addEventListener('change', () => {
    const val = getCornerStyle();
    roundRadiusInput.disabled = val !== 'round';
  });
});

function getCornerStyle() {
  const checked = document.querySelector('input[name="cornerStyle"]:checked');
  return checked ? checked.value : 'sharp';
}

function snapAngle(deg) {
  for (const imp of IMPORTANT_ANGLES) {
    if (Math.abs(deg - imp) <= IMPORTANT_THRESHOLD) {
      return imp;
    }
  }
  return Math.round(deg / SNAP_STEP) * SNAP_STEP;
}

function setDialAngle(deg) {
  deg = ((deg % 360) + 360) % 360;
  deg = snapAngle(deg);
  currentDialAngle = deg;
  dialKnob.style.transform = `translateX(-50%) rotate(${deg}deg)`;
  angleDisplay.textContent = `${deg}°`;
}

function handleDialPointer(e) {
  const rect = angleDial.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - cx;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - cy;

  let rad = Math.atan2(y, x);
  let deg = rad * 180 / Math.PI;
  deg = deg + 90;
  setDialAngle(deg);
}

let dialActive = false;

angleDial.addEventListener('mousedown', e => {
  dialActive = true;
  handleDialPointer(e);
});
angleDial.addEventListener('touchstart', e => {
  dialActive = true;
  handleDialPointer(e);
}, { passive: true });

window.addEventListener('mousemove', e => {
  if (!dialActive) return;
  handleDialPointer(e);
});
window.addEventListener('touchmove', e => {
  if (!dialActive) return;
  handleDialPointer(e);
}, { passive: true });

window.addEventListener('mouseup', () => dialActive = false);
window.addEventListener('touchend', () => dialActive = false);

// init dial to 225
setDialAngle(currentDialAngle);

applyBtn.addEventListener('click', () => {
  if (!svgInput.value.trim()) {
    alert('Paste or load an SVG first.');
    return;
  }

  const svgAngle = currentDialAngle - 90;

  const opts = {
    angle: svgAngle,
    steps: parseInt(stepsInput.value, 10),
    stepPx: parseFloat(stepInput.value) * INCH_TO_PX,
    outlinePx: parseFloat(outlineInput.value) * INCH_TO_PX,
    shadowColor: shadowColorInput.value,
    cornerStyle: getCornerStyle(),
    roundRadiusPx: parseFloat(roundRadiusInput.value) * INCH_TO_PX
  };

  const out = makeShadowSVG(svgInput.value, opts);
  lastOutputSVG = out;
  previewWrap.innerHTML = out;
});

downloadBtn.addEventListener('click', () => {
  if (!lastOutputSVG) {
    alert('Generate first.');
    return;
  }
  const blob = new Blob([lastOutputSVG], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shadowed.svg';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

function makeShadowSVG(svgString, opts) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const srcSvg = doc.documentElement;

  let widthAttr = srcSvg.getAttribute('width') || '800';
  let heightAttr = srcSvg.getAttribute('height') || '300';
  let viewBoxAttr = srcSvg.getAttribute('viewBox');

  const serializer = new XMLSerializer();
  const children = Array.from(srcSvg.childNodes).filter(n => n.nodeType === 1);

  const rad = opts.angle * Math.PI / 180;
  const stepX = Math.cos(rad) * opts.stepPx;
  const stepY = Math.sin(rad) * opts.stepPx;

  // grow shadow source a bit
  const SHADOW_GROW_PX = opts.outlinePx * 0.4;

  const shadowPieces = [];
  for (let i = 1; i <= opts.steps; i++) {
    const tx = stepX * i;
    const ty = stepY * i;
    children.forEach(ch => {
      const c = ch.cloneNode(true);
      c.setAttribute('fill', opts.shadowColor);
      c.setAttribute('stroke', opts.shadowColor);
      c.setAttribute('stroke-width', SHADOW_GROW_PX.toFixed(3));
      c.setAttribute('stroke-linejoin', 'round');
      c.setAttribute('stroke-linecap', 'round');
      c.setAttribute(
        'transform',
        (c.getAttribute('transform') || '') + ` translate(${tx.toFixed(3)},${ty.toFixed(3)})`
      );
      shadowPieces.push(serializer.serializeToString(c));
    });
  }

  // base viewBox
  let vbX = 0, vbY = 0, vbW = 1000, vbH = 500;
  if (viewBoxAttr) {
    const vbParts = viewBoxAttr.split(/[\s,]+/).map(Number);
    if (vbParts.length === 4) {
      vbX = vbParts[0];
      vbY = vbParts[1];
      vbW = vbParts[2];
      vbH = vbParts[3];
    }
  }

  // artboard just big enough
  const dx = stepX * opts.steps;
  const dy = stepY * opts.steps;
  const pad = opts.outlinePx + 10;
  const minX = Math.min(vbX, vbX + dx) - pad;
  const minY = Math.min(vbY, vbY + dy) - pad;
  const maxX = Math.max(vbX + vbW, vbX + vbW + dx) + pad;
  const maxY = Math.max(vbY + vbH, vbY + vbH + dy) + pad;
  const fittedVbW = maxX - minX;
  const fittedVbH = maxY - minY;

  // mask with corner style
  const expandedLetters = children.map(ch => {
    const c = ch.cloneNode(true);
    c.setAttribute('fill', 'black');
    c.setAttribute('stroke', 'black');

    let strokeW = (opts.outlinePx * 2);

    if (opts.cornerStyle === 'round') {
      strokeW += (opts.roundRadiusPx * 2);
      c.setAttribute('stroke-linejoin', 'round');
      c.setAttribute('stroke-linecap', 'round');
    } else {
      c.setAttribute('stroke-linejoin', 'miter');
      c.setAttribute('stroke-linecap', 'butt');
      c.setAttribute('stroke-miterlimit', '10');
    }

    c.setAttribute('stroke-width', strokeW.toFixed(3));
    return serializer.serializeToString(c);
  }).join('\n');

  const maskId = 'shadowCutMask';
  const maskStr = `
    <mask id="${maskId}" maskUnits="userSpaceOnUse">
      <rect x="${minX}" y="${minY}" width="${fittedVbW}" height="${fittedVbH}" fill="white" />
      <g>${expandedLetters}</g>
    </mask>
  `;

  const originals = children.map(ch => serializer.serializeToString(ch)).join('\n');

  return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${widthAttr}" height="${heightAttr}"
     viewBox="${minX} ${minY} ${fittedVbW} ${fittedVbH}">
  <defs>${maskStr}</defs>
  <g mask="url(#${maskId})">
    ${shadowPieces.join('\n')}
  </g>
  ${originals}
</svg>`;
}
