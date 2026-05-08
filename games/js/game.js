const gridEl    = document.getElementById('grid');
const scoreEl   = document.getElementById('score');
const movesEl   = document.getElementById('moves');
const bestEl    = document.getElementById('best');
const msgEl     = document.getElementById('msg');
const histEl    = document.getElementById('history');
const overlay   = document.getElementById('overlay');
const btnUndo   = document.getElementById('btn-undo');
const rangeNote = document.getElementById('range-note');

let SIZE, MAX_VAL, cells, pos, score, moves, visited, gameActive, phase, snapHistory, best = 0;

const DIRS = { up: [-1,0], down: [1,0], left: [0,-1], right: [0,1] };

function getSZ()    { return parseInt(document.getElementById('sizesel').value); }
function getLevel() { return document.getElementById('levelsel').value; }

function getMaxVal(sz) {
  const cap = sz - 1;
  const lv  = getLevel();
  if (lv === 'low')  return Math.max(1, Math.floor(cap * 0.4));
  if (lv === 'mid')  return Math.max(1, Math.floor(cap * 0.7));
  return cap;
}

function rowOf(i)   { return Math.floor(i / SIZE); }
function colOf(i)   { return i % SIZE; }
function idxOf(r,c) {
  if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return -1;
  return r * SIZE + c;
}

/* The number of steps is determined by the FIRST cell entered in that direction.
   If that first cell is off the grid or already visited, it's an immediate violation.
   Otherwise walk that many steps total from the current position, collecting as we go. */
function fullTravel(fromIdx, dir) {
  const [dr, dc] = DIRS[dir];
  const r = rowOf(fromIdx), c = colOf(fromIdx);

  // Peek at the first cell in this direction — its value sets the step count
  const firstIdx = idxOf(r + dr, c + dc);

  if (firstIdx === -1) {
    // No cell in this direction — instant off-grid violation, 0 points
    return { path: [], steps: 0, violation: true };
  }

  if (visited[firstIdx]) {
    // First cell already traversed — collect its value then end
    return { path: [firstIdx], steps: cells[firstIdx], violation: true };
  }

  // First cell is valid — its value dictates how many steps we travel
  const steps = cells[firstIdx];
  const path  = [];
  let violation = false;

  for (let s = 1; s <= steps; s++) {
    const ni = idxOf(r + dr*s, c + dc*s);
    if (ni === -1)    { violation = true; break; }
    if (visited[ni])  { violation = true; path.push(ni); break; }
    path.push(ni);
  }

  return { path, steps, violation };
}

function initGame() {
  SIZE    = getSZ();
  MAX_VAL = getMaxVal(SIZE);
  cells   = [];
  snapHistory = [];
  score = 0; moves = 0; gameActive = false; phase = 'pick';

  scoreEl.textContent = 0;
  movesEl.textContent = 0;
  bestEl.textContent  = best;
  msgEl.textContent   = 'Pick any cell to start!';
  msgEl.className     = '';
  histEl.textContent  = '';
  overlay.classList.remove('visible');
  dpadEnable(false);

  rangeNote.textContent = `Tiles: 1–${MAX_VAL}  ·  grid ${SIZE}×${SIZE}  ·  max jump ${SIZE-1}`;

  const cs  = SIZE >= 15 ? 26 : SIZE >= 12 ? 32 : SIZE >= 10 ? 36 : SIZE >= 8 ? 44 : SIZE >= 6 ? 54 : 62;
  const fs  = SIZE >= 15 ? 10 : SIZE >= 12 ? 11 : SIZE >= 10 ? 13 : SIZE >= 8 ? 15 : SIZE >= 6 ? 17 : 20;
  const gap = SIZE >= 12 ? 2  : SIZE >= 8  ? 3  : 5;

  gridEl.style.gridTemplateColumns = `repeat(${SIZE}, ${cs}px)`;
  gridEl.style.gap = gap + 'px';
  gridEl.innerHTML = '';

  for (let i = 0; i < SIZE * SIZE; i++) {
    cells.push(Math.floor(Math.random() * MAX_VAL) + 1);
    const d = document.createElement('div');
    d.className   = 'cell pickable';
    d.dataset.idx = i;
    d.style.cssText = `width:${cs}px;height:${cs}px;font-size:${fs}px`;
    d.textContent = cells[i];
    d.addEventListener('click', onCellClick);
    gridEl.appendChild(d);
  }

  visited = new Array(SIZE * SIZE).fill(false);
}

function renderGrid(previewDir) {
  const els      = gridEl.querySelectorAll('.cell');
  const goodPrev = new Set();
  const doomPrev = new Set();

  if (previewDir != null && gameActive) {
    const { path, violation } = fullTravel(pos, previewDir);
    if (violation) path.forEach(i => doomPrev.add(i));
    else           path.forEach(i => goodPrev.add(i));
  }

  els.forEach((el, i) => {
    if (i === pos)          { el.className = 'cell current'; return; }
    if (visited[i])         { el.className = 'cell visited'; return; }
    if (doomPrev.has(i))    { el.className = 'cell doom';    return; }
    if (goodPrev.has(i))    { el.className = 'cell preview'; return; }
    el.className = 'cell';
  });
}

function doMove(dir) {
  if (!gameActive) return;

  snapHistory.push({ pos, score, moves, visited: visited.slice() });

  const { path, steps, violation } = fullTravel(pos, dir);

  let gained = 0;
  path.forEach(ni => {
    gained += cells[ni];
    if (!visited[ni]) visited[ni] = true;
  });

  if (path.length > 0) pos = path[path.length - 1];
  score += gained;
  moves++;

  scoreEl.textContent = score;
  movesEl.textContent = moves;
  if (score > best) { best = score; bestEl.textContent = best; }

  addHist(`Move ${moves}: ${dir} ×${steps} +${gained}${violation ? ' ⚠' : ''}`);
  btnUndo.disabled = false;

  if (violation) {
    msgEl.textContent = `+${gained} pts — game over! Went past edge or revisited cell`;
    msgEl.className   = 'bad';
    renderGrid();
    endGame();
  } else {
    msgEl.textContent = `+${gained} pts — (${rowOf(pos)+1},${colOf(pos)+1}) · next value ${cells[pos]}`;
    msgEl.className   = 'good';
    renderGrid();
  }
}

function onCellClick(e) {
  if (phase !== 'pick') return;
  const i = parseInt(e.currentTarget.dataset.idx);
  if (visited[i]) return;

  phase = 'play';
  pos   = i;
  visited[i] = true;
  score = cells[i];
  scoreEl.textContent = score;
  if (score > best) { best = score; bestEl.textContent = best; }

  gameActive  = true;
  snapHistory = [];
  btnUndo.disabled = true;

  msgEl.textContent = `Started at (${rowOf(pos)+1},${colOf(pos)+1}) · value ${cells[pos]}`;
  msgEl.className   = 'good';
  dpadEnable(true);
  renderGrid();
}

function endGame() {
  gameActive = false;
  dpadEnable(false);

  document.getElementById('ov-score').textContent = score;
  document.getElementById('ov-sub').textContent   = `${moves} move${moves === 1 ? '' : 's'} · ${SIZE}×${SIZE} grid`;
  const ovBest = document.getElementById('ov-best');
  ovBest.style.display = (score >= best && moves > 0) ? '' : 'none';
  overlay.classList.add('visible');
}

function dpadEnable(on) {
  Object.keys(DIRS).forEach(d => {
    document.getElementById('btn-' + d).disabled = !on;
  });
}

function addHist(txt) {
  const sp = document.createElement('span');
  sp.textContent = txt + '  ';
  histEl.appendChild(sp);
  histEl.scrollTop = histEl.scrollHeight;
}

/* ── D-pad events ── */
Object.keys(DIRS).forEach(d => {
  const btn = document.getElementById('btn-' + d);
  btn.addEventListener('click',      () => doMove(d));
  btn.addEventListener('mouseenter', () => { if (gameActive) renderGrid(d); });
  btn.addEventListener('mouseleave', () => { if (gameActive) renderGrid(); });
});

/* ── Keyboard ── */
document.addEventListener('keydown', e => {
  const m = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right' };
  if (m[e.key]) { e.preventDefault(); doMove(m[e.key]); }
});

document.getElementById('btn-new').addEventListener('click', initGame);
document.getElementById('ov-play').addEventListener('click', initGame);

document.getElementById('btn-undo').addEventListener('click', () => {
  if (!snapHistory.length) return;
  const s    = snapHistory.pop();
  pos        = s.pos;
  score      = s.score;
  moves      = s.moves;
  visited    = s.visited;
  scoreEl.textContent = score;
  movesEl.textContent = moves;
  msgEl.textContent   = 'Move undone.';
  msgEl.className     = '';
  btnUndo.disabled    = snapHistory.length === 0;
  overlay.classList.remove('visible');
  gameActive = true;
  phase      = 'play';
  dpadEnable(true);
  renderGrid();
});

/* ── Config change ── */
['sizesel', 'levelsel'].forEach(id =>
  document.getElementById(id).addEventListener('change', initGame)
);

initGame();
