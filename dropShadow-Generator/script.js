const INCH_TO_PX = 96;
const el = id => document.getElementById(id);

const svgInput = el('svgInput');
const fileInput = el('fileInput');
const stepsInput = el('steps');
const stepInput = el('step');
const outlineInput = el('outline');
const shadowColorInput = el('shadowColor');
const applyBtn = el('applyBtn');
const downloadBtn = el('downloadBtn');
const previewWrap = el('previewWrap');

const angleDial = el('angleDial');
const dialKnob = el('dialKnob');
const angleDisplay = el('angleDisplay');

// dial angle: 0 = top, clockwise
let currentDialAngle = 225;
let lastOutputSVG = '';

// snapping config
const SNAP_STEP = 5; // snap every 5°
const IMPORTANT_ANGLES = [45, 135, 225, 315]; // diagonals
const IMPORTANT_THRESHOLD = 6; // degrees around those where we force-snap

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => svgInput.value = ev.target.result;
  reader.readAsText(file);
});

/* ====== DIAL LOGIC ====== */
function snapAngle(deg) {
  // first: try to snap to important angles if close enough
  for (const imp of IMPORTANT_ANGLES) {
    if (Math.abs(deg - imp) <= IMPORTANT_THRESHOLD) {
      return imp;
    }
  }
  // else: snap to nearest 5°
  return Math.round(deg / SNAP_STEP) * SNAP_STEP;
}

function setDialAngle(deg) {
  // normalize 0–360
  deg = ((deg % 360) + 360) % 360;
  // snap
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

  // atan2 gives 0° at +x; we want 0° at top
  let rad = Math.atan2(y, x);
  let deg = rad * 180 / Math.PI;
  deg = deg + 90; // rotate so 0 is at top
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

// init
setDialAngle(currentDialAngle);

/* ====== MAIN ACTION ====== */
applyBtn.addEventListener('click', () => {
  if (!svgInput.value.trim()) {
    alert('Paste or load an SVG first.');
    return;
  }

  // convert dial (0 top, cw) -> svg (0 right, cw)
  const svgAngle = currentDialAngle - 90;

  const opts = {
    angle: svgAngle,
    steps: parseInt(stepsInput.value, 10),
    stepPx: parseFloat(stepInput.value) * INCH_TO_PX,
    outlinePx: parseFloat(outlineInput.value) * INCH_TO_PX,
    shadowColor: shadowColorInput.value
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

/* ====== SVG BUILDER (no blur, auto-fit) ====== */
function makeShadowSVG(svgString, opts) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const srcSvg = doc.documentElement;
  
    let widthAttr = srcSvg.getAttribute('width') || '800';
    let heightAttr = srcSvg.getAttribute('height') || '300';
    let viewBoxAttr = srcSvg.getAttribute('viewBox');
  
    const serializer = new XMLSerializer();
    const children = Array.from(srcSvg.childNodes).filter(n => n.nodeType === 1);
  
    // angle is already in SVG coords (0=right, clockwise)
    const rad = opts.angle * Math.PI / 180;
    const stepX = Math.cos(rad) * opts.stepPx;
    const stepY = Math.sin(rad) * opts.stepPx;
  
    // how much to “grow” shadow shapes outwards (visual correction)
    // 0.4 is a good starting point — you can tweak to 0.3 / 0.5
    const SHADOW_GROW_PX = opts.outlinePx * 0.4;
  
    const shadowPieces = [];
    for (let i = 1; i <= opts.steps; i++) {
      const tx = stepX * i;
      const ty = stepY * i;
      children.forEach(ch => {
        const c = ch.cloneNode(true);
        c.setAttribute('fill', opts.shadowColor);
        // expand just the shadow copies a tiny bit
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
  
    // mask to cut under letters — stays as the original outline-offset version
    const expandedLetters = children.map(ch => {
      const c = ch.cloneNode(true);
      c.setAttribute('fill', 'black');
      c.setAttribute('stroke', 'black');
      c.setAttribute('stroke-width', (opts.outlinePx * 2).toFixed(3));
      c.setAttribute('stroke-linejoin', 'round');
      c.setAttribute('stroke-linecap', 'round');
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
  