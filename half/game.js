/* ============================================================
   OX ALPHA - kleiner Retro-FPS mit Raycasting-Renderer
   Reines HTML5 Canvas + Web Audio, keine externen Assets.
   ============================================================ */
(() => {
'use strict';

/* ================= Konfiguration ================= */
const VIEW_W = 480;
const VIEW_H = 300;
const FOV = Math.PI / 3;
const PLANE_LEN = Math.tan(FOV / 2);

const MOVE_SPEED = 3.1;
const STRAFE_FACTOR = 0.82;
const MOUSE_SENS = 0.0026;
const PITCH_SENS = 1.05;              // Blick-Pixel vertikal pro Maus-Pixel
const MAX_PITCH = VIEW_H * 0.6;       // grozuegige, aber begrenzte Blickwinkel nach oben/unten
const PLAYER_R = 0.22;

const MAG_SIZE = 8;
const FIRE_COOLDOWN = 0.16;
const RELOAD_TIME = 0.9;
const GUN_DAMAGE = 34;
const HEAL_AMOUNT = 35;

/* Gegnertypen */
const ENEMY_TYPES = {
    stalker:  { hp: 55,  speed: 2.3,  r: 0.24, dmg: 9,  attackCd: 1.0, range: 5.5, sight: 10, score: 100, size: 0.62, viewH: 0.8, ranged: true, projSpeed: 6.5, projColor: '#ff7a1a', burst: 1 },
    brute:    { hp: 260, speed: 1.1,  r: 0.4,  dmg: 22, attackCd: 1.3, range: 6.5, sight: 9,  score: 300, size: 1.25, viewH: 0.88, ranged: true, projSpeed: 4.2, projColor: '#39ff5a', burst: 1 },
    sentinel: { hp: 95,  speed: 1.25, r: 0.3,  dmg: 13, attackCd: 1.9, range: 6.5, sight: 10, score: 200, size: 0.95, viewH: 0.7, ranged: true, strafe: true, projSpeed: 5.2, projColor: '#b44cff', burst: 3, burstSpread: 0.2 },
    monster:  { hp: 120, speed: 2.2,  r: 0.3,  dmg: 14, attackCd: 1.2, range: 6.0, sight: 10, score: 250, size: 0.95, viewH: 0.82, ranged: true, projSpeed: 5.5, projColor: '#ff3bd0', burst: 1 }
};

/* ================= Karte ================= */
// Wand-Typen: '#' Standard, 'V' Lueftung, 'H' Warnbereich, 'E' Energie, 'R' Rohre, 'W' Fenster
// '.' frei, 'S' Spielerspawn, 'a' Stalker, 'b' Brute, 'c' Sentinel, 'm' Monster, 'L' Aufzug
const MAP_STR = [
    "########W#######W#######W######",
    "#.........#..........#.........#",
    "#....b....#m....c....#....a....#",
    "#.........#..........#.........#",
    "#.........#..........#.........#",
    "#.........#..........#.........#",
    "####.###H######.######H####.####",
    "#......##..............#.......#",
    "#......##..............#.......#",
    "#......##...RR....RR...#.......#",
    "#.......................###.####",
    "#......##.......c......#...a...#",
    "#......##...RR....RR...#.......#",
    "#......##..............#.......#",
    "#......##......b.......#.......#",
    "###.######H####.####H######.####",
    "#..............m...............#",
    "#....a...................c.....#",
    "######.###V####.########.###V###",
    "#.......##...........##.....a..#",
    "#.......##.....b.....##........#",
    "#...b...##...........#####.#####",
    "#.a.....##.........c.##........#",
    "#.......##...........##.....c..#",
    "#.......##...........##........#",
    "####.#######H##.####R#####.#####",
    "#..............................#",
    "#.......R.......R.......R......#",
    "#..S........a.......c.......a..#",
    "#............................m.#",
    "#..............................#",
    "########W#######W#######W######"
];
const MH = MAP_STR.length;
const MW = MAP_STR[0].length;

const WALL_CHARS = { '#': 1, 'V': 2, 'H': 3, 'E': 4, 'R': 5, 'W': 6 };

const grid = new Uint8Array(MW * MH);
let playerSpawn = { x: 1.5, y: 1.5 };
const enemySpawns = [];
let goal = null;
let elevatorGoal = null;   // Aufzugs-Zielpunkt ('L' auf der Karte), falls das Level einen hat
function parseMap(mapStr) {
    grid.fill(0);
    playerSpawn = { x: 1.5, y: 1.5 };
    enemySpawns.length = 0;
    goal = null;
    elevatorGoal = null;
    const mh = mapStr.length;
    for (let y = 0; y < mh; y++) {
        const row = mapStr[y];
        for (let x = 0; x < MW; x++) {
            const c = row[x];
            if (WALL_CHARS[c]) grid[y * MW + x] = WALL_CHARS[c];
            if (c === 'S') playerSpawn = { x: x + 0.5, y: y + 0.5 };
            if (c === 'a') enemySpawns.push({ x: x + 0.5, y: y + 0.5, type: 'stalker' });
            if (c === 'b') enemySpawns.push({ x: x + 0.5, y: y + 0.5, type: 'brute' });
            if (c === 'c') enemySpawns.push({ x: x + 0.5, y: y + 0.5, type: 'sentinel' });
            if (c === 'm') enemySpawns.push({ x: x + 0.5, y: y + 0.5, type: 'monster' });
            if (c === 'X') goal = { x: x + 0.5, y: y + 0.5 };
            if (c === 'L') elevatorGoal = { x: x + 0.5, y: y + 0.5 };
        }
    }
    if (!goal && !elevatorGoal) goal = { x: playerSpawn.x, y: playerSpawn.y };
}

// Level 1: Original-Layout, Ziel zentral in der Mitte
function withGoal(rows, gx, gy) {
    const a = rows.map(r => r.split(''));
    a[gy][gx] = 'X';
    return a.map(r => r.join(''));
}
const MAP_L1 = withGoal(MAP_STR, 16, 16);

// Level 2: helle, offene Halle (Hangar) mit umlaufenden Fensterbaendern und Nebenraeumen
const MAP_L2 = [
    "################################",
    "#######################WW#WWW###",
    "##........############........##",
    "##........############........##",
    "##...a....############........##",
    "##........############........##",
    "##....W...W###W###W###W.......##",
    "###..........................###",
    "###..........................###",
    "###..........................###",
    "###...a........##........c...###",
    "###......##....##.....##.....###",
    "###......##...........##.....###",
    "###..........................###",
    "###..........................###",
    "###............m.............###",
    "###..........................###",
    "###..........................###",
    "###..........................###",
    "###......##...........##.....###",
    "###...a..##....##.....##.b...###",
    "###............##............###",
    "###..........................###",
    "###..........................###",
    "###.##W##W##W##W##W##W##W.######",
    "#....#################........##",
    "#....#################........##",
    "#....#################....X...##",
    "#....#################........##",
    "#.S..#################........##",
    "#######################WW#WWW###",
    "################################"
];

// Level 3: enger Wartungs-/Technikbereich, endet an einem Aufzug statt am gewohnten Ziel-Portal
const MAP_L3 = [
    "################################",
    "################################",
    "##......##......##.......#######",
    "##......##......##.......#######",
    "##.S.........a.......c...#######",
    "##......##......##.......#######",
    "##......##......##.......#######",
    "####.########.#######.##########",
    "####.########.#######.##########",
    "####.########.#######.##########",
    "##.......###........#.#.......##",
    "##.......###........###.......##",
    "##...a.........b..............##",
    "##.......###........###...c...##",
    "##.......###........###.......##",
    "##.......###........###.......##",
    "#####.##########.######.......##",
    "#####.##########.#########.#####",
    "#####.##########.#########.#####",
    "##........######.#########.#####",
    "##........###.........##......##",
    "##........###.........##......##",
    "##...m....###.........##......##",
    "##........###....b........cL..##",
    "##........###.........##......##",
    "##........###....a....##......##",
    "#############.........##......##",
    "########################......##",
    "################################",
    "################################",
    "################################",
    "################################"
];

// Level 4: Finale - helle Halle mit Fenstern an allen vier Seiten (Ankunft nach dem Aufzug)
const MAP_L4 = [
    "################################",
    "################################",
    "################################",
    "###########W##W##W##W##W##W#####",
    "##########..................####",
    "#########W..................W###",
    "##########......X...........####",
    "##########..a............c..W###",
    "#########W..................####",
    "##########..................W###",
    "##########........m.........####",
    "#########W..................W###",
    "##########..................####",
    "##########..................W###",
    "##......#W.......#..#.......####",
    "##......##..................W###",
    "##..S.......................####",
    "##......#W.......#..#.......W###",
    "##......##..................####",
    "##########..................W###",
    "#########W....c........a....####",
    "##########..................W###",
    "##########..b............a..####",
    "#########W..................W###",
    "##########..................####",
    "##########........b.........W###",
    "#########W..................####",
    "##########..................####",
    "###########W##W##W##W##W##W#####",
    "################################",
    "################################",
    "################################"
];

const LEVELS = [MAP_L1, MAP_L2, MAP_L3, MAP_L4];

parseMap(MAP_L1);

/* Umgebungsobjekte + Schiebetueren (Kollision & optisch) */
let solids = [];     // {x, y, r}  statische Hindernisse
let propList = [];   // {kind, x, y, rot}
let doors = [];      // {cx, cy, x, y, slide, open, openAmt, mesh, panel}

function buildProps() {
    solids.length = 0; propList.length = 0; doors.length = 0;
    const doorCells = new Set();
    for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) {
        if (grid[y * MW + x]) continue;
        const wL = isWall(x - 1, y), wR = isWall(x + 1, y), wU = isWall(x, y - 1), wD = isWall(x, y + 1);
        if ((wL && wR && !wU && !wD) || (wU && wD && !wL && !wR)) {
            const slide = (wL && wR) ? 'x' : 'z';
            doors.push({ cx: x, cy: y, x: x + 0.5, y: y + 0.5, slide: slide, open: false, openAmt: 0, mesh: null, panel: null });
            doorCells.add(x + ',' + y);
        }
    }
    for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) {
        if (grid[y * MW + x]) continue;
        if (doorCells.has(x + ',' + y)) continue;
        const openN = (isWall(x - 1, y) ? 0 : 1) + (isWall(x + 1, y) ? 0 : 1) + (isWall(x, y - 1) ? 0 : 1) + (isWall(x, y + 1) ? 0 : 1);
        if (openN < 3) continue; // nur in Raeumen, nicht in Fluren (Blockade vermeiden)
        const cxw = x + 0.5, cyw = y + 0.5;
        if (Math.hypot(cxw - playerSpawn.x, cyw - playerSpawn.y) < 1.4) continue;
        if (goal && Math.hypot(cxw - goal.x, cyw - goal.y) < 1.3) continue;
        if (elevatorGoal && Math.hypot(cxw - elevatorGoal.x, cyw - elevatorGoal.y) < 1.3) continue;
        let near = false;
        for (const sp of enemySpawns) { if (Math.hypot(cxw - sp.x, cyw - sp.y) < 1.4) { near = true; break; } }
        if (near) continue;
        for (const d of doors) { if (Math.hypot(cxw - d.x, cyw - d.y) < 1.4) { near = true; break; } }
        if (near) continue;
        const r = hash2(x, y);
        if (r < 0.05) { solids.push({ x: x + 0.5, y: y + 0.5, r: 0.34 }); propList.push({ kind: 'crate', x: x + 0.5, y: y + 0.5, rot: r * 6.28 }); }
        else if (r > 0.93) { solids.push({ x: x + 0.5, y: y + 0.5, r: 0.26 }); propList.push({ kind: 'barrel', x: x + 0.5, y: y + 0.5, rot: 0 }); }
        else if (r > 0.86 && r <= 0.89) { solids.push({ x: x + 0.5, y: y + 0.5, r: 0.2 }); propList.push({ kind: 'pipe', x: x + 0.5, y: y + 0.5, rot: (hash2(y, x) - 0.5) }); }
        else if (r > 0.80 && r <= 0.835) { solids.push({ x: x + 0.5, y: y + 0.5, r: 0.4 }); propList.push({ kind: 'terminal', x: x + 0.5, y: y + 0.5, rot: (hash2(y, x) - 0.5) * 1.5 }); }
    }
}
buildProps();

function isWall(cx, cy) {
    if (cx < 0 || cy < 0 || cx >= MW || cy >= MH) return true;
    return grid[cy * MW + cx] !== 0;
}

/* ================= DOM ================= */
const canvas = document.getElementById('game');
const ctx = null; // 2D-Kontext entfernt - Canvas wird nun von Three.js (WebGL) genutzt

const elHud       = document.getElementById('hud');
const elMenu      = document.getElementById('menu');
const elPause     = document.getElementById('pause');
const elDead      = document.getElementById('dead');
const elVictory   = document.getElementById('victory');
const elDmg       = document.getElementById('dmg');
const elHpBar     = document.getElementById('hp-bar');
const elHpNum     = document.getElementById('hp-num');
const elAmmoNum   = document.getElementById('ammo-num');
const elReloadHit = document.getElementById('reload-hint');
const elObjective = document.getElementById('objective');
const elHpBg = document.getElementById('hp-bar-bg');
const elAmmoPips = document.getElementById('ammo-pips');
const elScoreNum = document.getElementById('score-num');
const elHostilesNum = document.getElementById('hostiles-num');

function showOverlay(el) {
    [elMenu, elPause, elDead, elVictory].forEach(o => o.classList.toggle('visible', o === el));
}
function hideOverlays() { showOverlay(null); }

/* ================= Audio (Web Audio API) ================= */
let AC = null, master = null, comp = null, reverb = null, noiseBuf = null;

function rnd(a, b) { return a + Math.random() * (b - a); }

function initAudio() {
    if (AC) return;
    try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
        master = AC.createGain(); master.gain.value = 0.9;
        comp = AC.createDynamicsCompressor();
        comp.threshold.value = -18; comp.knee.value = 20; comp.ratio.value = 3.5;
        comp.attack.value = 0.004; comp.release.value = 0.2;
        master.connect(comp); comp.connect(AC.destination);
        reverb = AC.createConvolver();
        reverb.buffer = makeImpulse(1.4, 3.0);
        const rg = AC.createGain(); rg.gain.value = 0.16; reverb.connect(rg); rg.connect(master);
        const len = Math.floor(AC.sampleRate * 1.5);
        noiseBuf = AC.createBuffer(1, len, AC.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { AC = null; }
    loadPlasmaFile();
    loadAmbientFile();
    loadEnemySfx();
}

/* Optionale echte Plasmaschuss-Datei (Pixabay "Sci-Fi Blaster Shot").
   Faellt auf die synthetisierte laserShot()-Variante zurueck, wenn die
   Datei nicht vorhanden ist. */
let plasmaBuf = null, plasmaTried = false;
let enemyPlasmaBuf = {};
function b64ToBuf(b64) {
    const bin = atob(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
}
function loadEnemySfx() {
    if (!AC || !window.ENEMY_SFX) return;
    for (const t in window.ENEMY_SFX) {
        try {
            AC.decodeAudioData(b64ToBuf(window.ENEMY_SFX[t]))
                .then(b => { enemyPlasmaBuf[t] = b; })
                .catch(() => { enemyPlasmaBuf[t] = null; });
        } catch (e) { enemyPlasmaBuf[t] = null; }
    }
}
function loadPlasmaFile() {
    if (plasmaTried || !AC) return;
    plasmaTried = true;
    const fromEmbed = () => {
        if (window.PLASMA_SFX && window.PLASMA_SFX.b64) {
            try {
                AC.decodeAudioData(b64ToBuf(window.PLASMA_SFX.b64))
                    .then(b => { plasmaBuf = b; })
                    .catch(() => { plasmaBuf = null; });
                return true;
            } catch (e) { /* fall through */ }
        }
        return false;
    };
    if (fromEmbed()) return;
    fetch('sounds/plasma.mp3')
        .then(r => { if (!r.ok) throw new Error('missing'); return r.arrayBuffer(); })
        .then(ab => AC.decodeAudioData(ab))
        .then(b => { plasmaBuf = b; })
        .catch(() => { plasmaBuf = null; });
}

let ambientBuf = null, ambientTried = false;
function loadAmbientFile() {
    if (ambientTried || !AC) return;
    ambientTried = true;
    fetch('sounds/ambient.mp3')
        .then(r => { if (!r.ok) throw new Error('missing'); return r.arrayBuffer(); })
        .then(ab => AC.decodeAudioData(ab))
        .then(b => { ambientBuf = b; })
        .catch(() => { ambientBuf = null; });
}

function makeImpulse(dur, decay) {
    const len = Math.floor(AC.sampleRate * dur);
    const buf = AC.createBuffer(2, len, AC.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
}

function makeBuffer(dur, fill) {
    const len = Math.max(1, Math.floor(AC.sampleRate * dur));
    const buf = AC.createBuffer(1, len, AC.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = fill(i / len, i);
    return buf;
}

function playBuf(buf, gain, dest, when, rate) {
    if (!AC) return null;
    const t = AC.currentTime + (when || 0);
    const src = AC.createBufferSource();
    src.buffer = buf;
    if (rate) src.playbackRate.value = rate;
    const g = AC.createGain();
    g.gain.value = gain;
    src.connect(g); g.connect(dest || master);
    src.start(t); src.stop(t + buf.duration + 0.05);
    return src;
}

function blip(f0, f1, dur, type, vol, dest, when) {
    if (!AC) return;
    const t = AC.currentTime + (when || 0);
    const osc = AC.createOscillator();
    const g = AC.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(dest || master);
    osc.start(t); osc.stop(t + dur + 0.02);
}

function zzz(dur, vol, freq, q, dest) {
    if (!AC || !noiseBuf) return;
    const t = AC.currentTime;
    const src = AC.createBufferSource();
    src.buffer = noiseBuf;
    const filt = AC.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.value = freq; filt.Q.value = q || 0.9;
    const g = AC.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt).connect(g).connect(dest || master);
    src.start(t); src.stop(t + dur + 0.02);
}

function crack(dur, vol, freq, dest) {
    if (!AC || !noiseBuf) return;
    const t = AC.currentTime;
    const src = AC.createBufferSource();
    src.buffer = noiseBuf;
    const filt = AC.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = freq;
    const g = AC.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt).connect(g).connect(dest || master);
    src.start(t); src.stop(t + dur + 0.02);
}

let droneNodes = null;
let droneTimer = null;
let nextAmbientEvent = 0;
function ambientStart() {
    if (!AC || droneNodes) return;
    const nodes = {};
    // tiefer Raum-Drone (braunes Rauschen)
    const rum = AC.createBufferSource(); rum.buffer = noiseBuf; rum.loop = true;
    const rlp = AC.createBiquadFilter(); rlp.type = 'lowpass'; rlp.frequency.value = 90;
    const rg = AC.createGain(); rg.gain.value = 0.08;
    rum.connect(rlp).connect(rg).connect(master);
    // elektrisches Brummen (50/100 Hz)
    const hum = AC.createOscillator(); hum.type = 'sine'; hum.frequency.value = 50;
    const hum2 = AC.createOscillator(); hum2.type = 'sine'; hum2.frequency.value = 100;
    const hg = AC.createGain(); hg.gain.value = 0.025;
    hum.connect(hg).connect(master); hum2.connect(hg).connect(master);
    // Wind/Hall (gefiltertes Rauschen, langsamer LFO)
    const wind = AC.createBufferSource(); wind.buffer = noiseBuf; wind.loop = true;
    const wlp = AC.createBiquadFilter(); wlp.type = 'bandpass'; wlp.frequency.value = 500; wlp.Q.value = 0.6;
    const wg = AC.createGain(); wg.gain.value = 0.03;
    const wlfo = AC.createOscillator(); wlfo.frequency.value = 0.07;
    const wlf = AC.createGain(); wlf.gain.value = 300; wlfo.connect(wlf); wlf.connect(wlp.frequency);
    wind.connect(wlp).connect(wg).connect(master);
    rum.start(); hum.start(); hum2.start(); wind.start(); wlfo.start();
    nodes.rum = rum; nodes.hum = hum; nodes.hum2 = hum2; nodes.wind = wind; nodes.wlfo = wlfo;
    // optionale Hintergrund-Datei (Schleife)
    if (ambientBuf) {
        const a = AC.createBufferSource(); a.buffer = ambientBuf; a.loop = true;
        const ag = AC.createGain(); ag.gain.value = 0.5;
        a.connect(ag).connect(master); a.start();
        nodes.amb = a;
    }
    droneNodes = nodes;
    nextAmbientEvent = 3 + Math.random() * 4;
}

function ambientEvent() {
    if (!AC || !droneNodes) return;
    const t = AC.currentTime;
    const cl = noiseSrc();
    const bp = AC.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.value = 200 + Math.random() * 1400; bp.Q.value = 6;
    const cg = AC.createGain();
    cg.gain.setValueAtTime(0.0001, t);
    cg.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.06, t + 0.01);
    cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.25 + Math.random() * 0.4);
    cl.connect(bp).connect(cg).connect(master);
    cl.start(t); cl.stop(t + 0.8);
}

function updateAmbient(dt) {
    if (!droneNodes) return;
    nextAmbientEvent -= dt;
    if (nextAmbientEvent <= 0) {
        if (Math.random() < 0.6) ambientEvent();
        nextAmbientEvent = 2.5 + Math.random() * 5;
    }
}

function ambientStop() {
    if (!droneNodes) return;
    try {
        droneNodes.rum.stop(); droneNodes.hum.stop(); droneNodes.hum2.stop();
        droneNodes.wind.stop(); droneNodes.wlfo.stop();
        if (droneNodes.amb) droneNodes.amb.stop();
    } catch (e) {}
    droneNodes = null;
}


function noiseSrc() {
    const src = AC.createBufferSource();
    src.buffer = noiseBuf;
    return src;
}

function laserShot(o) {
    if (!AC) return;
    o = o || {};
    const t = AC.currentTime;
    const dur = o.dur || 0.18, q = o.q || 1.4;
    const sweepF0 = o.f0 || 2200, sweepF1 = o.f1 || 500;
    const sweepGain = o.sweepGain || 0.3;
    const bodyF0 = o.body || 160, bodyF1 = o.body1 || 55, bodyGain = o.bodyGain || 0.28;
    // laser sweep (bandpass noise)
    const src = noiseSrc();
    const bp = AC.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = q;
    bp.frequency.setValueAtTime(sweepF0, t);
    bp.frequency.exponentialRampToValueAtTime(Math.max(40, sweepF1), t + dur);
    const g1 = AC.createGain();
    g1.gain.setValueAtTime(0.0001, t);
    g1.gain.exponentialRampToValueAtTime(sweepGain, t + 0.005);
    g1.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.02);
    src.connect(bp).connect(g1);
    g1.connect(master); g1.connect(reverb || master);
    src.start(t); src.stop(t + dur + 0.05);
    // body thump
    const osc = AC.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(bodyF0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, bodyF1), t + dur * 0.7);
    const g2 = AC.createGain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(bodyGain, t + 0.005);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.8 + 0.02);
    osc.connect(g2).connect(master);
    osc.start(t); osc.stop(t + dur + 0.05);
    // sharp transient
    const c = noiseSrc();
    const hp = AC.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 3000;
    const g3 = AC.createGain();
    g3.gain.setValueAtTime(0.22, t);
    g3.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    c.connect(hp).connect(g3).connect(master);
    c.start(t); c.stop(t + 0.05);
    // sub-bass impact (Punch)
    const sub = AC.createOscillator(); sub.type = 'sine';
    sub.frequency.setValueAtTime(130, t); sub.frequency.exponentialRampToValueAtTime(38, t + 0.12);
    const g4 = AC.createGain(); g4.gain.setValueAtTime(0.0001, t);
    g4.gain.exponentialRampToValueAtTime(0.5, t + 0.006); g4.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    sub.connect(g4).connect(master); sub.start(t); sub.stop(t + 0.22);
}

function makeDistCurve(amount) {
    const n = 256, c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = i / n * 2 - 1; c[i] = Math.tanh(x * amount); }
    return c;
}

// Echter Plasma-Waffen-Sound (Resonanz-Sweep + Grit + Sizzle + Punch)
function plasmaShot() {
    if (!AC) return;
    const t = AC.currentTime;
    const out = master;
    // Haupt-Sweep (Saege + Quadrat, runtergezogen) durch resonanten Lowpass
    const o1 = AC.createOscillator(); o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(1300, t);
    o1.frequency.exponentialRampToValueAtTime(165, t + 0.18);
    const o2 = AC.createOscillator(); o2.type = 'square';
    o2.frequency.setValueAtTime(880, t);
    o2.frequency.exponentialRampToValueAtTime(105, t + 0.2);
    const shaper = AC.createWaveShaper(); shaper.curve = makeDistCurve(36);
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 7;
    lp.frequency.setValueAtTime(3400, t);
    lp.frequency.exponentialRampToValueAtTime(480, t + 0.2);
    const g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o1.connect(lp); o2.connect(shaper); shaper.connect(lp);
    lp.connect(g); g.connect(out); g.connect(reverb || out);
    o1.start(t); o2.start(t); o1.stop(t + 0.24); o2.stop(t + 0.24);
    // energetisches Sizzle
    const n = noiseSrc();
    const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 1.1;
    const ng = AC.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.exponentialRampToValueAtTime(0.22, t + 0.005);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    n.connect(bp).connect(ng).connect(out); n.start(t); n.stop(t + 0.16);
    // Sub-Punch
    const sub = AC.createOscillator(); sub.type = 'sine';
    sub.frequency.setValueAtTime(150, t); sub.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const sg = AC.createGain();
    sg.gain.setValueAtTime(0.0001, t);
    sg.gain.exponentialRampToValueAtTime(0.5, t + 0.006);
    sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    sub.connect(sg).connect(out); sub.start(t); sub.stop(t + 0.2);
}

const sfx = {
    footstep() {
        crack(0.045, 0.045 + Math.random() * 0.02, 300 + Math.random() * 180, master);
    },
    doorMove() {
        crack(0.05, 0.09, 650, master);
        zzz(0.18, 0.03, 1400, 2.4, master);
    },
    elevator() {
        if (!AC) return;
        const t = AC.currentTime;
        crack(0.06, 0.14, 500, master);
        const o = AC.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(65, t);
        const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 200;
        const g = AC.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.14, t + 0.35);
        g.gain.setValueAtTime(0.14, Math.max(t + 0.35, t + ELEVATOR_RIDE_TIME - 0.4));
        g.gain.exponentialRampToValueAtTime(0.0001, t + ELEVATOR_RIDE_TIME - 0.05);
        o.connect(lp).connect(g).connect(master);
        o.start(t); o.stop(t + ELEVATOR_RIDE_TIME);
        blip(1300, 1300, 0.16, 'sine', 0.12, master, ELEVATOR_RIDE_TIME - 0.32);
        blip(980, 980, 0.2, 'sine', 0.10, master, ELEVATOR_RIDE_TIME - 0.16);
    },
    shoot()  {
        if (plasmaBuf) {
            const r = 0.95 + Math.random() * 0.12;
            playBuf(plasmaBuf, 1.0, master, 0, r);
            playBuf(plasmaBuf, 0.28, reverb || master, 0, r * 1.015);
        } else {
            plasmaShot();
        }
    },
    empty()  { crack(0.03, 0.12, 1200, master); },
    reload() { crack(0.04, 0.14, 900, master); blip(300, 200, 0.06, 'sine', 0.10, master, RELOAD_TIME - 0.15); },
    hit()    { zzz(0.06, 0.18, 2400, 1.2, master); },
    die()    { blip(160, 50, 0.5, 'sawtooth', 0.26, master); zzz(0.3, 0.18, 400, 0.8, reverb); },
    hurt()   { blip(140, 70, 0.22, 'sawtooth', 0.26, master); },
    eshoot() { laserShot({ f0: 1400, f1: 350, dur: 0.15, q: 2.0, sweepGain: 0.22, body: 120, body1: 50, bodyGain: 0.18 }); },
    enemyShot(type) {
        const buf = enemyPlasmaBuf[type];
        if (buf) {
            const r = 0.9 + Math.random() * 0.16;
            playBuf(buf, 0.95, master, 0, r);
            playBuf(buf, 0.3, reverb || master, 0, r * 1.015);
            return;
        }
        if (type === 'brute') {
            // meaty melee swing + impact thud
            const t = AC.currentTime;
            const n = noiseSrc();
            const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
            bp.frequency.setValueAtTime(300, t);
            bp.frequency.exponentialRampToValueAtTime(2600, t + 0.16);
            const ng = AC.createGain();
            ng.gain.setValueAtTime(0.0001, t);
            ng.gain.exponentialRampToValueAtTime(0.42, t + 0.02);
            ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
            n.connect(bp).connect(ng).connect(master); n.start(t); n.stop(t + 0.22);
            const o = AC.createOscillator(); o.type = 'sine';
            o.frequency.setValueAtTime(140, t + 0.12);
            o.frequency.exponentialRampToValueAtTime(45, t + 0.27);
            const og = AC.createGain();
            og.gain.setValueAtTime(0.0001, t + 0.12);
            og.gain.exponentialRampToValueAtTime(0.5, t + 0.14);
            og.gain.exponentialRampToValueAtTime(0.0001, t + 0.31);
            o.connect(og).connect(master); o.start(t + 0.12); o.stop(t + 0.33);
            return;
        }
        // ranged plasma bolt (stalker / sentinel) - punchy, saturated energy zap (no reverb wash)
        const big = (type === 'sentinel');
        const t = AC.currentTime;
        const dur = big ? 0.22 : 0.16;
        const f0 = big ? 1400 : 1900, f1 = big ? 260 : 360;
        // tonal core through resonant lowpass sweep (electric plasma character)
        const o1 = AC.createOscillator(); o1.type = 'sawtooth';
        o1.frequency.setValueAtTime(f0, t); o1.frequency.exponentialRampToValueAtTime(f1, t + dur);
        const o2 = AC.createOscillator(); o2.type = 'square';
        o2.frequency.setValueAtTime(f0 * 0.5, t); o2.frequency.exponentialRampToValueAtTime(f1 * 0.5, t + dur);
        const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 8;
        lp.frequency.setValueAtTime(3400, t); lp.frequency.exponentialRampToValueAtTime(520, t + dur);
        const g = AC.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(big ? 0.78 : 0.66, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.03);
        o1.connect(lp); o2.connect(lp); lp.connect(g).connect(master);
        o1.start(t); o2.start(t); o1.stop(t + dur + 0.06); o2.stop(t + dur + 0.06);
        // electrical sizzle
        const n = noiseSrc();
        const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3;
        bp.frequency.setValueAtTime(big ? 1200 : 1800, t);
        bp.frequency.exponentialRampToValueAtTime(big ? 320 : 520, t + dur);
        const ng = AC.createGain();
        ng.gain.setValueAtTime(0.0001, t);
        ng.gain.exponentialRampToValueAtTime(big ? 0.45 : 0.36, t + 0.005);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        n.connect(bp).connect(ng).connect(master); n.start(t); n.stop(t + dur + 0.03);
        // saturated sub boom
        const sub = AC.createOscillator(); sub.type = 'sine';
        sub.frequency.setValueAtTime(big ? 180 : 240, t);
        sub.frequency.exponentialRampToValueAtTime(big ? 50 : 75, t + dur * 0.8);
        const sg = AC.createGain();
        sg.gain.setValueAtTime(0.0001, t);
        sg.gain.exponentialRampToValueAtTime(big ? 0.62 : 0.5, t + 0.006);
        sg.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.9 + 0.02);
        sub.connect(sg).connect(master); sub.start(t); sub.stop(t + dur + 0.05);
        // sharp attack transient
        const c = noiseSrc();
        const hp = AC.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3200;
        const cg = AC.createGain();
        cg.gain.setValueAtTime(big ? 0.4 : 0.3, t);
        cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
        c.connect(hp).connect(cg).connect(master); c.start(t); c.stop(t + 0.04);
    },
    boom()   { blip(120, 30, 0.5, 'sawtooth', 0.30, master); crack(0.4, 0.22, 500, reverb); },
    pickup() { blip(600, 1000, 0.18, 'sine', 0.20, master); blip(1000, 1500, 0.18, 'sine', 0.12, reverb, 0.04); },
    enemyScream() { blip(300, 140, 0.3, 'sawtooth', 0.18, reverb); },
    enemyDeath()  { blip(200, 50, 0.4, 'sawtooth', 0.24, master); zzz(0.25, 0.16, 500, 0.8, reverb); }
};

/* ================= Zustand ================= */
let state = 'menu'; // menu | playing | paused | dead | victory
let level = 1;
let elevatorRiding = false, elevatorT = 0;
const ELEVATOR_RIDE_TIME = 2.4;

const player = {
    x: 0, y: 0, a: 0,
    pitch: 0,
    hp: 100,
    ammo: MAG_SIZE,
    reloading: false,
    reloadT: 0,
    fireT: 0,
    firing: false
};

// Effekt-Timer
let recoil = 0, muzzleT = 0, hurtFlash = 0, shakeT = 0, bobPhase = 0, timeAlive = 0;
let footstepDist = 0;
let hitMarkerT = 0;

let enemies = [];
const items = [];
let score = 0;
let totalEnemies = 0;

const projectiles = [];  // {x, y, dx, dy, speed, dmg, age}
const tracers = [];      // {x1, y1, x2, y2, age}
const rings = [];        // {x, y, age, color}

function scatterHealthItems(n) {
    items.length = 0;
    let tries = 0;
    const openN = (cx, cy) => {
        let c = 0;
        for (let yy = cy - 1; yy <= cy + 1; yy++) for (let xx = cx - 1; xx <= cx + 1; xx++) {
            if (xx < 0 || yy < 0 || xx >= MW || yy >= MH) continue;
            if (grid[yy * MW + xx] === 0) c++;
        }
        return c;
    };
    while (items.length < n && tries < 4000) {
        tries++;
        const cx = 2 + Math.floor(Math.random() * (MW - 4));
        const cy = 2 + Math.floor(Math.random() * (MH - 4));
        if (grid[cy * MW + cx] !== 0) continue;
        if (openN(cx, cy) < 7) continue; // nur Raum-Inneres, keine Flure
        const x = cx + 0.5, y = cy + 0.5;
        if (Math.hypot(x - playerSpawn.x, y - playerSpawn.y) < 4) continue;
        if (collides(x, y, 0.25, null)) continue;
        if (items.some(it => Math.hypot(it.x - x, it.y - y) < 4)) continue;
        items.push({ x: x, y: y, taken: false, bob: Math.random() * Math.PI * 2 });
    }
}

let _minimap = null;
function initMinimap() {
    const c = document.getElementById('minimap');
    if (c) _minimap = { canvas: c, ctx: c.getContext('2d') };
}
function drawMinimap() {
    if (!_minimap) return;
    const { canvas, ctx } = _minimap;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const cell = Math.min(W / MW, H / MH);
    const ox = (W - cell * MW) / 2, oy = (H - cell * MH) / 2;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        ctx.fillStyle = grid[y * MW + x] === 0 ? 'rgba(72,64,42,0.42)' : 'rgba(14,10,6,0.92)';
        ctx.fillRect(ox + x * cell, oy + y * cell, Math.ceil(cell), Math.ceil(cell));
    }
    ctx.fillStyle = '#33ff88';
    for (const it of items) {
        if (it.taken) continue;
        ctx.fillRect(ox + it.x * cell - 1.6, oy + it.y * cell - 1.6, 3.2, 3.2);
    }
    ctx.fillStyle = '#ff5e5e';
    for (const e of enemies) {
        if (!e.alive) continue;
        ctx.beginPath(); ctx.arc(ox + e.x * cell, oy + e.y * cell, 2.3, 0, 7); ctx.fill();
    }
    const px = ox + player.x * cell, py = oy + player.y * cell;
    ctx.save(); ctx.translate(px, py); ctx.rotate(player.a);
    ctx.fillStyle = '#fdf0d8';
    ctx.beginPath(); ctx.moveTo(5.5, 0); ctx.lineTo(-3.5, 3.5); ctx.lineTo(-3.5, -3.5); ctx.closePath(); ctx.fill();
    ctx.restore();
}

function resetGame() {
    elevatorRiding = false;
    elevatorT = 0;
    player.x = playerSpawn.x;
    player.y = playerSpawn.y;
    player.a = Math.PI * 0.5;
    player.pitch = 0;
    player.hp = 100;
    player.ammo = MAG_SIZE;
    player.reloading = false;
    player.reloadT = 0;
    player.fireT = 0;
    player.firing = false;

    score = 0;
    projectiles.length = 0;
    tracers.length = 0;
    rings.length = 0;

    const spawned = enemySpawns.map(s => {
        const T = ENEMY_TYPES[s.type];
        return {
            type: s.type,
            x: s.x, y: s.y, r: T.r,
            hp: T.hp, maxHp: T.hp,
            alive: true,
            dying: false,
            dieT: 0,
            flashT: 0,
            hitAnimT: 0,
            atkAnim: 0,
            attackT: 0.6 + Math.random() * 0.8,
            wanderA: Math.random() * Math.PI * 2
        };
    });
    totalEnemies = spawned.length;
    // In-place zuruecksetzen, damit externe Referenzen (Tests) gueltig bleiben
    enemies.length = 0;
    for (const e of spawned) enemies.push(e);

    scatterHealthItems(10);

    recoil = 0; muzzleT = 0; hurtFlash = 0; shakeT = 0; bobPhase = 0; timeAlive = 0;
    hitMarkerT = 0;
    particles.length = 0;
    elDmg.style.opacity = 0;
    updateObjective();
    if (_3d && _glbState !== 'loading') buildEnemyMeshes();
}

function updateObjective() {
    if (state === 'menu' || state === 'dead' || state === 'victory') return;
    const left = enemies.filter(e => e.alive).length;
    elObjective.textContent = left > 0
        ? 'SEKTOR ' + level + ' \u2013 ' + left + ' FEINDE AKTIV'
        : 'SEKTOR ' + level + ' GESAEUBERT \u2013 ERREICHE DEN AUSGANG';
}

function flashMessage(txt) {
    elObjective.textContent = txt;
    setTimeout(updateObjective, 2200);
}

function loadLevel(n) {
    level = n;
    parseMap(LEVELS[n - 1]);
    buildProps();
    if (_3d) buildWorldGroup();
    resetGame();
}

function startElevator() {
    if (elevatorRiding) return;
    elevatorRiding = true;
    elevatorT = ELEVATOR_RIDE_TIME;
    player.firing = false;
    flashMessage('AUFZUG FAEHRT...');
    sfx.elevator();
}

function advanceLevel() {
    if (level < LEVELS.length) {
        const next = level + 1;
        loadLevel(next);
        flashMessage('SEKTOR ' + next + ' BETRETEN');
    } else {
        victory();
    }
}

function victory() {
    state = 'victory';
    ambientStop();
    player.firing = false;
    elHud.style.display = 'none';
    elDmg.style.opacity = 0;
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    showOverlay(elVictory);
}

/* ================= Eingabe ================= */
const keys = Object.create(null);

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    if (e.code === 'KeyR' && state === 'playing') startReload();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

document.addEventListener('mousemove', e => {
    if (document.pointerLockElement === canvas && state === 'playing') {
        // Horizontal: Maus links = Blick links, Maus rechts = Blick rechts
        player.a += e.movementX * MOUSE_SENS;
        if (player.a > Math.PI) player.a -= Math.PI * 2;
        if (player.a < -Math.PI) player.a += Math.PI * 2;

        // Vertikal: Maus hoch = Blick hoch, Maus runter = Blick runter
        // (movementY ist negativ bei Aufwaertsbewegung)
        player.pitch -= e.movementY * PITCH_SENS;
        if (player.pitch > MAX_PITCH) player.pitch = MAX_PITCH;
        if (player.pitch < -MAX_PITCH) player.pitch = -MAX_PITCH;
    }
});

document.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    if (state === 'playing' && document.pointerLockElement === canvas) {
        player.firing = true;
    } else if (state === 'menu' || state === 'paused' || state === 'dead') {
        initAudio();
        if (AC && AC.state === 'suspended') AC.resume();
        startPlay();
    }
});

document.addEventListener('mouseup', e => { if (e.button === 0) player.firing = false; });

document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === canvas;
    if (locked) {
        if (state === 'paused' || state === 'playing') {
            state = 'playing';
            ambientStart();
            hideOverlays();
        }
    } else if (state === 'playing') {
        state = 'paused';
        ambientStop();
        player.firing = false;
        showOverlay(elPause);
    }
});

function startPlay() {
    if (state === 'menu' || state === 'dead' || state === 'victory') loadLevel(1);
    state = 'playing';
    ambientStart();
    hideOverlays();
    elHud.style.display = 'block';
    try {
        const p = canvas.requestPointerLock();
        if (p && p.catch) p.catch(() => {});
    } catch (e) { /* Browser-Cooldown: pointerlockerror folgt */ }
}

// Pointer Lock fehlgeschlagen (z.B. Browser-Cooldoown nach Esc)
document.addEventListener('pointerlockerror', () => {
    if (state === 'playing') {
        state = 'paused';
        player.firing = false;
        showOverlay(elPause);
    }
});

/* ================= Kollision ================= */
function collides(x, y, r, self) {
    const minX = Math.floor(x - r), maxX = Math.floor(x + r);
    const minY = Math.floor(y - r), maxY = Math.floor(y + r);
    for (let cy = minY; cy <= maxY; cy++) {
        for (let cx = minX; cx <= maxX; cx++) {
            if (!isWall(cx, cy)) continue;
            const nx = Math.max(cx, Math.min(x, cx + 1));
            const ny = Math.max(cy, Math.min(y, cy + 1));
            const dx = nx - x, dy = ny - y;
            if (dx * dx + dy * dy < r * r) return true;
        }
    }
    // lebende Gegner sind solide Koerper
    for (const e of enemies) {
        if (!e.alive || e === self) continue;
        const dx = e.x - x, dy = e.y - y;
        const rr = r + e.r;
        if (dx * dx + dy * dy < rr * rr) return true;
    }
    // Umgebungsobjekte (Kisten, Rohre, Terminals ...)
    for (const s of solids) {
        const dx = s.x - x, dy = s.y - y;
        const rr = r + s.r;
        if (dx * dx + dy * dy < rr * rr) return true;
    }
    // geschlossene Schiebetueren
    for (const d of doors) {
        if (d.openAmt >= 0.7) continue;
        if (x > d.x - 0.48 && x < d.x + 0.48 && y > d.y - 0.48 && y < d.y + 0.48) return true;
    }
    return false;
}

/* Strahl gegen Umgebungsobjekte/Tueren (fuer Projektilstopp) */
function castRayProps(dx, dy) {
    let best = Infinity;
    const ox = player.x, oy = player.y;
    for (const s of solids) {
        const fx = ox - s.x, fy = oy - s.y;
        const b = fx * dx + fy * dy;
        const c = fx * fx + fy * fy - s.r * s.r;
        const disc = b * b - c;
        if (disc < 0) continue;
        const t = -b - Math.sqrt(disc);
        if (t > 0 && t < best) best = t;
    }
    for (const d of doors) {
        if (d.openAmt > 0.7) continue;
        const rr = 0.46 * (1 - d.openAmt) + 0.04;
        const fx = ox - d.x, fy = oy - d.y;
        const b = fx * dx + fy * dy;
        const c = fx * fx + fy * fy - rr * rr;
        const disc = b * b - c;
        if (disc < 0) continue;
        const t = -b - Math.sqrt(disc);
        if (t > 0 && t < best) best = t;
    }
    return best;
}

function hasLOS(x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0;
    const d = Math.hypot(dx, dy);
    const steps = Math.ceil(d / 0.12);
    for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const x = x0 + dx * t, y = y0 + dy * t;
        if (isWall(x | 0, y | 0)) return false;
        // geschlossene Schiebetueren blockieren Sicht UND Schuss
        for (let k = 0; k < doors.length; k++) {
            const dr = doors[k];
            if (dr.openAmt < 0.7 && Math.abs(x - dr.x) < 0.5 && Math.abs(y - dr.y) < 0.5) return false;
        }
    }
    return true;
}

/* ================= Raycasting ================= */
const zbuf = new Float32Array(VIEW_W);

function castRay(px, py, rdx, rdy) {
    let mapX = px | 0, mapY = py | 0;
    const ddx = Math.abs(1 / rdx), ddy = Math.abs(1 / rdy);
    let stepX, stepY, sdx, sdy, side = 0;

    if (rdx < 0) { stepX = -1; sdx = (px - mapX) * ddx; } else { stepX = 1; sdx = (mapX + 1 - px) * ddx; }
    if (rdy < 0) { stepY = -1; sdy = (py - mapY) * ddy; } else { stepY = 1; sdy = (mapY + 1 - py) * ddy; }

    let hit = false, guard = 0, type = 1;
    while (!hit && guard++ < 256) {
        if (sdx < sdy) { sdx += ddx; mapX += stepX; side = 0; }
        else           { sdy += ddy; mapY += stepY; side = 1; }
        if (mapX < 0 || mapY < 0 || mapX >= MW || mapY >= MH) break;
        if (grid[mapY * MW + mapX]) { hit = true; type = grid[mapY * MW + mapX]; }
    }

    let dist = side === 0 ? sdx - ddx : sdy - ddy;
    dist = Math.max(dist, 0.01);

    let wallX = side === 0 ? py + dist * rdy : px + dist * rdx;
    wallX -= Math.floor(wallX);

    return { dist, side, wallX, type };
}

/* ================= Prozedurale Wandtexturen (je Typ 2 Varianten, 128px) ================= */
function makeWallTexture(type, alt) {
    const S = 128;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const g = c.getContext('2d');
    const bases = {
        1: alt ? '#3e392c' : '#4a4436',
        2: alt ? '#3c3830' : '#48443a',
        3: alt ? '#463f34' : '#403a30',
        4: alt ? '#332e24' : '#3a352a',
        5: alt ? '#332f26' : '#3a362c'
    };
    g.fillStyle = bases[type];
    g.fillRect(0, 0, S, S);

    // Platten-Relief (4 grosse gefaste Platten)
    g.fillStyle = 'rgba(255,255,255,0.05)';
    g.fillRect(4, 4, 120, 56);
    g.fillStyle = 'rgba(0,0,0,0.2)';
    g.fillRect(4, 68, 120, 56);
    g.fillStyle = 'rgba(0,0,0,0.4)';
    g.fillRect(0, 0, 4, S);
    g.fillRect(62, 0, 4, S);
    g.fillRect(124, 0, 4, S);
    g.fillStyle = 'rgba(0,0,0,0.35)';
    g.fillRect(0, 62, S, 4);

    // Nieten mit Schattenseite
    [[10, 10], [54, 10], [74, 10], [118, 10],
     [10, 52], [118, 52], [10, 76], [118, 76],
     [10, 114], [54, 114], [74, 114], [118, 114]].forEach(([x, y]) => {
        g.fillStyle = 'rgba(220,205,170,0.28)';
        g.fillRect(x, y, 4, 4);
        g.fillStyle = 'rgba(0,0,0,0.3)';
        g.fillRect(x + 3, y + 3, 2, 2);
    });

    if (type === 1) {
        // Standardpaneele: technische Anzeige + Kabelbuendel in der Fuge
        g.fillStyle = '#0c1116';
        g.fillRect(alt ? 84 : 16, 14, 28, 18);
        g.fillStyle = alt ? 'rgba(255,150,60,0.85)' : 'rgba(255,176,46,0.85)';
        g.fillRect(alt ? 88 : 20, 18, 6, 4);
        g.fillRect(alt ? 96 : 28, 18, 10, 2);
        g.fillRect(alt ? 88 : 20, 25, 14, 2);
        g.strokeStyle = '#141a20';
        g.lineWidth = 5;
        g.beginPath();
        g.moveTo(66, 0);
        g.bezierCurveTo(58, 40, 74, 80, 66, 128);
        g.stroke();
        g.strokeStyle = alt ? 'rgba(255,150,60,0.5)' : 'rgba(255,176,46,0.45)';
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(64, 0);
        g.bezierCurveTo(56, 40, 72, 80, 64, 128);
        g.stroke();
        if (alt) {
            // beschaedigte Platte: aufgerissenes Blech, dunkles Inneres
            g.fillStyle = 'rgba(0,0,0,0.55)';
            g.beginPath();
            g.moveTo(90, 84); g.lineTo(112, 92); g.lineTo(104, 108); g.lineTo(84, 100);
            g.closePath(); g.fill();
            g.strokeStyle = 'rgba(0,0,0,0.6)';
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(90, 84); g.lineTo(100, 96); g.lineTo(96, 112);
            g.stroke();
        }
    } else if (type === 2) {
        // Lueftung: Rahmen + Lamellen, Variante B mit Ventilator
        g.strokeStyle = 'rgba(200,185,155,0.3)';
        g.lineWidth = 4;
        g.strokeRect(20, 16, 88, 56);
        g.fillStyle = 'rgba(0,0,0,0.5)';
        for (let i = 0; i < 7; i++) g.fillRect(24, 22 + i * 7, 80, 4);
        if (alt) {
            g.fillStyle = '#10161c';
            g.beginPath(); g.arc(64, 98, 22, 0, Math.PI * 2); g.fill();
            g.strokeStyle = '#39434f';
            g.lineWidth = 3;
            g.beginPath(); g.arc(64, 98, 22, 0, Math.PI * 2); g.stroke();
            for (let i = 0; i < 4; i++) {
                g.save();
                g.translate(64, 98);
                g.rotate(i * Math.PI / 2);
                g.fillStyle = '#4a5a68';
                g.beginPath();
                g.ellipse(0, -11, 5, 11, 0, 0, Math.PI * 2);
                g.fill();
                g.restore();
            }
            g.fillStyle = '#232c36';
            g.beginPath(); g.arc(64, 98, 4, 0, Math.PI * 2); g.fill();
        } else {
            // Status-LEDs unter dem Gitter
            g.fillStyle = 'rgba(255,176,46,0.8)';
            g.fillRect(28, 82, 6, 4);
            g.fillStyle = 'rgba(255,150,60,0.8)';
            g.fillRect(38, 82, 6, 4);
        }
    } else if (type === 3) {
        // Warnbereich: diagonale Streifen + Warndreieck
        const bandY = alt ? 76 : 84;
        for (let i = -4; i < 20; i++) {
            g.fillStyle = i % 2 ? 'rgba(255,190,60,0.6)' : 'rgba(8,8,8,0.7)';
            g.beginPath();
            g.moveTo(i * 16, bandY + 34);
            g.lineTo(i * 16 + 16, bandY + 34);
            g.lineTo(i * 16 - 12, bandY);
            g.lineTo(i * 16 - 28, bandY);
            g.closePath();
            g.fill();
        }
        g.fillStyle = 'rgba(0,0,0,0.45)';
        g.fillRect(0, bandY - 3, S, 3);
        g.fillRect(0, bandY + 34, S, 3);
        g.fillStyle = 'rgba(255,190,60,0.85)';
        g.beginPath();
        g.moveTo(64, 14);
        g.lineTo(80, 42);
        g.lineTo(48, 42);
        g.closePath();
        g.fill();
        g.fillStyle = '#1a1408';
        g.fillRect(62, 23, 4, 10);
        g.fillRect(62, 36, 4, 3);
        if (alt) {
            g.fillStyle = 'rgba(230,215,180,0.5)';
            g.font = 'bold 20px monospace';
            g.fillText('07', 14, 40);
        }
    } else if (type === 4) {
        // Energie-Leitung: heller Kern, Puls-Knoten, Halo auf die Platte
        g.fillStyle = '#232c36';
        g.fillRect(44, 4, 40, 8);
        g.fillRect(44, 116, 40, 8);
        if (alt) {
            g.fillStyle = 'rgba(255,176,46,0.25)';
            g.fillRect(46, 0, 14, S);
            g.fillRect(70, 0, 14, S);
            g.fillStyle = 'rgba(255,176,46,0.9)';
            g.fillRect(50, 0, 6, S);
            g.fillRect(74, 0, 6, S);
            g.fillStyle = '#5c6c50';
            g.beginPath(); g.arc(60, 64, 9, 0, Math.PI * 2); g.fill();
            g.fillStyle = '#2a3327';
            g.beginPath(); g.arc(60, 64, 4, 0, Math.PI * 2); g.fill();
        } else {
            g.fillStyle = 'rgba(255,176,46,0.3)';
            g.fillRect(44, 0, 40, S);
            g.fillStyle = 'rgba(255,176,46,0.95)';
            g.fillRect(58, 0, 12, S);
            g.fillStyle = 'rgba(235,255,250,0.95)';
            for (let i = 0; i < 4; i++) g.fillRect(58, 12 + i * 28, 12, 8);
            g.fillStyle = 'rgba(0,0,0,0.45)';
            g.fillRect(43, 0, 2, S);
            g.fillRect(85, 0, 2, S);
        }
        const gg = g.createRadialGradient(64, 64, 8, 64, 64, 72);
        gg.addColorStop(0, 'rgba(255,176,46,0.18)');
        gg.addColorStop(1, 'rgba(255,176,46,0)');
        g.fillStyle = gg;
        g.fillRect(0, 0, S, S);
    } else {
        // Rohrwand: Leitungen, Halterungen, Ventil, Kabel, Tropfspuren
        const pipe = (y, h, c1, c2) => {
            const pg = g.createLinearGradient(0, y, 0, y + h);
            pg.addColorStop(0, c1);
            pg.addColorStop(0.4, c2);
            pg.addColorStop(1, '#0b1015');
            g.fillStyle = pg;
            g.fillRect(0, y, S, h);
        };
        const pipeV = (x, w, c1, c2) => {
            const pg = g.createLinearGradient(x, 0, x + w, 0);
            pg.addColorStop(0, c1);
            pg.addColorStop(0.4, c2);
            pg.addColorStop(1, '#0b1015');
            g.fillStyle = pg;
            g.fillRect(x, 0, w, S);
        };
        if (alt) {
            pipeV(18, 12, '#4a5a68', '#33414d');
            pipeV(58, 9, '#3d4d44', '#2c3a33');
            pipeV(92, 14, '#50483c', '#3a332b');
            g.strokeStyle = '#141a20';
            g.lineWidth = 8;
            g.beginPath();
            g.moveTo(0, 100);
            g.bezierCurveTo(40, 88, 88, 112, 128, 96);
            g.stroke();
            g.strokeStyle = 'rgba(255,150,60,0.4)';
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(0, 98);
            g.bezierCurveTo(40, 86, 88, 110, 128, 94);
            g.stroke();
            g.fillStyle = '#232c36';
            g.fillRect(12, 0, 6, S);
            g.fillRect(104, 0, 6, S);
        } else {
            pipe(16, 12, '#4a5a68', '#33414d');
            pipe(52, 9, '#3d4d44', '#2c3a33');
            pipe(84, 14, '#50483c', '#3a332b');
            g.fillStyle = '#232c36';
            g.fillRect(0, 12, S, 6);
            g.fillRect(0, 96, S, 6);
        }
        g.fillStyle = '#5c6c50';
        g.beginPath(); g.arc(64, alt ? 40 : 66, 10, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#2a3327';
        g.beginPath(); g.arc(64, alt ? 40 : 66, 4, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(0,0,0,0.3)';
        g.fillRect(alt ? 22 : 30, 0, 3, S);
    }

    // Rauschen und Kratzer
    for (let i = 0; i < 220; i++) {
        g.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.05)';
        g.fillRect((Math.random() * S) | 0, (Math.random() * S) | 0, 1, 1);
    }
    return c;
}
const WALL_SETS = [];
for (let wt = 1; wt <= 5; wt++) {
    WALL_SETS.push([makeWallTexture(wt, false), makeWallTexture(wt, true)]);
}

/* Boden-, Decken- und Lichtdetails (projizierte Quads und Fugen) */
function renderLightPanels(dirX, dirY, planeX, planeY, horizon, flicker) {
    const invDet = 1 / (planeX * dirY - dirX * planeY);
    const pcx = player.x | 0, pcy = player.y | 0;
    const R = 7;
    const cells = [];

    for (let cy = pcy - R; cy <= pcy + R; cy++) {
        for (let cx = pcx - R; cx <= pcx + R; cx++) {
            if (isWall(cx, cy)) continue;
            const pts = [];
            let ok = true, dist = 0;
            for (const [wx, wy] of [[cx, cy], [cx + 1, cy], [cx + 1, cy + 1], [cx, cy + 1]]) {
                const sx = wx - player.x, sy = wy - player.y;
                const tx = invDet * (dirY * sx - dirX * sy);
                const ty = invDet * (-planeY * sx + planeX * sy);
                if (ty < 0.12) { ok = false; break; }
                dist += ty;
                pts.push([(VIEW_W / 2) * (1 + tx / ty), ty]);
            }
            if (ok) cells.push({ pts, d: dist / 4, cx, cy });
        }
    }
    cells.sort((a, b) => b.d - a.d);

    const poly = p => {
        ctx.beginPath();
        ctx.moveTo(p[0][0], p[0][1]);
        for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
        ctx.closePath();
        ctx.fill();
    };
    const inset = (p, f) => {
        const mx = (p[0][0] + p[2][0]) / 2, my = (p[0][1] + p[2][1]) / 2;
        return p.map(([x, y]) => [x + (mx - x) * f, y + (my - y) * f]);
    };
    const floorY = ty => horizon + (VIEW_H * 0.5) / ty;
    const ceilY = ty => horizon - (VIEW_H * 0.5) / ty;

    // Zonen-Materialien: Cyan-Belag, Rost-Belag, Blaugrau-Belag
    const zoneTints = ['70,190,175', '176,142,88', '118,138,190'];

    for (const q of cells) {
        const fog = Math.max(0, 1 - q.d / 9);
        if (fog <= 0.02) continue;
        const [p00, p10, p11, p01] = q.pts;
        const zone = (((q.cx / 6) | 0) + ((q.cy / 6) | 0)) % 3;

        const fp = q.pts.map(([sx, ty]) => [sx, floorY(ty)]);
        const cp = q.pts.map(([sx, ty]) => [sx, ceilY(ty)]);

        // Boden: Zonen-Tint gegen einfarbige Flaechen
        ctx.fillStyle = `rgba(${zoneTints[zone]},${(0.07 * fog).toFixed(3)})`;
        poly(fp);

        // Decke: dunkle Vent- oder helle Panel-Zellen
        const vent = ((q.cx * 3 + q.cy * 7) % 5) === 0;
        ctx.fillStyle = vent
            ? `rgba(0,0,0,${(0.3 * fog).toFixed(3)})`
            : `rgba(160,190,210,${(0.04 * fog).toFixed(3)})`;
        poly(cp);

        // Plattenfugen an Nord- und Westkante (Boden + Decke)
        ctx.strokeStyle = `rgba(0,0,0,${(0.35 * fog).toFixed(3)})`;
        ctx.lineWidth = Math.max(1, (VIEW_H / q.d) * 0.012);
        ctx.beginPath();
        ctx.moveTo(p00[0], floorY(p00[1])); ctx.lineTo(p10[0], floorY(p10[1]));
        ctx.moveTo(p00[0], floorY(p00[1])); ctx.lineTo(p01[0], floorY(p01[1]));
        ctx.moveTo(p00[0], ceilY(p00[1])); ctx.lineTo(p10[0], ceilY(p10[1]));
        ctx.moveTo(p00[0], ceilY(p00[1])); ctx.lineTo(p01[0], ceilY(p01[1]));
        ctx.stroke();

        // Gitterrost-Zellen mit Kreuzstreben
        if (((q.cx * 5 + q.cy * 3) % 7) === 1) {
            ctx.strokeStyle = `rgba(0,0,0,${(0.3 * fog).toFixed(3)})`;
            ctx.lineWidth = Math.max(1, (VIEW_H / q.d) * 0.01);
            const mT = [(p00[0] + p10[0]) / 2, floorY((p00[1] + p10[1]) / 2)];
            const mB = [(p01[0] + p11[0]) / 2, floorY((p01[1] + p11[1]) / 2)];
            const mL = [(p00[0] + p01[0]) / 2, floorY((p00[1] + p01[1]) / 2)];
            const mR = [(p10[0] + p11[0]) / 2, floorY((p10[1] + p11[1]) / 2)];
            ctx.beginPath();
            ctx.moveTo(mT[0], mT[1]); ctx.lineTo(mB[0], mB[1]);
            ctx.moveTo(mL[0], mL[1]); ctx.lineTo(mR[0], mR[1]);
            ctx.stroke();
        }

        // Lichtpaneele: cyan/amber je Zone, Decke warmweiss,
        // individuelle Flicker-Phase, einige defekt
        const h = (q.cx * 5 + q.cy * 3) % 9;
        if (h === 0 || h === 4) {
            const phase = q.cx * 13.7 + q.cy * 7.3;
            let lf = 0.75 + 0.25 * Math.sin(timeAlive * 9 + phase);
            if ((q.cx * 11 + q.cy * 17) % 11 === 0) lf *= 0.15;
            lf *= flicker;
            const col = h === 0
                ? (zone === 1 ? '255,190,90' : '120,255,230')
                : '255,240,200';
            if (h === 0) {
                ctx.fillStyle = `rgba(${col},${(0.16 * fog * lf).toFixed(3)})`;
                poly(inset(fp, 0.25));
            } else {
                ctx.fillStyle = `rgba(${col},${(0.06 * fog * lf).toFixed(3)})`;
                poly(inset(cp, 0.15));
                ctx.fillStyle = `rgba(${col},${(0.3 * fog * lf).toFixed(3)})`;
                poly(inset(cp, 0.32));
            }
        }
    }
}

function renderWorld(dirX, dirY, planeX, planeY) {
    // Horizont verschiebt sich mit der vertikalen Blickrichtung
    const horizon = VIEW_H / 2 + player.pitch;

    // sanftes Flackern der Notbeleuchtung
    const flicker = 0.93 + 0.07 * Math.sin(timeAlive * 11) * Math.sin(timeAlive * 4.7);

    // Decke (dunkler fuer mehr Kontrast)
    const sky = ctx.createLinearGradient(0, 0, 0, Math.max(horizon, 1));
    sky.addColorStop(0, '#03050a');
    sky.addColorStop(1, '#0b111c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIEW_W, horizon);

    // Boden
    const floor = ctx.createLinearGradient(0, horizon, 0, VIEW_H);
    floor.addColorStop(0, '#0c1014');
    floor.addColorStop(0.5, '#161b21');
    floor.addColorStop(1, '#242b33');
    ctx.fillStyle = floor;
    ctx.fillRect(0, horizon, VIEW_W, VIEW_H - horizon);

    renderLightPanels(dirX, dirY, planeX, planeY, horizon, flicker);

    // Waende (DDA, eine Spalte pro Screen-Pixel)
    for (let x = 0; x < VIEW_W; x++) {
        const camX = 2 * x / VIEW_W - 1;
        const rdx = dirX + planeX * camX;
        const rdy = dirY + planeY * camX;
        const ray = castRay(player.x, player.y, rdx, rdy);
        zbuf[x] = ray.dist;

        const lineH = VIEW_H / ray.dist;
        const y0 = (VIEW_H - lineH) / 2 + player.pitch;

        // Textur je Wand-Typ, 2 Varianten pro Typ gegen Wiederholung
        const mapXv = (player.x + rdx * ray.dist) | 0;
        const mapYv = (player.y + rdy * ray.dist) | 0;
        const set = WALL_SETS[(ray.type - 1) % WALL_SETS.length];
        const tex = set[((mapXv * 7 + mapYv * 13) >> 1) & 1];
        const texX = Math.min(tex.width - 1, (ray.wallX * tex.width) | 0);
        ctx.drawImage(tex, texX, 0, 1, tex.height, x, y0, 1, lineH);

        // dichterer Tiefennebel + Seitenbeschattung; Energie-Wand leuchtet selbst
        let fogA = Math.pow(Math.max(0, 1 - ray.dist / 11), 1.55) * flicker;
        let alpha = 1 - Math.min(1, fogA);
        if (ray.side === 1) alpha = Math.min(1, alpha + 0.24);
        if (ray.type === 4) alpha *= 0.35;
        else if (ray.type === 3) alpha *= 0.8;
        ctx.fillStyle = `rgba(3,7,12,${alpha.toFixed(3)})`;
        ctx.fillRect(x, y0, 1, lineH);
    }

    // vertikale Tiefenwirkung: dunkle Deckenzone, abgedunkelter Bodennahbereich
    const aoTop = ctx.createLinearGradient(0, 0, 0, Math.max(horizon, 1));
    aoTop.addColorStop(0, 'rgba(2,4,8,0.55)');
    aoTop.addColorStop(1, 'rgba(2,4,8,0)');
    ctx.fillStyle = aoTop;
    ctx.fillRect(0, 0, VIEW_W, horizon);
    const aoBot = ctx.createLinearGradient(0, VIEW_H, 0, horizon);
    aoBot.addColorStop(0, 'rgba(0,0,0,0.3)');
    aoBot.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aoBot;
    ctx.fillRect(0, horizon, VIEW_W, VIEW_H - horizon);
}

/* ================= Partikel & Effekte ================= */
const particles = [];
const booms = [];        // Explosions-Blitze {x, y, age}
const PARTICLE_COLORS = {
    spark: ['#ffd27d', '#ff9d4d', '#fff1c9'],
    plasma: ['#ffb02e', '#ffe0a0', '#ff7a1a'],
    death: ['#7dfcff', '#ff6b5e', '#ffd27d', '#c0fff5'],
    debris: ['#3a4652', '#242e38', '#4d5b6b']
};

function spawnParticles(x, y, z, n, palette, spd) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = spd * (0.3 + Math.random() * 0.7);
        particles.push({
            kind: 'glow',
            x, y, z,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v,
            vz: Math.random() * spd * 0.8,
            age: 0,
            life: 0.25 + Math.random() * 0.45,
            color: palette[(Math.random() * palette.length) | 0],
            size: 0.6 + Math.random() * 1.4
        });
    }
}

/* gerichtete Funken (Streaks), z.B. entlang der Schussrichtung */
function spawnSparks(x, y, z, dx, dy, n, palette, spd) {
    const base = Math.atan2(dy, dx);
    for (let i = 0; i < n; i++) {
        const a = base + (Math.random() - 0.5) * 1.7;
        const v = spd * (0.4 + Math.random() * 0.9);
        particles.push({
            kind: 'spark',
            x, y, z: z + (Math.random() - 0.5) * 0.15,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v,
            vz: Math.random() * spd * 0.5,
            age: 0,
            life: 0.2 + Math.random() * 0.3,
            color: palette[(Math.random() * palette.length) | 0],
            size: 0.5 + Math.random() * 0.8
        });
    }
}

/* aufsteigender Rauch */
function spawnSmoke(x, y, z, n) {
    for (let i = 0; i < n; i++) {
        particles.push({
            kind: 'smoke',
            x: x + (Math.random() - 0.5) * 0.2,
            y: y + (Math.random() - 0.5) * 0.2,
            z,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            vz: 0.25 + Math.random() * 0.3,
            age: 0,
            life: 0.7 + Math.random() * 0.6,
            color: 'smoke',
            size: 0.5 + Math.random() * 0.5
        });
    }
}

/* Truemmerstuecke mit Abprall */
function spawnDebris(x, y, z, n) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 1 + Math.random() * 1.8;
        particles.push({
            kind: 'debris',
            x, y, z,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v,
            vz: 1 + Math.random() * 1.6,
            age: 0,
            life: 0.6 + Math.random() * 0.5,
            color: PARTICLE_COLORS.debris[(Math.random() * 3) | 0],
            size: 0.8 + Math.random() * 1
        });
    }
}

/* Patronenhuelse seitlich auswerfen */
function spawnShell() {
    const pa = player.a + Math.PI / 2;
    particles.push({
        kind: 'shell',
        x: player.x + Math.cos(player.a) * 0.3,
        y: player.y + Math.sin(player.a) * 0.3,
        z: 0.45,
        vx: Math.cos(pa) * 1.6 + (Math.random() - 0.5) * 0.4,
        vy: Math.sin(pa) * 1.6 + (Math.random() - 0.5) * 0.4,
        vz: 1.2 + Math.random() * 0.5,
        age: 0,
        life: 0.9,
        color: '#d8b04a',
        size: 1
    });
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.kind === 'smoke') {
            p.vx *= 0.98; p.vy *= 0.98;
            p.z += p.vz * dt;
            continue;
        }
        p.vz -= 3.2 * dt;
        p.z += p.vz * dt;
        if (p.z < 0.02) {
            p.z = 0.02;
            if (p.kind === 'debris' || p.kind === 'shell') p.vz *= -0.4;
            else p.vz = 0;
            p.vx *= 0.6; p.vy *= 0.6;
        }
    }
}

function renderParticles(dirX, dirY, planeX, planeY) {
    const invDet = 1 / (planeX * dirY - dirX * planeY);
    const horizon = VIEW_H / 2 + player.pitch;

    const proj = (wx, wy) => {
        const sx = wx - player.x, sy = wy - player.y;
        const tx = invDet * (dirY * sx - dirX * sy);
        const ty = invDet * (-planeY * sx + planeX * sy);
        return { tx, ty };
    };

    for (const p of particles) {
        const o = proj(p.x, p.y);
        if (o.ty < 0.15) continue;
        const col = ((VIEW_W / 2) * (1 + o.tx / o.ty)) | 0;
        if (col < 0 || col >= VIEW_W || o.ty >= zbuf[col]) continue;
        const screenY = horizon + (VIEW_H * 0.5) / o.ty * (1 - 2 * p.z);
        const lifeT = p.age / p.life;

        if (p.kind === 'smoke') {
            // weicher, wachsender Rauch
            ctx.globalCompositeOperation = 'source-over';
            const s = Math.max(2, (VIEW_H / o.ty) * 0.05 * p.size * (1 + p.age * 2.5));
            ctx.globalAlpha = (1 - lifeT) * 0.22;
            ctx.fillStyle = '#5a636b';
            ctx.beginPath();
            ctx.arc(col, screenY, s, 0, Math.PI * 2);
            ctx.fill();
            continue;
        }

        // leuchtende Effekte additiv
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.max(0, 1 - lifeT);

        if (p.kind === 'spark') {
            // Streak entlang der Bewegungsrichtung
            const back = proj(p.x - p.vx * 0.04, p.y - p.vy * 0.04);
            const bx = (VIEW_W / 2) * (1 + back.tx / o.ty);
            const by = horizon + (VIEW_H * 0.5) / o.ty * (1 - 2 * p.z);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = Math.max(1, (VIEW_H / o.ty) * 0.012 * p.size);
            ctx.beginPath();
            ctx.moveTo(col, screenY);
            ctx.lineTo(bx, by);
            ctx.stroke();
        } else if (p.kind === 'shell') {
            ctx.globalCompositeOperation = 'source-over';
            const s = Math.max(1, (VIEW_H / o.ty) * 0.014);
            ctx.fillStyle = p.color;
            ctx.fillRect(col - s, screenY - s / 2, s * 2, s);
        } else if (p.kind === 'debris') {
            ctx.globalCompositeOperation = 'source-over';
            const s = Math.max(1, (VIEW_H / o.ty) * 0.016 * p.size);
            ctx.fillStyle = p.color;
            ctx.fillRect(col - s / 2, screenY - s / 2, s, s);
        } else {
            // Glow-Partikel
            const s = Math.max(1.5, (VIEW_H / o.ty) * 0.02 * p.size);
            ctx.fillStyle = p.color;
            ctx.fillRect(col - s / 2, screenY - s / 2, s, s);
            if (s > 3) {
                ctx.globalAlpha = Math.max(0, (1 - lifeT) * 0.35);
                ctx.beginPath();
                ctx.arc(col, screenY, s, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
}

/* Explosions-Blitz: expandierender additiver Orb */
function renderBooms(dirX, dirY, planeX, planeY, dt) {
    const invDet = 1 / (planeX * dirY - dirX * planeY);
    const horizon = VIEW_H / 2 + player.pitch;
    for (let i = booms.length - 1; i >= 0; i--) {
        const b = booms[i];
        b.age += dt;
        if (b.age > 0.25) { booms.splice(i, 1); continue; }
        const t = b.age / 0.25;
        const sx = b.x - player.x, sy = b.y - player.y;
        const tx = invDet * (dirY * sx - dirX * sy);
        const ty = invDet * (-planeY * sx + planeX * sy);
        if (ty < 0.15) continue;
        const col = ((VIEW_W / 2) * (1 + tx / ty)) | 0;
        if (col < 0 || col >= VIEW_W || ty >= zbuf[col]) continue;
        const screenY = horizon + (VIEW_H * 0.5) / ty * 0.6;
        const rad = (0.15 + t * 1.1) * VIEW_H / ty * 0.5;
        const g = ctx.createRadialGradient(col, screenY, 1, col, screenY, rad);
        g.addColorStop(0, `rgba(255,255,255,${(0.85 * (1 - t)).toFixed(2)})`);
        g.addColorStop(0.4, `rgba(125,252,255,${(0.5 * (1 - t)).toFixed(2)})`);
        g.addColorStop(1, 'rgba(125,252,255,0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(col, screenY, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
}

/* Schwebender Staub fuer Atmosphaere */
const dust = [];
for (let i = 0; i < 45; i++) {
    dust.push({
        x: Math.random() * 8 - 4,
        y: Math.random() * 8 - 4,
        z: 0.15 + Math.random() * 0.6,
        ph: Math.random() * 6.28
    });
}

function renderDust(dirX, dirY, planeX, planeY, dt) {
    const invDet = 1 / (planeX * dirY - dirX * planeY);
    const horizon = VIEW_H / 2 + player.pitch;
    ctx.fillStyle = 'rgba(170,230,220,0.35)';
    for (const d of dust) {
        d.x += Math.sin(timeAlive * 0.6 + d.ph) * 0.05 * dt;
        d.y += Math.cos(timeAlive * 0.5 + d.ph) * 0.05 * dt;
        d.z += Math.sin(timeAlive * 0.8 + d.ph) * 0.02 * dt;
        if (d.x > 4) d.x -= 8; if (d.x < -4) d.x += 8;
        if (d.y > 4) d.y -= 8; if (d.y < -4) d.y += 8;
        const sx = d.x, sy = d.y;
        const tx = invDet * (dirY * sx - dirX * sy);
        const ty = invDet * (-planeY * sx + planeX * sy);
        if (ty < 0.2) continue;
        const col = ((VIEW_W / 2) * (1 + tx / ty)) | 0;
        if (col < 0 || col >= VIEW_W || ty >= zbuf[col]) continue;
        const screenY = horizon + (VIEW_H * 0.5) / ty * (1 - 2 * d.z);
        const s = Math.max(1, (VIEW_H / ty) * 0.008);
        ctx.globalAlpha = 0.12 + 0.1 * Math.sin(timeAlive * 2 + d.ph);
        ctx.fillRect(col, screenY, s, s);
    }
    ctx.globalAlpha = 1;
}

/* Gegner-Projektile: leuchtende Plasmakugel mit Halo */
function renderProjectiles(dirX, dirY, planeX, planeY) {
    const invDet = 1 / (planeX * dirY - dirX * planeY);
    const horizon = VIEW_H / 2 + player.pitch;
    for (const p of projectiles) {
        const sx = p.x - player.x, sy = p.y - player.y;
        const tx = invDet * (dirY * sx - dirX * sy);
        const ty = invDet * (-planeY * sx + planeX * sy);
        if (ty < 0.15) continue;
        const col = ((VIEW_W / 2) * (1 + tx / ty)) | 0;
        if (col < 0 || col >= VIEW_W || ty >= zbuf[col]) continue;
        const screenY = horizon + (VIEW_H * 0.5) / ty * 0.1; // leicht unter Augenhoehe
        const r = Math.max(2, (VIEW_H / ty) * 0.05);
        const g = ctx.createRadialGradient(col, screenY, 1, col, screenY, r * 2.4);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(0.35, 'rgba(84,200,255,0.85)');
        g.addColorStop(1, 'rgba(84,200,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(col, screenY, r * 2.4, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* Spieler-Tracer: kurzer, verblassender Energiestrahl */
function renderTracers(dirX, dirY, planeX, planeY, dt) {
    const invDet = 1 / (planeX * dirY - dirX * planeY);
    const horizon = VIEW_H / 2 + player.pitch;
    for (let i = tracers.length - 1; i >= 0; i--) {
        const t = tracers[i];
        t.age += dt;
        if (t.age > 0.09) { tracers.splice(i, 1); continue; }
        const a = 1 - t.age / 0.09;

        const proj = (wx, wy) => {
            const sx = wx - player.x, sy = wy - player.y;
            const tx = invDet * (dirY * sx - dirX * sy);
            const ty = invDet * (-planeY * sx + planeX * sy);
            return { tx, ty };
        };
        const p1 = proj(t.x1, t.y1), p2 = proj(t.x2, t.y2);
        if (p1.ty < 0.1 || p2.ty < 0.1) continue;
        const x1 = (VIEW_W / 2) * (1 + p1.tx / p1.ty);
        const x2 = (VIEW_W / 2) * (1 + p2.tx / p2.ty);
        const y1 = horizon + (VIEW_H * 0.5) / p1.ty * 0.1;
        const y2 = horizon + (VIEW_H * 0.5) / p2.ty * 0.1;

        ctx.strokeStyle = `rgba(255,214,140,${(0.75 * a).toFixed(2)})`;
        ctx.lineWidth = 2.5 * a + 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,176,46,${(0.35 * a).toFixed(2)})`;
        ctx.lineWidth = 6 * a + 1;
        ctx.stroke();
    }
}

/* Todes-/Treffer-Ringe: expandierende Energie-Welle am Boden */
function renderRings(dirX, dirY, planeX, planeY, dt) {
    const invDet = 1 / (planeX * dirY - dirX * planeY);
    const horizon = VIEW_H / 2 + player.pitch;
    for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.age += dt;
        const lifeR = r.life || 0.5;
        const maxR = r.maxR || 1.5;
        if (r.age > lifeR) { rings.splice(i, 1); continue; }
        const t = r.age / lifeR;
        const sx = r.x - player.x, sy = r.y - player.y;
        const tx = invDet * (dirY * sx - dirX * sy);
        const ty = invDet * (-planeY * sx + planeX * sy);
        if (ty < 0.15) continue;
        const col = ((VIEW_W / 2) * (1 + tx / ty)) | 0;
        if (col < 0 || col >= VIEW_W || ty >= zbuf[col]) continue;
        const screenY = horizon + (VIEW_H * 0.5) / ty;
        const rad = (0.15 + t * maxR) * VIEW_H / ty;
        ctx.strokeStyle = `rgba(${r.color},${(0.8 * (1 - t)).toFixed(2)})`;
        ctx.lineWidth = Math.max(1, 3 * (1 - t) * VIEW_H / ty * 0.02 + 1);
        ctx.beginPath();
        ctx.ellipse(col, screenY, rad, rad * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
}

/* ================= Gegner-Sprites (prozedural, 3 Typen, 128px, Multi-Layer) ================= */
const SPRITE_SIZE = 128;

/* weiches Leucht-Element */
function glowAt(g, x, y, r, rgb) {
    const eg = g.createRadialGradient(x, y, 1, x, y, r);
    eg.addColorStop(0, 'rgba(255,255,255,0.95)');
    eg.addColorStop(0.3, `rgba(${rgb},0.9)`);
    eg.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = eg;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
}

/* Metall-Verlauf */
function metalGrad(g, x0, y0, x1, y1, hi, mid, lo) {
    const mg = g.createLinearGradient(x0, y0, x1, y1);
    mg.addColorStop(0, hi);
    mg.addColorStop(0.45, mid);
    mg.addColorStop(1, lo);
    return mg;
}

/* Gebrauchsspuren */
function scratches(g, n, w, h) {
    for (let i = 0; i < n; i++) {
        g.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.06)';
        g.fillRect((Math.random() * w) | 0, (Math.random() * h) | 0, 1 + ((Math.random() * 3) | 0), 1);
    }
}

function makeEnemySprite(type, frame) {
    const S = SPRITE_SIZE;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const g = c.getContext('2d');
    const t = frame ? 1 : -1;

    if (type === 'stalker') {
        /* Schneller Laeufer: dunkle Keil-Silhouette, Klingenarme, rote Glutaugen */
        const spread = frame ? 4 : -4;

        // Ebene 1: Hinterbeine (zweigelenkig, dunkel)
        g.strokeStyle = '#0b0e13';
        g.lineWidth = 5;
        g.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
            const lx = 34 + i * 20 + (i % 2 ? spread : -spread);
            g.beginPath();
            g.moveTo(lx, 78);
            g.lineTo(lx - 10, 100);
            g.lineTo(lx - 4, 122);
            g.stroke();
            g.fillStyle = '#39434f';
            g.beginPath();
            g.moveTo(lx - 8, 122); g.lineTo(lx - 1, 126); g.lineTo(lx + 3, 119);
            g.closePath(); g.fill();
            g.strokeStyle = '#0b0e13';
        }

        // Ebene 2: Klingenarme mit helleschneide
        g.fillStyle = metalGrad(g, 0, 55, 0, 90, '#4d5b6b', '#2c3641', '#12171d');
        g.beginPath();
        g.moveTo(30, 72); g.lineTo(4, 44 + t); g.lineTo(14, 66); g.lineTo(26, 82);
        g.closePath(); g.fill();
        g.beginPath();
        g.moveTo(98, 72); g.lineTo(124, 44 + t); g.lineTo(114, 66); g.lineTo(102, 82);
        g.closePath(); g.fill();
        g.strokeStyle = 'rgba(200,230,240,0.5)';
        g.lineWidth = 2;
        g.beginPath(); g.moveTo(6, 46 + t); g.lineTo(16, 64); g.stroke();
        g.beginPath(); g.moveTo(122, 46 + t); g.lineTo(112, 64); g.stroke();

        // Ebene 3: Unterleib
        g.fillStyle = '#10151b';
        g.beginPath();
        g.ellipse(64, 84, 30, 20, 0, 0, Math.PI * 2);
        g.fill();

        // Ebene 4: Torso-Carapax mit Panzersementen
        g.fillStyle = metalGrad(g, 0, 30, 0, 92, '#39434f', '#20262e', '#0d1116');
        g.beginPath();
        g.moveTo(64, 34);
        g.lineTo(96, 66);
        g.lineTo(84, 92);
        g.lineTo(44, 92);
        g.lineTo(32, 66);
        g.closePath();
        g.fill();
        g.strokeStyle = 'rgba(0,0,0,0.5)';
        g.lineWidth = 2;
        g.beginPath(); g.moveTo(44, 92); g.lineTo(52, 60); g.stroke();
        g.beginPath(); g.moveTo(84, 92); g.lineTo(76, 60); g.stroke();
        g.beginPath(); g.moveTo(64, 34); g.lineTo(64, 54); g.stroke();

        // Carapax-Randlicht (Tiefenwirkung)
        g.strokeStyle = 'rgba(150,180,200,0.35)';
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(64, 34); g.lineTo(32, 66); g.lineTo(44, 92);
        g.stroke();

        // Ebene 5: leuchtende Rueckendornen
        for (let i = 0; i < 4; i++) {
            const dx = 50 + i * 9, dy = 44 + i * 3;
            glowAt(g, dx, dy, 7, '255,90,50');
            g.fillStyle = '#ffd9c8';
            g.beginPath();
            g.moveTo(dx - 2, dy + 4);
            g.lineTo(dx, dy - 5);
            g.lineTo(dx + 2, dy + 4);
            g.closePath();
            g.fill();
        }

        // Ebene 6: Kopf mit Mandibeln
        g.fillStyle = '#1a2129';
        g.beginPath();
        g.moveTo(64, 26);
        g.lineTo(80, 42);
        g.lineTo(72, 54);
        g.lineTo(56, 54);
        g.lineTo(48, 42);
        g.closePath();
        g.fill();
        g.strokeStyle = 'rgba(150,180,200,0.3)';
        g.lineWidth = 1.5;
        g.stroke();
        g.fillStyle = '#39434f';
        g.beginPath(); g.moveTo(54, 52); g.lineTo(48, 64); g.lineTo(58, 56); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(74, 52); g.lineTo(80, 64); g.lineTo(70, 56); g.closePath(); g.fill();

        // Ebene 7: Glutaugen
        glowAt(g, 56, 42, 11, '255,80,40');
        glowAt(g, 72, 42, 11, '255,80,40');
        g.fillStyle = '#ffe9de';
        g.beginPath(); g.ellipse(56, 42, 4, 2.5, -0.3, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.ellipse(72, 42, 4, 2.5, 0.3, 0, Math.PI * 2); g.fill();

        scratches(g, 40, S, S);

    } else if (type === 'brute') {
        /* Schwerer Koloss: Panzerplatten, Reaktorkern, Kanonenarm, Visor */
        const bob = frame ? 2 : 0;
        const glow = '184,255,77';

        // Ebene 1: Beine mit Knieplatten und Fuesse
        g.fillStyle = '#241d14';
        g.fillRect(30, 88, 20, 34 - bob);
        g.fillRect(78, 88, 20, 34 - bob);
        g.fillStyle = '#3d3223';
        g.fillRect(28, 92, 24, 10);
        g.fillRect(76, 92, 24, 10);
        g.fillStyle = '#171208';
        g.fillRect(24, 118, 28, 8);
        g.fillRect(76, 118, 28, 8);

        // Ebene 2: Kanonenarm mit Rohr, Muedungsglut und Energiekabel
        g.fillStyle = '#2c2418';
        g.fillRect(92, 62 + bob, 30, 18);
        g.fillStyle = metalGrad(g, 0, 58, 0, 84, '#4a5a68', '#2c3641', '#10151b');
        g.fillRect(100, 58 + bob, 26, 26);
        g.fillStyle = '#05070a';
        g.fillRect(118, 63 + bob, 8, 16);
        glowAt(g, 120, 71 + bob, 9, glow);
        g.strokeStyle = `rgba(${glow},0.8)`;
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(96, 70 + bob);
        g.quadraticCurveTo(88, 80, 84, 74);
        g.stroke();

        // linker Arm mit Faust
        g.fillStyle = '#2c2418';
        g.fillRect(6, 64 + bob, 22, 16);
        g.fillStyle = '#3d3223';
        g.fillRect(2, 78 + bob, 24, 18);

        // Ebene 3: massiver Torso
        const bg = g.createRadialGradient(52, 50, 8, 64, 64, 52);
        bg.addColorStop(0, '#5a4a35');
        bg.addColorStop(0.6, '#382c1f');
        bg.addColorStop(1, '#171208');
        g.fillStyle = bg;
        g.beginPath();
        g.ellipse(64, 62 + bob, 44, 34, 0, 0, Math.PI * 2);
        g.fill();

        // Ebene 4: Brustpanzer mit Nieten
        g.fillStyle = '#463823';
        g.beginPath();
        g.moveTo(24, 48 + bob); g.lineTo(104, 48 + bob);
        g.lineTo(96, 76 + bob); g.lineTo(32, 76 + bob);
        g.closePath(); g.fill();
        g.strokeStyle = 'rgba(220,200,150,0.35)';
        g.lineWidth = 2;
        g.stroke();
        g.fillStyle = 'rgba(220,200,150,0.45)';
        [[30, 52], [47, 52], [64, 52], [81, 52], [98, 52], [36, 70], [64, 70], [92, 70]]
            .forEach(([rx, ry]) => g.fillRect(rx, ry + bob, 3, 3));

        // Ebene 5: Reaktorkern hinter Schutzlamellen
        glowAt(g, 64, 66 + bob, 16, glow);
        g.fillStyle = '#e9ffb0';
        g.beginPath(); g.arc(64, 66 + bob, 6, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(20,16,8,0.85)';
        for (let i = 0; i < 3; i++) g.fillRect(52, 60 + i * 6 + bob, 24, 3);

        // Ebene 6: Schultern, eine mit Warnstreifen
        g.fillStyle = '#3d3223';
        g.beginPath(); g.ellipse(22, 52 + bob, 14, 11, -0.2, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.ellipse(106, 52 + bob, 14, 11, 0.2, 0, Math.PI * 2); g.fill();
        g.save();
        g.beginPath(); g.ellipse(22, 52 + bob, 14, 11, -0.2, 0, Math.PI * 2); g.clip();
        for (let i = -2; i < 6; i++) {
            g.fillStyle = i % 2 ? 'rgba(255,190,60,0.5)' : 'rgba(10,10,10,0.55)';
            g.fillRect(i * 8, 40 + bob, 5, 26);
        }
        g.restore();

        // Ebene 7: Kopf mit gluhendem Visorspalt
        g.fillStyle = '#2c2418';
        g.fillRect(52, 30 + bob, 24, 16);
        g.fillStyle = '#171208';
        g.fillRect(54, 34 + bob, 20, 8);
        g.fillStyle = '#ffb04d';
        g.fillRect(56, 37 + bob, 16, 3);
        glowAt(g, 64, 38 + bob, 10, '255,150,50');

        // Auspuffstummel mit Hitzeglut
        g.fillStyle = '#241d14';
        g.fillRect(14, 34 + bob, 8, 14);
        g.fillRect(106, 34 + bob, 8, 14);
        g.fillStyle = 'rgba(255,140,60,0.4)';
        g.fillRect(15, 31 + bob, 6, 4);
        g.fillRect(107, 31 + bob, 6, 4);

        scratches(g, 60, S, S);

    } else {
        /* Sentinel: schwebende Rauten-Einheit, Tentakel, Riesenlinse, Triebwerkspods */
        const sway = frame ? 5 : -5;
        const glow = '84,200,255';

        // Ebene 1: Tentakel mit Leuchtspitzen (schwingen)
        g.strokeStyle = '#0d1722';
        g.lineWidth = 5;
        g.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
            const bx = 38 + i * 17;
            const ex = bx + sway * (i % 2 ? 1 : -1);
            g.beginPath();
            g.moveTo(bx, 78);
            g.quadraticCurveTo(bx + sway, 100, ex, 122);
            g.stroke();
            glowAt(g, ex, 122, 7, glow);
        }

        // Ebene 2: unterer Flossenkoerper
        g.fillStyle = '#16283c';
        g.beginPath();
        g.moveTo(64, 62);
        g.lineTo(84, 88);
        g.lineTo(64, 100);
        g.lineTo(44, 88);
        g.closePath();
        g.fill();

        // Ebene 3: Haupt-Rautenhuelle mit Panelnahten
        g.fillStyle = metalGrad(g, 0, 10, 0, 90, '#3a688c', '#1c3350', '#0a1420');
        g.beginPath();
        g.moveTo(64, 12);
        g.lineTo(108, 58);
        g.lineTo(64, 92);
        g.lineTo(20, 58);
        g.closePath();
        g.fill();
        g.strokeStyle = 'rgba(120,200,255,0.35)';
        g.lineWidth = 1.5;
        g.beginPath(); g.moveTo(20, 58); g.lineTo(108, 58); g.stroke();
        g.beginPath(); g.moveTo(64, 12); g.lineTo(64, 40); g.stroke();
        g.beginPath(); g.moveTo(64, 74); g.lineTo(64, 92); g.stroke();

        // Rimlight an der Oberkante
        g.strokeStyle = 'rgba(180,230,255,0.6)';
        g.lineWidth = 2;
        g.beginPath(); g.moveTo(64, 12); g.lineTo(20, 58); g.stroke();
        g.beginPath(); g.moveTo(64, 12); g.lineTo(108, 58); g.stroke();

        // Top-Flosse mit Lichtstreifen
        g.fillStyle = '#16283c';
        g.beginPath();
        g.moveTo(56, 14); g.lineTo(64, 2); g.lineTo(72, 14); g.lineTo(64, 22);
        g.closePath(); g.fill();
        g.fillStyle = `rgba(${glow},0.9)`;
        g.fillRect(61, 6, 6, 3);

        // Ebene 4: Triebwerkspods, Ladelichter alternieren
        g.fillStyle = '#16283c';
        g.beginPath(); g.ellipse(18, 48, 9, 14, -0.35, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.ellipse(110, 48, 9, 14, 0.35, 0, Math.PI * 2); g.fill();
        g.fillStyle = frame ? `rgba(${glow},0.95)` : `rgba(${glow},0.4)`;
        g.fillRect(14, 40, 8, 4);
        g.fillStyle = frame ? `rgba(${glow},0.4)` : `rgba(${glow},0.95)`;
        g.fillRect(106, 40, 8, 4);

        // Ebene 5: Riesenlinse mit Ring, Iris, Pupille, Scan-Spalt
        glowAt(g, 64, 52, 26, glow);
        g.fillStyle = '#dff4ff';
        g.beginPath(); g.arc(64, 52, 15, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#0a2a44';
        g.beginPath(); g.arc(64, 52, 10, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#04101c';
        g.beginPath(); g.arc(64, 52, 5, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#fff';
        g.beginPath(); g.arc(61, 48, 2.5, 0, Math.PI * 2); g.fill();
        g.fillStyle = `rgba(${glow},0.7)`;
        g.fillRect(63, 40, 2, 24);

        scratches(g, 30, S, S);
    }

    return c;
}

/* Treffer-Blitz: normale Sprite mit heissem Tint ueber 'source-atop' */
function tintSprite(src, color) {
    const c = document.createElement('canvas');
    c.width = src.width; c.height = src.height;
    const g = c.getContext('2d');
    g.drawImage(src, 0, 0);
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = color;
    g.fillRect(0, 0, c.width, c.height);
    return c;
}

const ENEMY_ART = {};
for (const t of ['stalker', 'brute', 'sentinel']) {
    const n0 = makeEnemySprite(t, 0);
    const n1 = makeEnemySprite(t, 1);
    ENEMY_ART[t] = [
        n0, n1,
        tintSprite(n0, 'rgba(255,140,120,0.6)'),
        tintSprite(n1, 'rgba(255,140,120,0.6)')
    ];
}


/* ===== Gesundheits-Pickups (Gruenes Kreuz) ===== */
function crossPath(g, x, y, s) {
  g.beginPath();
  g.moveTo(x - s, y); g.lineTo(x + s, y);
  g.moveTo(x, y - s); g.lineTo(x, y + s);
}
function makeHealthSprite() {
  const S = SPRITE_SIZE, c = document.createElement('canvas');
  c.width = c.height = S; const g = c.getContext('2d');
  g.clearRect(0, 0, S, S);
  g.save(); g.translate(S / 2, S / 2);
  glowAt(g, 0, 0, S * 0.5, '60,255,120');
  const bw = S * 0.30, bh = S * 0.46, r = S * 0.12;
  g.beginPath();
  g.moveTo(-bw / 2 + r, -bh / 2);
  g.arcTo(bw / 2, -bh / 2, bw / 2, bh / 2, r);
  g.arcTo(bw / 2, bh / 2, -bw / 2, bh / 2, r);
  g.arcTo(-bw / 2, bh / 2, -bw / 2, -bh / 2, r);
  g.arcTo(-bw / 2, -bh / 2, bw / 2, -bh / 2, r);
  g.closePath();
  g.fillStyle = '#0f3d1f'; g.fill();
  g.lineWidth = S * 0.025; g.strokeStyle = 'rgba(170,255,200,0.85)'; g.stroke();
  crossPath(g, 0, 0, S * 0.16);
  g.lineWidth = S * 0.075; g.lineCap = 'round'; g.strokeStyle = '#eafff1'; g.stroke();
  g.restore();
  return c;
}
const HEALTH_ART = makeHealthSprite();

function renderItems(dirX, dirY, planeX, planeY) {
  const invDet = 1 / (planeX * dirY - dirX * planeY);
  for (const it of items) {
    if (it.taken) continue;
    const sx = it.x - player.x, sy = it.y - player.y;
    const ty = invDet * (-planeY * sx + planeX * sy);
    if (ty <= 0.1) continue;
    const tx = invDet * (dirY * sx - dirX * sy);
    const screenX = (VIEW_W / 2) * (1 + tx / ty);
    const lineH = VIEW_H / ty;
    const bob = Math.sin((timeAlive + it.bob) * 3) * lineH * 0.05;
    const size = lineH * 0.5;
    const bottomY = VIEW_H / 2 + lineH / 2 + player.pitch;
    const topY = bottomY - size + bob;
    ctx.globalAlpha = Math.max(0.25, 1 - ty / 15);
    ctx.drawImage(HEALTH_ART, screenX - size / 2, topY, size, size);
    ctx.globalAlpha = 1;
  }
}

function updateItems(dt) {
  for (const it of items) {
    if (it.taken) continue;
    if (player.hp >= 100) continue;
    const d = Math.hypot(it.x - player.x, it.y - player.y);
    if (d < PLAYER_R + 0.4) {
      it.taken = true;
      player.hp = Math.min(100, player.hp + HEAL_AMOUNT);
      sfx.pickup();
    }
  }
}

function renderEnemies(dirX, dirY, planeX, planeY) {
    const invDet = 1 / (planeX * dirY - dirX * planeY);

    const list = enemies
        .filter(e => e.alive || e.dieT < 0.55)
        .map(e => {
            const sx = e.x - player.x, sy = e.y - player.y;
            return { e, tx: invDet * (dirY * sx - dirX * sy), ty: invDet * (-planeY * sx + planeX * sy) };
        })
        .filter(o => o.ty > 0.1)
        .sort((a, b) => b.ty - a.ty);

    for (const o of list) {
        const e = o.e;
        const T = ENEMY_TYPES[e.type];
        const screenX = (VIEW_W / 2) * (1 + o.tx / o.ty);
        const lineH = VIEW_H / o.ty;

        const sprH = lineH * 0.85 * T.size;
        const sprW = sprH;
        const bottomY = VIEW_H / 2 + lineH / 2 + player.pitch;
        // Sentinel schwebt
        const bob = e.type === 'sentinel'
            ? Math.sin(timeAlive * 3 + e.wanderA * 5) * lineH * 0.035
            : 0;
        const topY = bottomY - sprH + bob;
        const startX = Math.floor(screenX - sprW / 2);
        const endX = Math.ceil(screenX + sprW / 2);

        let alpha = 1;
        if (!e.alive) alpha = Math.max(0, 1 - e.dieT / 0.55);
        alpha *= Math.max(0.25, 1 - o.ty / 15);
        const sink = e.alive ? 0 : e.dieT * 34;

        // Bodenschatten (Sentinel schwebt: Schatten kleiner)
        ctx.globalAlpha = 0.4 * alpha;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(screenX, bottomY,
            sprW * (e.type === 'sentinel' ? 0.16 : 0.26),
            Math.max(1.5, sprH * 0.045), 0, 0, Math.PI * 2);
        ctx.fill();

        const animSpeed = e.type === 'stalker' ? 6 : 3;
        const frame = ((timeAlive * animSpeed) | 0) % 2;
        const art = ENEMY_ART[e.type];
        const img = (e.flashT > 0 && e.alive) ? art[2 + frame] : art[frame];

        ctx.globalAlpha = alpha;
        // Spaltenweise zeichnen, damit Waende den Sprite korrekt verdecken
        for (let x = startX; x < endX; x++) {
            if (x < 0 || x >= VIEW_W) continue;
            if (o.ty >= zbuf[x]) continue;
            const u = (x - startX) / sprW;
            ctx.drawImage(img, u * img.width, 0, img.width / sprW, img.height, x, topY + sink, 1, sprH);
        }

        // HP-Balken ueber dem Kopf (Farbe nach Typ)
        if (e.alive && e.hp < e.maxHp) {
            const bw = Math.max(10, sprW * 0.45);
            const bx = screenX - bw / 2;
            const by = topY - 7;
            if (by > 0 && screenX >= 0 && screenX < VIEW_W && o.ty < zbuf[Math.round(screenX)]) {
                ctx.fillStyle = 'rgba(0,0,0,0.65)';
                ctx.fillRect(bx - 1, by - 1, bw + 2, 4);
                ctx.fillStyle = e.type === 'brute' ? '#b8ff4d'
                    : e.type === 'sentinel' ? '#54c8ff' : '#ff5e4d';
                ctx.fillRect(bx, by, bw * (e.hp / e.maxHp), 2);
            }
        }
        ctx.globalAlpha = 1;
    }
}

/* ================= Waffe & Crosshair ================= */
function renderWeapon(dt) {
    const moving = (keys.KeyW || keys.KeyS || keys.KeyA || keys.KeyD) &&
                   state === 'playing';
    if (moving) bobPhase += dt * 9;
    const bobX = moving ? Math.sin(bobPhase) * 5 : Math.sin(bobPhase * 0.4) * 1.5;
    const bobY = moving ? Math.abs(Math.cos(bobPhase)) * 4 : Math.sin(timeAlive * 1.8) * 1.6;
    const recY = recoil * 14;

    ctx.save();
    ctx.translate(VIEW_W / 2 + bobX, VIEW_H + bobY + recY);
    ctx.rotate(recoil * 0.05);

    const fire = muzzleT > 0 ? muzzleT / 0.07 : 0;
    const glow = player.reloading
        ? 0.35 + 0.35 * Math.sin(timeAlive * 20)
        : player.ammo > 0 ? 1 : 0.12;

    // --- Plasma-Coils: drei pulsierende Ringe um den Lauf ---
    for (let i = 0; i < 3; i++) {
        const cy = -58 + i * 9;
        const coil = Math.min(1, 0.3 + glow * 0.45 + fire * 0.7 - i * 0.06);
        ctx.fillStyle = `rgba(255,176,46,${(0.3 * coil).toFixed(2)})`;
        ctx.fillRect(-11, cy, 22, 4);
        ctx.fillStyle = `rgba(255,224,150,${(0.75 * coil).toFixed(2)})`;
        ctx.fillRect(-9, cy + 1, 18, 2);
    }

    // --- Lauf mit Metallverlauf und Muendungsring ---
    let grd = ctx.createLinearGradient(-8, 0, 8, 0);
    grd.addColorStop(0, '#0d1218');
    grd.addColorStop(0.5, '#2a3441');
    grd.addColorStop(1, '#0d1218');
    ctx.fillStyle = grd;
    ctx.fillRect(-7, -64, 14, 28);
    ctx.fillStyle = '#0a0e13';
    ctx.fillRect(-10, -68, 20, 6);
    ctx.fillStyle = '#2a3441';
    ctx.fillRect(-10, -68, 20, 2);
    ctx.fillStyle = '#05070a';
    ctx.fillRect(-6, -67, 12, 3);
    // Plasma im Rohr beim Feuern
    if (fire > 0) {
        ctx.fillStyle = `rgba(150,255,235,${(0.8 * fire).toFixed(2)})`;
        ctx.fillRect(-5, -66, 10, 2 + fire * 3);
    }

    // --- Top-Rail mit Kerben ---
    ctx.fillStyle = '#1b232d';
    ctx.fillRect(-9, -64, 18, 4);
    ctx.fillStyle = '#0d1218';
    for (let i = 0; i < 4; i++) ctx.fillRect(-8 + i * 4.5, -65, 2, 2);

    // --- Holo-Visier: Gehaeuse, Leuchtring, Punkt ---
    ctx.fillStyle = '#0c1116';
    ctx.fillRect(-7, -78, 14, 12);
    ctx.strokeStyle = 'rgba(201,154,82,0.6)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-7, -78, 14, 12);
    ctx.strokeStyle = `rgba(255,110,90,${(0.4 + 0.3 * Math.sin(timeAlive * 5)).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(0, -72, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255,140,110,${(0.6 + 0.3 * Math.sin(timeAlive * 5)).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(0, -72, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // --- Gehaeuse (angular) ---
    grd = ctx.createLinearGradient(-24, 0, 26, 0);
    grd.addColorStop(0, '#141a22');
    grd.addColorStop(0.45, '#2e3947');
    grd.addColorStop(1, '#10151c');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(-20, -52);
    ctx.lineTo(20, -52);
    ctx.lineTo(26, -6);
    ctx.lineTo(-26, -6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1d2630';
    ctx.fillRect(-20, -54, 40, 4);
    ctx.strokeStyle = 'rgba(201,154,82,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-22, -20); ctx.lineTo(24, -20);
    ctx.moveTo(-24, -12); ctx.lineTo(26, -12);
    ctx.stroke();

    // --- Kuehllamellen mit Kantenlicht ---
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(14, -48 + i * 7, 9, 3);
        ctx.fillStyle = 'rgba(180,165,140,0.25)';
        ctx.fillRect(14, -49 + i * 7, 9, 1);
    }

    // --- Energiezelle: Fuellstand = Munition, Plasmablasen steigen auf ---
    ctx.fillStyle = '#0a0f14';
    ctx.fillRect(-16, -48, 16, 24);
    const fill = player.reloading ? glow : player.ammo / MAG_SIZE;
    const fh = 20 * Math.max(0.08, fill);
    ctx.fillStyle = `rgba(255,176,46,${0.3 + glow * 0.4})`;
    ctx.fillRect(-14, -46 + (20 - fh), 12, fh);
    for (let i = 0; i < 3; i++) {
        const by = -46 + (20 - fh) + ((timeAlive * 14 + i * 7) % Math.max(1, fh));
        ctx.fillStyle = 'rgba(255,240,215,0.5)';
        ctx.fillRect(-12 + i * 4, by, 2, 2);
    }
    ctx.shadowColor = '#ffb02e';
    ctx.shadowBlur = 10 * glow;
    ctx.strokeStyle = `rgba(255,214,140,${0.5 + glow * 0.5})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(-14, -46, 12, 20);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#2a3441';
    ctx.strokeRect(-16, -48, 16, 24);

    // --- Energiekabel Zelle -> Lauf (leuchtet beim Feuern) ---
    ctx.strokeStyle = '#10161c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-4, -46);
    ctx.quadraticCurveTo(6, -50, 6, -58);
    ctx.stroke();
    ctx.strokeStyle = `rgba(255,176,46,${(0.3 + fire * 0.5).toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Griff mit Rillen ---
    grd = ctx.createLinearGradient(0, -20, 0, 0);
    grd.addColorStop(0, '#1d252e');
    grd.addColorStop(1, '#0d1116');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(-10, -18);
    ctx.lineTo(10, -18);
    ctx.lineTo(6, 2);
    ctx.lineTo(-6, 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    for (let i = 0; i < 3; i++) ctx.fillRect(-7, -14 + i * 5, 14, 2);

    // --- Muzzle-Flash: Schockwellen-Ring, Glow, Stern, Plasma-Schacht ---
    if (fire > 0) {
        const mx = 0, my = -72;
        ctx.strokeStyle = `rgba(255,224,160,${(0.7 * fire).toFixed(2)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mx, my, (1 - fire) * 30 + 6, 0, Math.PI * 2);
        ctx.stroke();

        const fg = ctx.createRadialGradient(mx, my, 2, mx, my, 22 + 24 * fire);
        fg.addColorStop(0, 'rgba(255,248,235,0.95)');
        fg.addColorStop(0.35, 'rgba(255,176,46,0.8)');
        fg.addColorStop(1, 'rgba(255,176,46,0)');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(mx, my, 22 + 24 * fire, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(235,255,250,${0.9 * fire})`;
        ctx.beginPath();
        const spikes = 5, R1 = 12 + 16 * fire, R2 = R1 * 0.38;
        for (let i = 0; i < spikes * 2; i++) {
            const ang = (i / (spikes * 2)) * Math.PI * 2 + timeAlive * 10;
            const rr = i % 2 ? R2 : R1;
            const px = mx + Math.cos(ang) * rr, py = my + Math.sin(ang) * rr;
            if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(150,255,235,${0.5 * fire})`;
        ctx.beginPath();
        ctx.ellipse(mx, my - 4, 5, 12 + 10 * fire, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();

    // Muendungslicht auf die Szene werfen
    if (fire > 0) {
        const lg = ctx.createRadialGradient(VIEW_W / 2, VIEW_H * 0.72, 10, VIEW_W / 2, VIEW_H * 0.72, 190);
        lg.addColorStop(0, `rgba(120,255,225,${0.16 * fire})`);
        lg.addColorStop(1, 'rgba(120,255,225,0)');
        ctx.fillStyle = lg;
        ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }
}

function renderCrosshair() {
    const cx = VIEW_W / 2, cy = VIEW_H / 2;
    const gap = 4 + recoil * 6;
    const len = 5;
    ctx.strokeStyle = 'rgba(140,255,235,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - gap - len, cy); ctx.lineTo(cx - gap, cy);
    ctx.moveTo(cx + gap, cy); ctx.lineTo(cx + gap + len, cy);
    ctx.moveTo(cx, cy - gap - len); ctx.lineTo(cx, cy - gap);
    ctx.moveTo(cx, cy + gap); ctx.lineTo(cx, cy + gap + len);
    ctx.stroke();

    // Mittelpunkt
    ctx.fillStyle = 'rgba(140,255,235,0.9)';
    ctx.fillRect(cx - 1, cy - 1, 2, 2);

    // Treffer-Marker
    if (hitMarkerT > 0) {
        const a = Math.min(1, hitMarkerT / 0.18);
        ctx.strokeStyle = `rgba(255,110,90,${a.toFixed(2)})`;
        ctx.lineWidth = 2;
        const o1 = 5, o2 = 11;
        ctx.beginPath();
        ctx.moveTo(cx - o2, cy - o2); ctx.lineTo(cx - o1, cy - o1);
        ctx.moveTo(cx + o2, cy - o2); ctx.lineTo(cx + o1, cy - o1);
        ctx.moveTo(cx - o2, cy + o2); ctx.lineTo(cx - o1, cy + o1);
        ctx.moveTo(cx + o2, cy + o2); ctx.lineTo(cx + o1, cy + o1);
        ctx.stroke();
    }
}

/* ================= Gameplay-Logik ================= */
function startReload() {
    if (player.reloading || player.ammo === MAG_SIZE) return;
    player.reloading = true;
    player.reloadT = RELOAD_TIME;
    sfx.reload();
}

function shoot() {
    if (player.ammo <= 0) {
        sfx.empty();
        startReload();
        return;
    }
    player.ammo--;
    player.fireT = FIRE_COOLDOWN;
    recoil = 1;
    muzzleT = 0.07;
    sfx.shoot();

    const dx = Math.cos(player.a), dy = Math.sin(player.a);
    let wallD = castRay(player.x, player.y, dx, dy).dist;
    wallD = Math.min(wallD, castRayProps(dx, dy));

    // Muedungsfunken, Rauch und Patronenhuelse
    spawnParticles(player.x + dx * 0.45, player.y + dy * 0.45, 0.45, 3,
        PARTICLE_COLORS.plasma, 1.2);
    spawnSmoke(player.x + dx * 0.5, player.y + dy * 0.5, 0.5, 2);
    spawnShell();

    let best = null, bestT = Infinity;
    for (const e of enemies) {
        if (!e.alive) continue;
        const rx = e.x - player.x, ry = e.y - player.y;
        const t = rx * dx + ry * dy;
        if (t <= 0 || t > wallD) continue;
        const perp = Math.abs(rx * dy - ry * dx);
        if (perp < e.r + 0.1 && t < bestT) { best = e; bestT = t; }
    }

    // Tracer: sichtbarer Energieschuss
    const endD = best ? bestT : wallD;
    tracers.push({
        x1: player.x + dx * 0.35, y1: player.y + dy * 0.35,
        x2: player.x + dx * endD, y2: player.y + dy * endD,
        age: 0
    });

    if (best) {
        best.hp -= GUN_DAMAGE;
        best.flashT = 0.12;
        best.hitAnimT = 0.35;
        hitMarkerT = 0.18;
        // Energie-Spritzer in Schussrichtung + kleiner Trefferring
        spawnSparks(best.x, best.y, 0.45, dx, dy, 8, PARTICLE_COLORS.plasma, 2.4);
        rings.push({
            x: best.x, y: best.y, age: 0,
            color: '255,190,110', maxR: 0.45, life: 0.2
        });
        // leichter Rueckstoss
        const kx = best.x + dx * 0.1, ky = best.y + dy * 0.1;
        if (!collides(kx, best.y, best.r, best)) best.x = kx;
        if (!collides(best.x, ky, best.r, best)) best.y = ky;
        if (best.hp <= 0) {
            best.alive = false;
            best.dying = true;
            best.dieT = 0;
            score += ENEMY_TYPES[best.type].score;
            rings.push({
                x: best.x, y: best.y, age: 0,
                color: best.type === 'brute' ? '184,255,77' : '255,200,120'
            });
            booms.push({ x: best.x, y: best.y, age: 0 });
            spawnParticles(best.x, best.y, 0.45, 34, PARTICLE_COLORS.death, 3.2);
            spawnDebris(best.x, best.y, 0.4, 8);
            spawnSmoke(best.x, best.y, 0.5, 6);
            shakeT = Math.max(shakeT, 0.14);
            sfx.die();
            sfx.boom();
            updateObjective();
        } else {
            sfx.hit();
        }
    } else {
        // Funken + Rauch an der Wand
        const hx = player.x + dx * (wallD - 0.08);
        const hy = player.y + dy * (wallD - 0.08);
        spawnSparks(hx, hy, 0.5, -dx, -dy, 8, PARTICLE_COLORS.spark, 2.4);
        spawnParticles(hx, hy, 0.5, 4, PARTICLE_COLORS.spark, 1.4);
        spawnSmoke(hx, hy, 0.55, 2);
    }

    if (player.ammo === 0) startReload();
}

function damagePlayer(n) {
    if (state !== 'playing') return;
    player.hp -= n;
    hurtFlash = 1;
    shakeT = 0.3;
    sfx.hurt();
    if (player.hp <= 0) {
        player.hp = 0;
        gameOver();
    }
}

function gameOver() {
    state = 'dead';
    ambientStop();
    player.firing = false;
    elHud.style.display = 'none';
    elDmg.style.opacity = 0;
    showOverlay(elDead);
    if (document.pointerLockElement === canvas) document.exitPointerLock();
}

function updatePlayer(dt) {
    // Timer
    player.fireT -= dt;
    recoil = Math.max(0, recoil - dt * 5);
    muzzleT = Math.max(0, muzzleT - dt);
    hurtFlash = Math.max(0, hurtFlash - dt * 2.2);
    shakeT = Math.max(0, shakeT - dt);
    hitMarkerT = Math.max(0, hitMarkerT - dt);

    if (player.reloading) {
        player.reloadT -= dt;
        if (player.reloadT <= 0) {
            player.reloading = false;
            player.ammo = MAG_SIZE;
        }
    }

    // Bewegung
    if (elevatorRiding) { player.firing = false; return; }
    let f = 0, s = 0;
    if (keys.KeyW || keys.ArrowUp) f += 1;
    if (keys.KeyS || keys.ArrowDown) f -= 1;
    if (keys.KeyD || keys.ArrowRight) s += 1;
    if (keys.KeyA || keys.ArrowLeft) s -= 1;

    const len = Math.hypot(f, s);
    if (len > 0) {
        f /= len; s /= len;
        const ca = Math.cos(player.a), sa = Math.sin(player.a);
        // Seitwaerts: A = links, D = rechts
        const vx = (ca * f * MOVE_SPEED - sa * s * MOVE_SPEED * STRAFE_FACTOR) * dt;
        const vy = (sa * f * MOVE_SPEED + ca * s * MOVE_SPEED * STRAFE_FACTOR) * dt;

        const px = player.x, py = player.y;
        const nx = player.x + vx;
        if (!collides(nx, player.y, PLAYER_R)) player.x = nx;
        const ny = player.y + vy;
        if (!collides(player.x, ny, PLAYER_R)) player.y = ny;

        footstepDist += Math.hypot(player.x - px, player.y - py);
        if (footstepDist > 0.62) { footstepDist -= 0.62; sfx.footstep(); }
    } else {
        footstepDist = 0.31; // naechster Schritt kommt zuegig nach dem Losgehen
    }

    // Feuern
    if (player.firing && !player.reloading && player.fireT <= 0) shoot();
}

function moveEnemy(e, vx, vy) {
    const nx = e.x + vx;
    if (!collides(nx, e.y, e.r, e) &&
        Math.hypot(nx - player.x, e.y - player.y) > 0.5) e.x = nx;
    const ny = e.y + vy;
    if (!collides(e.x, ny, e.r, e) &&
        Math.hypot(e.x - player.x, ny - player.y) > 0.5) e.y = ny;
}

function pickWanderTarget(e) {
    for (let t = 0; t < 16; t++) {
        const x = 1 + Math.random() * (MW - 2);
        const y = 1 + Math.random() * (MH - 2);
        if (collides(x, y, 0.25, null)) continue;
        if (Math.hypot(x - e.x, y - e.y) < 2.5) continue;
        return { x: x, y: y };
    }
    return null;
}

function fireProjectile(e) {
    const T = ENEMY_TYPES[e.type];
    const baseAng = Math.atan2(player.y - e.y, player.x - e.x);
    const burst = T.burst || 1;
    const col = T.projColor || '#ff5bd0';
    for (let b = 0; b < burst; b++) {
        const off = burst > 1 ? (b - (burst - 1) / 2) * (T.burstSpread || 0.2) : 0;
        const ang = baseAng + off;
        const dx = Math.cos(ang), dy = Math.sin(ang);
        projectiles.push({
            x: e.x + dx * 0.4, y: e.y + dy * 0.4, z: 0.5,
            dx: dx, dy: dy, speed: T.projSpeed, dmg: T.dmg, age: 0, color: col
        });
    }
    spawnParticles(e.x + Math.cos(baseAng) * 0.45, e.y + Math.sin(baseAng) * 0.45, 0.5, 6,
        [col, '#ffffff'], 1.8);
    e.atkAnim = 0.18;
    sfx.enemyShot(e.type);
}

function updateProjectiles(dt) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.age += dt;
        p.x += p.dx * p.speed * dt;
        p.y += p.dy * p.speed * dt;
        // Funken-Spur
        if (Math.random() < 0.5) {
            spawnParticles(p.x, p.y, 0.5, 1, [p.color, '#ffffff'], 0.3);
        }
        if (p.age > 5 || collides(p.x, p.y, 0.08, null)) {
            spawnParticles(p.x, p.y, 0.5, 6, [p.color, '#ffffff'], 1.8);
            projectiles.splice(i, 1);
            continue;
        }
        if (Math.hypot(p.x - player.x, p.y - player.y) < PLAYER_R + 0.15) {
            damagePlayer(p.dmg);
            projectiles.splice(i, 1);
        }
    }
}

function updateEnemies(dt) {
    for (const e of enemies) {
        if (!e.alive) { e.dieT += dt; continue; }
        e.flashT -= dt;
        if (e.hitAnimT > 0) e.hitAnimT -= dt;
        e.atkAnim -= dt;

        const T = ENEMY_TYPES[e.type];
        const dx = player.x - e.x, dy = player.y - e.y;
        const d = Math.hypot(dx, dy);

        let vx = 0, vy = 0;
        const sees = d < T.sight && hasLOS(e.x, e.y, player.x, player.y);
        if (sees) {
            e.wanderT = 0; e.wanderTarget = null;
            if (T.ranged) {
                if (T.strafe) {
                    // Cacodemon: auf mittlere Distanz cirken, seitlich strafen
                    if (d < 1.8) { vx = -(dx / d) * T.speed; vy = -(dy / d) * T.speed; }
                    else if (d > 4.2) { vx = (dx / d) * T.speed; vy = (dy / d) * T.speed; }
                    else { vx = -(dy / d) * T.speed * 0.7 + (dx / d) * T.speed * 0.1; vy = (dx / d) * T.speed * 0.7 + (dy / d) * T.speed * 0.1; }
                    if (d <= T.range) { e.attackT -= dt; if (e.attackT <= 0) { e.attackT = T.attackCd; fireProjectile(e); } }
                } else {
                    // Imp: staendig auf den Spieler zugehen und waehrenddessen feuern
                    if (d < 1.3) { vx = -(dx / d) * T.speed * 0.8; vy = -(dy / d) * T.speed * 0.8; }
                    else { vx = (dx / d) * T.speed; vy = (dy / d) * T.speed; }
                    if (d <= T.range) { e.attackT -= dt; if (e.attackT <= 0) { e.attackT = T.attackCd; fireProjectile(e); } }
                }
            } else if (d > T.range) {
                vx = (dx / d) * T.speed; vy = (dy / d) * T.speed;
            } else {
                e.attackT -= dt;
                if (e.attackT <= 0) { e.attackT = T.attackCd; e.atkAnim = 0.22; damagePlayer(T.dmg); }
            }
        } else {
            // echtes Patrouillieren: Zielpunkt ansteuern (nicht nur zufaelliges Driften)
            e.wanderT -= dt;
            if (!e.wanderTarget || e.wanderT <= 0 ||
                Math.hypot(e.wanderTarget.x - e.x, e.wanderTarget.y - e.y) < 0.4) {
                e.wanderTarget = pickWanderTarget(e);
                e.wanderT = 4 + Math.random() * 4;
            }
            if (e.wanderTarget) {
                const tx = e.wanderTarget.x - e.x, ty = e.wanderTarget.y - e.y;
                const td = Math.hypot(tx, ty) || 1;
                vx = (tx / td) * T.speed * 0.5;
                vy = (ty / td) * T.speed * 0.5;
            }
        }
        if (vx || vy) moveEnemy(e, vx * dt, vy * dt);
        const lx = (e.lastX === undefined) ? e.x : e.lastX;
        const ly = (e.lastY === undefined) ? e.y : e.lastY;
        const moved = Math.hypot(e.x - lx, e.y - ly);
        e.lastX = e.x; e.lastY = e.y;
        e.speed = moved / Math.max(dt, 1e-4);
        e.moving = e.alive && e.speed > 0.12;
        e.walkPhase = (e.walkPhase || 0) + dt * (5 + e.speed * 2.2);
        // Blickrichtung merken (fuer Sprite-Ausrichtung)
        if (sees) e.faceAng = Math.atan2(dy, dx);
        else if (vx || vy) e.faceAng = Math.atan2(vy, vx);
    }
    updateProjectiles(dt);
}

function updateDoors(dt) {
    for (const d of doors) {
        const dist = Math.hypot(player.x - d.x, player.y - d.y);
        const target = dist < 2.3 ? 1 : 0;
        if (d._prevTarget === undefined) d._prevTarget = target;
        if (target !== d._prevTarget) { sfx.doorMove(); d._prevTarget = target; }
        d.openAmt += (target - d.openAmt) * Math.min(1, dt * 3.5);
        if (d.openAmt < 0.001) d.openAmt = 0;
        d.open = d.openAmt > 0.7;
        if (typeof _3d !== 'undefined' && _3d && d.panel) {
            d.panel.position[d.slide] = d.openAmt * 0.86;
            if (d.panel.material.emissive) d.panel.material.emissiveIntensity = 0.6 + d.openAmt * 1.6;
        }
    }
}

function updateHud() {
    const hpPct = Math.max(0, player.hp);
    elHpBar.style.width = hpPct + '%';
    elHpBar.style.background = hpPct > 40
        ? 'linear-gradient(to right, #7a4a12, #ffb02e)'
        : 'linear-gradient(to right, #a8231f, #ff6b5e)';
    elHpNum.textContent = Math.ceil(hpPct);
    elHpBg.classList.toggle('critical', hpPct <= 30 && hpPct > 0);
    elAmmoNum.textContent = player.reloading ? '--' : player.ammo;
    elReloadHit.style.visibility = (!player.reloading && player.ammo < MAG_SIZE) ? 'visible' : 'hidden';

    // Munitions-Pips
    let pips = '';
    for (let i = 0; i < MAG_SIZE; i++) {
        pips += `<span class="${!player.reloading && i < player.ammo ? 'on' : ''}"></span>`;
    }
    elAmmoPips.innerHTML = pips;

    // Score & Feindanzahl
    elScoreNum.textContent = String(score).padStart(5, '0');
    elHostilesNum.textContent = String(enemies.filter(e => e.alive).length);
}

/* ================= Render-Hauptfunktion ================= */
/* ================= 3D-Renderer (Three.js, atmospheric) ================= */
let _3d = null;
const EYE_H = 0.56;
const WALL_H = 1.8;
const PITCH_MAX_RAD = Math.PI / 3;
let ENEMY_RES = null, ITEM_RES = null, WEAPON_RES = null;
let _gltfLoader = null;
let _enemyModels = null;
let _glbState = 'init';
const MODEL_TARGET_H = { stalker: 0.9, brute: 1.15, sentinel: 0.85, monster: 0.85 };
const MODEL_ROT_Y = { stalker: 0, brute: 0, sentinel: 0, monster: 0 };
const RUN_SPEED = 1.6;

/* ---------- Textur-Hilfen (PBR-artig) ---------- */
function newCanvas(s) { const c = document.createElement('canvas'); c.width = c.height = s; return c; }

function makeNormalMap(src, strength) {
    const S = src.width, c = newCanvas(S), g = c.getContext('2d');
    const sctx = src.getContext('2d');
    const img = sctx.getImageData(0, 0, S, S).data;
    const out = g.createImageData(S, S);
    const lum = (x, y) => {
        x = (x + S) % S; y = (y + S) % S;
        const i = (y * S + x) * 4;
        return (img[i] * 0.299 + img[i + 1] * 0.587 + img[i + 2] * 0.114) / 255;
    };
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const dx = lum(x + 1, y) - lum(x - 1, y);
        const dy = lum(x, y + 1) - lum(x, y - 1);
        let nx = -dx * strength, ny = -dy * strength, nz = 1;
        const len = Math.hypot(nx, ny, nz);
        nx /= len; ny /= len; nz /= len;
        const i = (y * S + x) * 4;
        out.data[i] = (nx * 0.5 + 0.5) * 255;
        out.data[i + 1] = (ny * 0.5 + 0.5) * 255;
        out.data[i + 2] = (nz * 0.5 + 0.5) * 255;
        out.data[i + 3] = 255;
    }
    g.putImageData(out, 0, 0);
    return c;
}

function tex(canvas, srgb) {
    const t = new THREE.CanvasTexture(canvas);
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.encoding = (srgb === false) ? THREE.LinearEncoding : THREE.sRGBEncoding;
    return t;
}

function makeFloorTexture(ceil) {
    const S = 256, c = newCanvas(S), g = c.getContext('2d');
    g.fillStyle = ceil ? '#0a0806' : '#110d08';
    g.fillRect(0, 0, S, S);
    // Grundplatten mit Fugen
    const tiles = 4, ts = S / tiles;
    for (let i = 0; i < tiles; i++) for (let j = 0; j < tiles; j++) {
        const shade = 14 + ((i * 7 + j * 13) % 5) * 4;
        g.fillStyle = ceil ? 'rgb(' + (shade + 8) + ',' + (shade + 4) + ',' + shade + ')' : 'rgb(' + (shade + 14) + ',' + (shade + 9) + ',' + (shade + 3) + ')';
        g.fillRect(i * ts + 2, j * ts + 2, ts - 4, ts - 4);
    }
    // Verschmutzung / Kratzer
    for (let i = 0; i < 1400; i++) {
        const v = Math.random();
        g.fillStyle = v < 0.5 ? 'rgba(0,0,0,' + (Math.random() * 0.25) + ')' : 'rgba(150,135,105,' + (Math.random() * 0.05) + ')';
        g.fillRect(Math.random() * S, Math.random() * S, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    // grosszuegige Fugen
    g.strokeStyle = 'rgba(0,0,0,0.7)'; g.lineWidth = 4;
    for (let i = 0; i <= tiles; i++) { g.beginPath(); g.moveTo(i * ts, 0); g.lineTo(i * ts, S); g.moveTo(0, i * ts); g.lineTo(S, i * ts); g.stroke(); }
    return c;
}

function isWall(x, y) {
    if (x < 0 || y < 0 || x >= MW || y >= MH) return 1;
    return grid[y * MW + x];
}
function hash2(x, y) {
    let h = (x * 73856093) ^ (y * 19349663);
    h = (h ^ (h >>> 13)) >>> 0;
    return (h % 1000) / 1000;
}

/* ---------- Gegner-Modelle (3D-Koerper + DOOM-Sprite-Gesicht) ---------- */
function drawEnemyFace(type, S) {
    const c = newCanvas(S), g = c.getContext('2d');
    g.clearRect(0, 0, S, S);
    const cx = S / 2, cy = S / 2 + 6;
    if (type === 'stalker') {
        // Imp
        g.fillStyle = '#c8a86a';
        g.beginPath(); g.moveTo(cx - 30, 40); g.lineTo(cx - 52, 8); g.lineTo(cx - 18, 34); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(cx + 30, 40); g.lineTo(cx + 52, 8); g.lineTo(cx + 18, 34); g.closePath(); g.fill();
        const grd = g.createRadialGradient(cx, cy - 6, 8, cx, cy, 64);
        grd.addColorStop(0, '#9a5e30'); grd.addColorStop(0.6, '#5e3a1e'); grd.addColorStop(1, '#33200f');
        g.fillStyle = grd; g.beginPath(); g.ellipse(cx, cy, 50, 58, 0, 0, 7); g.fill();
        g.fillStyle = '#1c0f08';
        g.beginPath(); g.moveTo(cx - 44, cy - 16); g.lineTo(cx - 10, cy - 4); g.lineTo(cx - 40, cy + 4); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(cx + 44, cy - 16); g.lineTo(cx + 10, cy - 4); g.lineTo(cx + 40, cy + 4); g.closePath(); g.fill();
        for (const s of [-1, 1]) {
            const ex = cx + s * 22, ey = cy - 2;
            const eg = g.createRadialGradient(ex, ey, 1, ex, ey, 15);
            eg.addColorStop(0, '#fff4b0'); eg.addColorStop(0.45, '#ffb52e'); eg.addColorStop(1, 'rgba(255,120,0,0)');
            g.fillStyle = eg; g.beginPath(); g.arc(ex, ey, 15, 0, 7); g.fill();
            g.fillStyle = '#160a00'; g.beginPath(); g.arc(ex, ey, 4, 0, 7); g.fill();
        }
        g.fillStyle = '#160a06'; g.beginPath(); g.ellipse(cx, cy + 36, 26, 15, 0, 0, 7); g.fill();
        g.fillStyle = '#efe7cf';
        for (let i = -2; i <= 2; i++) { const fx = cx + i * 11; g.beginPath(); g.moveTo(fx - 4, cy + 26); g.lineTo(fx + 4, cy + 26); g.lineTo(fx, cy + 40); g.closePath(); g.fill(); }
    } else if (type === 'brute') {
        // Baron of Hell
        g.lineWidth = 10; g.strokeStyle = '#d8d2b0';
        g.beginPath(); g.moveTo(cx - 26, 46); g.quadraticCurveTo(cx - 70, 30, cx - 58, -6); g.stroke();
        g.beginPath(); g.moveTo(cx + 26, 46); g.quadraticCurveTo(cx + 70, 30, cx + 58, -6); g.stroke();
        const grd = g.createRadialGradient(cx, cy - 6, 8, cx, cy, 66);
        grd.addColorStop(0, '#9aa07e'); grd.addColorStop(0.6, '#6b7253'); grd.addColorStop(1, '#3a3f2c');
        g.fillStyle = grd; g.beginPath(); g.ellipse(cx, cy, 52, 58, 0, 0, 7); g.fill();
        g.fillStyle = '#20210f';
        g.beginPath(); g.moveTo(cx - 46, cy - 14); g.lineTo(cx - 8, cy - 6); g.lineTo(cx - 40, cy + 6); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(cx + 46, cy - 14); g.lineTo(cx + 8, cy - 6); g.lineTo(cx + 40, cy + 6); g.closePath(); g.fill();
        for (const s of [-1, 1]) {
            const ex = cx + s * 24, ey = cy - 2;
            const eg = g.createRadialGradient(ex, ey, 1, ex, ey, 15);
            eg.addColorStop(0, '#fff7c0'); eg.addColorStop(0.45, '#ffd23a'); eg.addColorStop(1, 'rgba(255,140,0,0)');
            g.fillStyle = eg; g.beginPath(); g.arc(ex, ey, 15, 0, 7); g.fill();
            g.fillStyle = '#1a0f00'; g.beginPath(); g.arc(ex, ey, 4, 0, 7); g.fill();
        }
        g.fillStyle = '#140a06'; g.beginPath(); g.ellipse(cx, cy + 34, 30, 16, 0, 0, 7); g.fill();
        g.fillStyle = '#efe7cf';
        for (let i = -3; i <= 3; i++) { const fx = cx + i * 9; g.beginPath(); g.moveTo(fx - 3, cy + 24); g.lineTo(fx + 3, cy + 24); g.lineTo(fx, cy + 42); g.closePath(); g.fill(); }
    } else {
        // Cacodemon
        const grd = g.createRadialGradient(cx, cy - 4, 10, cx, cy, 72);
        grd.addColorStop(0, '#e05a4a'); grd.addColorStop(0.6, '#b22a22'); grd.addColorStop(1, '#6e120e');
        g.fillStyle = grd; g.beginPath(); g.arc(cx, cy, 66, 0, 7); g.fill();
        g.fillStyle = '#8e1c16';
        g.beginPath(); g.moveTo(cx - 58, cy - 20); g.quadraticCurveTo(cx - 92, cy - 50, cx - 70, cy + 6); g.quadraticCurveTo(cx - 80, cy + 20, cx - 54, cy + 10); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(cx + 58, cy - 20); g.quadraticCurveTo(cx + 92, cy - 50, cx + 70, cy + 6); g.quadraticCurveTo(cx + 80, cy + 20, cx + 54, cy + 10); g.closePath(); g.fill();
        const eg = g.createRadialGradient(cx, cy - 12, 1, cx, cy - 12, 26);
        eg.addColorStop(0, '#fff'); eg.addColorStop(0.3, '#ffe24a'); eg.addColorStop(0.7, '#e23a10'); eg.addColorStop(1, 'rgba(120,0,0,0)');
        g.fillStyle = eg; g.beginPath(); g.arc(cx, cy - 12, 26, 0, 7); g.fill();
        g.fillStyle = '#180000'; g.beginPath(); g.arc(cx, cy - 12, 9, 0, 7); g.fill();
        g.fillStyle = '#1a0604'; g.beginPath(); g.ellipse(cx, cy + 30, 34, 22, 0, 0, 7); g.fill();
        g.fillStyle = '#efe7cf';
        for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const mx = cx + Math.cos(a) * 22, my = cy + 30 + Math.sin(a) * 14; g.beginPath(); g.moveTo(mx - 3, cy + 30 + Math.sin(a) * 8); g.lineTo(mx + 3, cy + 30 + Math.sin(a) * 8); g.lineTo(mx, my); g.closePath(); g.fill(); }
    }
    return c;
}
function buildEnemyResources() {
    const loader = new THREE.TextureLoader();
    const load = (uri) => {
        if (!uri) return null;
        const t = loader.load(uri);
        t.encoding = THREE.sRGBEncoding;
        t.anisotropy = 8;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.generateMipmaps = true;
        return t;
    };
    const flashTex = (function () { const s = 64, c = newCanvas(s), gg = c.getContext('2d');
        const gr = gg.createRadialGradient(s / 2, s / 2, 1, s / 2, s / 2, s / 2);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gr.addColorStop(1, 'rgba(255,255,255,0)'); gg.fillStyle = gr; gg.fillRect(0, 0, s, s); return tex(c); })();
    const shadowTex = (function () { const s = 64, c = newCanvas(s), gg = c.getContext('2d');
        const gr = gg.createRadialGradient(s / 2, s / 2, 1, s / 2, s / 2, s / 2);
        gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(0.6, 'rgba(0,0,0,0.28)');
        gr.addColorStop(1, 'rgba(0,0,0,0)'); gg.fillStyle = gr; gg.fillRect(0, 0, s, s); return tex(c); })();
    const F = window.ENEMY_FRAMES || {};
    const res = { frames: {}, flashTex: flashTex, shadowTex: shadowTex, skin: {} };
    for (const type of ['stalker', 'brute', 'sentinel']) {
        const f = F[type] || {};
        res.frames[type] = {
            idle: (f.idle || []).map(load),
            atk: (f.atk || []).map(load),
            die: (f.die || []).map(load)
        };
        const cv = makeMonsterSkinCanvas(SKIN_PALETTE[type]);
        res.skin[type] = { map: tex(cv), normal: tex(makeNormalMap(cv, 2.2), false) };
    }
    return res;
}

const SKIN_PALETTE = {
    stalker: { base: '#5a6b3a', dark: '#2c3a1c', light: '#82904f' },
    brute:   { base: '#7a2a1c', dark: '#360f08', light: '#b14a30' },
    sentinel:{ base: '#6a2a5a', dark: '#320e2c', light: '#90407e' }
};
function makeMonsterSkinCanvas(pal) {
    const S = 128, c = newCanvas(S), g = c.getContext('2d');
    g.fillStyle = pal.base; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 280; i++) {
        const x = Math.random() * S, y = Math.random() * S, r = 2 + Math.random() * 10;
        g.fillStyle = Math.random() < 0.5 ? pal.dark : pal.light;
        g.globalAlpha = 0.10 + Math.random() * 0.18;
        g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    g.globalAlpha = 1;
    for (let i = 0; i < 46; i++) {
        g.strokeStyle = pal.dark; g.globalAlpha = 0.35; g.lineWidth = 1;
        const x = Math.random() * S, y = Math.random() * S;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + (Math.random() - 0.5) * 18, y + (Math.random() - 0.5) * 18); g.stroke();
    }
    g.globalAlpha = 1;
    return c;
}

function M(o) {
    o = o || {};
    const m = new THREE.MeshStandardMaterial({
        color: o.color !== undefined ? o.color : 0xffffff,
        map: o.map || null,
        normalMap: o.normal || null,
        roughness: o.rough === undefined ? 0.65 : o.rough,
        metalness: o.metal === undefined ? 0.1 : o.metal
    });
    if (o.emi) { m.emissive = new THREE.Color(o.emi); m.emissiveIntensity = o.ei === undefined ? 1.0 : o.ei; }
    return m;
}

// Echtes 3D-Monster aus Primitiven (organisch, texturiert, animierbar)
function buildMonster(type, R) {
    const group = new THREE.Group();
    const parts = { mats: [], baseEmissive: new Map(), baseEmissiveColor: new Map() };
    const reg = (mesh) => {
        parts.mats.push(mesh.material);
        parts.baseEmissive.set(mesh.material, mesh.material.emissiveIntensity || 0);
        parts.baseEmissiveColor.set(mesh.material, mesh.material.emissive.clone());
        return mesh;
    };
    const sk = (R && R.skin && R.skin[type]) ? R.skin[type] : { map: null, normal: null };
    const skinMat = () => M({ map: sk.map, normal: sk.normal, color: 0xffffff, rough: 0.72, metal: 0.04 });
    const eyeMat = () => M({ emi: type === 'brute' ? 0xff3a1a : type === 'sentinel' ? 0xffe23a : 0xff7a1a, ei: 2.6, rough: 0.4, metal: 0 });
    const boneMat = () => M({ color: 0xe8e0d0, rough: 0.45, metal: 0.05 });
    const hornMat = () => M({ color: 0x140a06, rough: 0.5, metal: 0.1 });

    if (type === 'stalker') {
        const torso = reg(new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 14), skinMat()));
        torso.scale.set(1.1, 1.35, 0.7); torso.position.y = 0.6; group.add(torso);
        const head = reg(new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 14), skinMat())); head.position.y = 1.0; group.add(head);
        const le = reg(new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), eyeMat())); le.position.set(-0.07, 1.02, 0.14); group.add(le);
        const re = reg(new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), eyeMat())); re.position.set(0.07, 1.02, 0.14); group.add(re);
        for (const sx of [-1, 1]) {
            const h = reg(new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 8), hornMat()));
            h.position.set(sx * 0.08, 1.12, 0); h.rotation.z = sx * 0.4; group.add(h);
        }
        const armGeo = new THREE.CylinderGeometry(0.05, 0.075, 0.42, 10);
        const lArm = new THREE.Group(); lArm.position.set(-0.26, 0.82, 0);
        const lArmM = reg(new THREE.Mesh(armGeo, skinMat())); lArmM.position.y = -0.21; lArm.add(lArmM);
        const lc = reg(new THREE.Mesh(new THREE.SphereGeometry(0.07, 9, 8), skinMat())); lc.position.y = -0.44; lArm.add(lc);
        for (let i = 0; i < 3; i++) { const cl = reg(new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.09, 6), hornMat())); cl.position.set(-0.04 + i * 0.04, -0.5, 0.03); cl.rotation.x = Math.PI; lArm.add(cl); }
        group.add(lArm);
        const rArm = new THREE.Group(); rArm.position.set(0.26, 0.82, 0);
        const rArmM = reg(new THREE.Mesh(armGeo, skinMat())); rArmM.position.y = -0.21; rArm.add(rArmM);
        const rc = reg(new THREE.Mesh(new THREE.SphereGeometry(0.07, 9, 8), skinMat())); rc.position.y = -0.44; rArm.add(rc);
        for (let i = 0; i < 3; i++) { const cl = reg(new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.09, 6), hornMat())); cl.position.set(-0.04 + i * 0.04, -0.5, 0.03); cl.rotation.x = Math.PI; rArm.add(cl); }
        group.add(rArm);
        const legGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.42, 10);
        const lLeg = new THREE.Group(); lLeg.position.set(-0.12, 0.32, 0);
        const lLegM = reg(new THREE.Mesh(legGeo, skinMat())); lLegM.position.y = -0.21; lLeg.add(lLegM); group.add(lLeg);
        const rLeg = new THREE.Group(); rLeg.position.set(0.12, 0.32, 0);
        const rLegM = reg(new THREE.Mesh(legGeo, skinMat())); rLegM.position.y = -0.21; rLeg.add(rLegM); group.add(rLeg);
        parts.leftArm = lArm; parts.rightArm = rArm; parts.leftLeg = lLeg; parts.rightLeg = rLeg;
    } else if (type === 'brute') {
        const torso = reg(new THREE.Mesh(new THREE.SphereGeometry(0.4, 18, 16), skinMat()));
        torso.scale.set(1.15, 1.25, 0.85); torso.position.y = 0.95; group.add(torso);
        for (const sx of [-1, 1]) { const sh = reg(new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), skinMat())); sh.position.set(sx * 0.38, 1.12, 0); group.add(sh); }
        const head = reg(new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 14), skinMat())); head.position.y = 1.5; group.add(head);
        const le = reg(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), eyeMat())); le.position.set(-0.1, 1.53, 0.2); group.add(le);
        const re = reg(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), eyeMat())); re.position.set(0.1, 1.53, 0.2); group.add(re);
        const mouth = reg(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.08), M({ color: 0x180604, rough: 0.6 }))); mouth.position.set(0, 1.42, 0.22); group.add(mouth);
        for (let i = -1; i <= 1; i++) { const f = reg(new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 6), boneMat())); f.position.set(i * 0.06, 1.40, 0.26); f.rotation.x = Math.PI; group.add(f); }
        for (const sx of [-1, 1]) { const h = reg(new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.36, 10), hornMat())); h.position.set(sx * 0.16, 1.72, 0); h.rotation.z = sx * 0.5; group.add(h); }
        const rune = reg(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.3, 0.04), M({ emi: 0xff5a2a, ei: 1.4, rough: 0.5 }))); rune.position.set(0, 0.95, 0.34); group.add(rune);
        const armGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.6, 12);
        const lArm = new THREE.Group(); lArm.position.set(-0.46, 1.16, 0);
        const lArmM = reg(new THREE.Mesh(armGeo, skinMat())); lArmM.position.y = -0.3; lArm.add(lArmM);
        const lf = reg(new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), skinMat())); lf.position.y = -0.62; lArm.add(lf);
        for (let i = 0; i < 3; i++) { const cl = reg(new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 6), hornMat())); cl.position.set(-0.06 + i * 0.06, -0.72, 0.05); cl.rotation.x = Math.PI; lArm.add(cl); }
        group.add(lArm);
        const rArm = new THREE.Group(); rArm.position.set(0.46, 1.16, 0);
        const rArmM = reg(new THREE.Mesh(armGeo, skinMat())); rArmM.position.y = -0.3; rArm.add(rArmM);
        const rf = reg(new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), skinMat())); rf.position.y = -0.62; rArm.add(rf);
        for (let i = 0; i < 3; i++) { const cl = reg(new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 6), hornMat())); cl.position.set(-0.06 + i * 0.06, -0.72, 0.05); cl.rotation.x = Math.PI; rArm.add(cl); }
        group.add(rArm);
        const legGeo = new THREE.CylinderGeometry(0.13, 0.17, 0.6, 12);
        const lLeg = new THREE.Group(); lLeg.position.set(-0.18, 0.42, 0);
        const lLegM = reg(new THREE.Mesh(legGeo, skinMat())); lLegM.position.y = -0.3; lLeg.add(lLegM); group.add(lLeg);
        const rLeg = new THREE.Group(); rLeg.position.set(0.18, 0.42, 0);
        const rLegM = reg(new THREE.Mesh(legGeo, skinMat())); rLegM.position.y = -0.3; rLeg.add(rLegM); group.add(rLeg);
        parts.leftArm = lArm; parts.rightArm = rArm; parts.leftLeg = lLeg; parts.rightLeg = rLeg;
    } else {
        const body = reg(new THREE.Mesh(new THREE.SphereGeometry(0.42, 22, 18), skinMat())); body.scale.set(1, 0.92, 1); body.position.y = 0.7; group.add(body);
        const eye = reg(new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 14), eyeMat())); eye.position.set(0, 0.78, 0.36); group.add(eye);
        const pupil = reg(new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), M({ color: 0x000000, rough: 0.3 }))); pupil.position.set(0, 0.78, 0.47); group.add(pupil);
        const mouth = reg(new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 10, 20), M({ emi: 0xff2a4a, ei: 1.4, rough: 0.5 }))); mouth.position.set(0, 0.58, 0.38); mouth.rotation.x = Math.PI / 2; group.add(mouth);
        for (let i = 0; i < 10; i++) {
            const a = i / 10 * Math.PI * 2;
            const ft = reg(new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 6), boneMat()));
            ft.position.set(Math.cos(a) * 0.15, 0.58 + Math.sin(a) * 0.15, 0.42); ft.rotation.set(Math.PI / 2, 0, a); group.add(ft);
        }
        const spikeMat = M({ color: 0x3a1830, emi: 0x300018, ei: 0.4, rough: 0.6 });
        const spikes = [];
        for (let i = 0; i < 8; i++) {
            const sp = reg(new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.24, 8), spikeMat));
            const a = i / 8 * Math.PI * 2;
            sp.position.set(Math.cos(a) * 0.42, 0.7 + Math.sin(a) * 0.42, 0);
            sp.rotation.z = -a + Math.PI / 2; sp.rotation.x = Math.PI / 2; group.add(sp); spikes.push(sp);
        }
        parts.body = body; parts.mouth = mouth; parts.spikes = spikes;
    }
    // Auf die Level-Hoehe (Decke bei y=1.0) zuschneiden, damit nichts durchragt
    group.scale.setScalar(type === 'brute' ? 0.5 : type === 'sentinel' ? 0.8 : 0.82);
    return { group, parts };
}

function makeEnemyMesh(type, R) {
    if (_glbState === 'ready' && _enemyModels && _enemyModels[type]) {
        try { return makeGLBEnemyMesh(type, R); } catch (err) { console.error('GLB enemy failed, fallback', err); }
    }
    return makeProceduralEnemyMesh(type, R);
}

function makeProceduralEnemyMesh(type, R) {
    const T = ENEMY_TYPES[type];
    const g = new THREE.Group();
    // Weicher Boden-Schatten (verankert das Monster am Boden)
    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry((T.r || 0.3) * 3.4, (T.r || 0.3) * 3.4),
        new THREE.MeshBasicMaterial({ map: R ? R.shadowTex : null, color: 0x000000, transparent: true, opacity: 0.8, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    g.add(shadow);
    const built = buildMonster(type, R);
    g.add(built.group);
    g.userData.parts = built.parts;
    g.userData.root = built.group;
    g.userData.type = type;
    g.userData.faded = false;
    return g;
}

function mapEnemyClips(anims) {
    const out = {};
    const names = ['idle', 'walk', 'run', 'attack', 'hit', 'death', 'walk_backward', 'run_backward', 'strafe', 'strafe_left', 'strafe_right', 'turn_left', 'turn_right', 'jump'];
    for (const n of names) {
        const a = anims.find(x => (x.name || '').toLowerCase() === n);
        if (a) out[n] = a;
    }
    if (!out.idle && anims[0]) out.idle = anims[0];
    if (!out.walk) out.walk = out.idle;
    if (!out.attack) out.attack = out.idle;
    if (!out.death) out.death = out.idle;
    return out;
}

function makeGLBEnemyMesh(type, R) {
    const T = ENEMY_TYPES[type];
    const g = new THREE.Group();
    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry((T.r || 0.3) * 3.4, (T.r || 0.3) * 3.4),
        new THREE.MeshBasicMaterial({ map: R ? R.shadowTex : null, color: 0x000000, transparent: true, opacity: 0.8, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    g.add(shadow);

    const m = _enemyModels[type];
    const inst = THREE.SkeletonUtils.clone(m.proto);

    // WICHTIG: Skalierung/Boden-Offset werden NICHT auf "inst" selbst gesetzt,
    // sondern auf einen separaten Wrapper "rig". Grund: der AnimationMixer
    // weiter unten laeuft mit "inst" als Root. Enthaelt irgendeiner der Clips
    // einen Keyframe-Track, der auf den Szenen-Root zielt (z.B. gebackene
    // Root-Motion/-Scale – ein bei exportierten Rigs uebliches Artefakt),
    // ueberschreibt mixer.update() bei JEDEM Frame die auf "inst" gesetzte
    // scale/position wieder, und zwar NACHDEM syncEnemies3D() sie pro Frame
    // gesetzt hat (dort steht mixer.update() bewusst als letzter Schritt).
    // Ohne Animation (statischer Test) tritt das nie auf, weil dort kein
    // Track ausgewertet wird – das erklaert, warum der isolierte Static-Test
    // funktioniert, im echten Spiel (Animation laeuft ab Spawn permanent)
    // aber nicht. "rig" liegt ausserhalb von "inst" und ist fuer den Mixer
    // nicht erreichbar, also dagegen geschuetzt.
    const rig = new THREE.Group();
    rig.rotation.y = MODEL_ROT_Y[type] || 0;
    rig.add(inst);
    rig.updateMatrixWorld(true);

    // Tatsaechliche Groesse ueber ECHTES Skinning messen (THREE.SkinnedMesh.
    // boneTransform), nicht aus der rohen/lokalen Geometrie schaetzen.
    // Grund: es gibt keine einzige Formel, die fuer jede Export-Pipeline
    // stimmt. Bei monster.glb haengen Mesh und Skelett am selben Vorfahren
    // (Armature) - die "attached"-Bindemodus-Selbstkorrektur kuerzt dessen
    // Scale/Rotation komplett heraus, die rohe lokale Geometrie ist bereits
    // die richtige Referenzgroesse. Bei stalker/brute/sentinel (Demon.glb)
    // haengen Mesh (eigene scale=47.88) und Skelett-Armature (scale=100)
    // an VERSCHIEDENEN Vorfahren mit unterschiedlichem Scale-Faktor - die
    // Selbstkorrektur kuerzt das NICHT vollstaendig heraus, die rohe lokale
    // Geometrie waere um den Faktor ~100+ falsch. Einzige robuste Methode:
    // tatsaechlich ein paar hundert Vertices skinnen und nachmessen.
    let sizeY = 0, rawMinY = Infinity;
    let skinnedForMeasure = null;
    inst.traverse(o => { if (o.isSkinnedMesh && !skinnedForMeasure) skinnedForMeasure = o; });
    if (skinnedForMeasure && typeof skinnedForMeasure.boneTransform === 'function') {
        const posAttr = skinnedForMeasure.geometry.attributes.position;
        const step = Math.max(1, Math.floor(posAttr.count / 300));
        const v = new THREE.Vector3();
        let minY = Infinity, maxY = -Infinity;
        for (let i = 0; i < posAttr.count; i += step) {
            skinnedForMeasure.boneTransform(i, v);
            v.applyMatrix4(skinnedForMeasure.matrixWorld);
            if (isFinite(v.y)) { if (v.y < minY) minY = v.y; if (v.y > maxY) maxY = v.y; }
        }
        if (isFinite(minY) && isFinite(maxY)) { sizeY = maxY - minY; rawMinY = minY; }
    }
    if (!(sizeY > 0)) {
        // Fallback fuer nicht-geskinnte (statische) Meshes bzw. falls
        // boneTransform() nicht verfuegbar sein sollte: normale lokale BBox.
        inst.traverse(o => {
            if (o.isMesh && o.geometry) {
                if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                const bb = o.geometry.boundingBox;
                if (bb) {
                    const h = bb.max.y - bb.min.y;
                    if (isFinite(h) && h > sizeY) sizeY = h;
                    if (isFinite(bb.min.y) && bb.min.y < rawMinY) rawMinY = bb.min.y;
                }
            }
        });
    }
    const targetH = MODEL_TARGET_H[type] || 0.95;
    if (!(sizeY > 0) || !isFinite(sizeY)) sizeY = targetH;      // sicherer Fallback
    const sc = targetH / sizeY;
    rig.scale.setScalar(isFinite(sc) ? sc : 1);
    rig.updateMatrixWorld(true);
    // rawMinY wurde bei rig.scale=1 (und rig.position=0) gemessen, daher
    // skaliert sc*rawMinY korrekt auf die finale Fuss-Position.
    let footY = isFinite(rawMinY) ? sc * rawMinY : 0;
    if (!isFinite(footY)) footY = 0;
    rig.position.y -= footY;
    if (!isFinite(rig.position.y)) rig.position.y = 0;
    g.userData.baseY = isFinite(rig.position.y) ? rig.position.y : 0;
    rig.updateMatrixWorld(true);
    // frustumCulled=false: bei animierten SkinnedMeshes basiert die
    // Standard-Culling-BoundingSphere auf der statischen Bind-Pose-Geometrie
    // und wird durch Bone-Animation nicht aktualisiert. KEIN eigenes
    // o.bind(o.skeleton, o.matrixWorld) mehr hier (das war der eigentliche
    // Bug): das ueberschreibt bindMatrix mit einem Wert, der zu den bereits
    // exportierten skeleton.boneInverses nicht mehr passt, sobald rig/g
    // skaliert oder verschoben sind – Ergebnis war das "verkorkste Skelett".
    // Im Standard-Bindemodus "attached" (Default) ist gar kein eigenes
    // Rebind noetig, THREE haelt bindMatrixInverse automatisch aktuell.
    inst.traverse(o => { if (o.isSkinnedMesh) o.frustumCulled = false; });
    console.log('[enemy-mesh] type=' + type + ' geomH=' + sizeY.toFixed(4) + ' targetH=' + targetH + ' scale=' + sc.toFixed(4) + ' posY=' + rig.position.y.toFixed(4));

    const AURA = { stalker: 0xff7a1a, sentinel: 0xb44cff, brute: 0x39ff5a }[type] || null;
    const matMap = new Map();
    inst.traverse(o => {
        if (o.isMesh) {
            o.castShadow = true; o.receiveShadow = false;
            let cm = matMap.get(o.material);
            if (!cm) { cm = o.material.clone(); matMap.set(o.material, cm); }
            o.material = cm;
            if (AURA != null && cm.emissive) {
                cm.emissive = new THREE.Color(AURA);
                cm.emissiveIntensity = 0.28;
                if (cm.color) cm.color.lerp(new THREE.Color(AURA), 0.25);
            }
        }
    });
    const parts = { mats: [], baseEmissive: new Map(), baseEmissiveColor: new Map(), mixer: null, actions: {}, current: 'idle' };
    for (const cm of matMap.values()) {
        parts.mats.push(cm);
        parts.baseEmissive.set(cm, cm.emissiveIntensity || 0);
        parts.baseEmissiveColor.set(cm, cm.emissive.clone());
    }
    g.add(rig);

    if (m.clips && m.clips.idle) {
        const mixer = new THREE.AnimationMixer(inst);
        const mk = (c) => { const a = mixer.clipAction(c); a.enabled = true; return a; };
        const clipMap = { idle: m.clips.idle, walk: m.clips.walk, run: m.clips.run, attack: m.clips.attack, hit: m.clips.hit, dead: m.clips.death };
        const actions = {};
        for (const k in clipMap) { if (clipMap[k]) actions[k] = mk(clipMap[k]); }
        if (actions.idle) actions.idle.setLoop(THREE.LoopRepeat, Infinity);
        if (actions.walk) actions.walk.setLoop(THREE.LoopRepeat, Infinity);
        if (actions.run) actions.run.setLoop(THREE.LoopRepeat, Infinity);
        if (actions.attack) { actions.attack.setLoop(THREE.LoopOnce, 1); actions.attack.clampWhenFinished = true; }
        if (actions.hit) { actions.hit.setLoop(THREE.LoopOnce, 1); actions.hit.clampWhenFinished = true; }
        if (actions.dead) { actions.dead.setLoop(THREE.LoopOnce, 1); actions.dead.clampWhenFinished = true; }
        (actions.idle || actions.walk || actions.run).play();
        parts.mixer = mixer; parts.actions = actions;
    }

    g.userData.parts = parts;
    g.userData.root = rig;
    g.userData.type = type;
    g.userData.faded = false;
    return g;
}

function b64ToArrayBuffer(b64) {
    const bin = atob(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
}

function loadEnemyGLBs() {
    if (!window.ENEMY_GLBS || typeof THREE.GLTFLoader === 'undefined') {
        _glbState = 'failed';
        if (_3d && enemies.length) buildEnemyMeshes();
        return;
    }
    if (!_gltfLoader) _gltfLoader = new THREE.GLTFLoader();
    _glbState = 'loading';
    const types = Object.keys(window.ENEMY_GLBS);
    _enemyModels = {};
    let remaining = types.length;
    const done = () => {
        remaining--;
        if (remaining <= 0) {
            _glbState = 'ready';
            if (typeof enemies !== 'undefined' && enemies.length) buildEnemyMeshes();
        }
    };
    for (const t of types) {
        const ab = b64ToArrayBuffer(window.ENEMY_GLBS[t]);
        _gltfLoader.parse(ab, '', (gltf) => {
            const anims = gltf.animations || [];
            const clips = mapEnemyClips(anims);
            _enemyModels[t] = { proto: gltf.scene, clips };
            done();
        }, (err) => {
            console.error('GLB parse failed', t, err);
            _enemyModels[t] = null;
            done();
        });
    }
}

// Versucht pro Gegnertyp eine externe GLB aus models/<type>.glb zu laden.
// Bei file:// (kein fetch) oder fehlender Datei bleibt das eingebettete
// Fallback-Modell erhalten. Neue Gegner brauchen nur eine ENEMY_TYPES-Datei
// und eine gleichnamige .glb hier.
function loadExternalEnemyModels() {
    if (!_gltfLoader) _gltfLoader = new THREE.GLTFLoader();
    const types = (typeof ENEMY_TYPES !== 'undefined') ? Object.keys(ENEMY_TYPES) : [];
    if (!types.length) return;
    for (const t of types) {
        (function (type) {
            const url = 'models/' + type + '.glb';
            fetch(url)
                .then(r => { if (!r.ok) throw new Error('missing'); return r.arrayBuffer(); })
                .then(ab => {
                    _gltfLoader.parse(ab, '', (gltf) => {
                        const anims = gltf.animations || [];
                        const clips = mapEnemyClips(anims);
                        if (!_enemyModels) _enemyModels = {};
                        _enemyModels[type] = { proto: gltf.scene, clips };
                        if (_glbState !== 'ready') _glbState = 'ready';
                        if (_3d) buildEnemyMeshes();
                        console.log('[models] external GLB loaded for', type);
                    }, (err) => { console.warn('[models] external parse failed', type, err); });
                })
                .catch(() => { /* keine externe Datei: eingebettetes Fallback bleibt */ });
        })(t);
    }
}

function disposeEnemyMesh(g) {
    const p = g.userData.parts;
    if (p && p.mats) for (const mm of p.mats) { try { mm.dispose(); } catch (e) {} }
}

function buildEnemyMeshes() {
    if (!_3d) return;
    const d = _3d;
    for (const g of d.enemyPool) { d.scene.remove(g); disposeEnemyMesh(g); }
    d.enemyPool.length = 0;
    for (let i = 0; i < enemies.length; i++) {
        const g = makeEnemyMesh(enemies[i].type, ENEMY_RES);
        d.scene.add(g);
        d.enemyPool[i] = g;
    }
}

/* ---------- Item: Med-Station (3D) ---------- */
function buildItemResources() {
    const glowTex = (function () { const s = 64, c = newCanvas(s), gg = c.getContext('2d');
        const gr = gg.createRadialGradient(s / 2, s / 2, 1, s / 2, s / 2, s / 2);
        gr.addColorStop(0, 'rgba(130,255,200,0.9)'); gr.addColorStop(0.4, 'rgba(60,255,150,0.35)');
        gr.addColorStop(1, 'rgba(0,255,140,0)'); gg.fillStyle = gr; gg.fillRect(0, 0, s, s); return tex(c); })();
    return {
        base: new THREE.MeshStandardMaterial({ color: 0x20262e, roughness: 0.6, metalness: 0.5 }),
        glow: new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x33ff88, emissiveIntensity: 2.0 }),
        glowTex: glowTex,
        light: new THREE.PointLight(0x33ff88, 0.5, 4, 2)
    };
}
function makeItemMesh(R) {
    const g = new THREE.Group();
    // NEUES, frisches Health-Design: schwebendes gruenes Kreuz mit pulsierendem Kern + Ring
    const cross = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
        color: 0x0c2a1a, emissive: 0x33ff88, emissiveIntensity: 2.8, roughness: 0.3, metalness: 0.15
    });
    const cv = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.46, 0.14), mat); cv.position.y = 0;
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.14, 0.14), mat); ch.position.y = 0;
    cross.add(cv); cross.add(ch);
    // pulsierender Kern
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 12),
        new THREE.MeshStandardMaterial({ color: 0x093, emissive: 0x88ffcc, emissiveIntensity: 3.2, roughness: 0.25 }));
    cross.add(core);
    // rotierender Ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.022, 8, 30),
        new THREE.MeshStandardMaterial({ color: 0x06251a, emissive: 0x33ff88, emissiveIntensity: 1.6, roughness: 0.4 }));
    ring.rotation.x = Math.PI / 2;
    cross.add(ring);
    cross.position.y = 0.72;
    g.add(cross);
    // weicher Glow-Halo
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: R.glowTex, color: 0x33ff88, transparent: true, opacity: 0.6,
        depthWrite: false, blending: THREE.AdditiveBlending
    }));
    halo.scale.set(1.35, 1.35, 1); halo.position.y = 0.72; g.add(halo);
    R.light.position.y = 0.72; g.add(R.light);
    g.userData.spin = cross;
    g.userData.ring = ring;
    g.userData.core = core;
    g.userData.halo = halo;
    g.scale.setScalar(0.5);
    return g;
}

/* ---------- Waffe (3D-Viewmodel) ---------- */
function buildWeaponResources() {
    return {
        metal: new THREE.MeshStandardMaterial({ color: 0x2a2f37, roughness: 0.4, metalness: 0.8 }),
        dark: new THREE.MeshStandardMaterial({ color: 0x14171c, roughness: 0.6, metalness: 0.5 }),
        core: new THREE.MeshStandardMaterial({ color: 0x150a00, emissive: 0xffaa22, emissiveIntensity: 2.4, roughness: 0.3 })
    };
}
function makeWeaponMesh(R) {
    const g = new THREE.Group();
    const add = (geo, mat, x, y, z, rx, ry, rz) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        if (rx || ry || rz) m.rotation.set(rx || 0, ry || 0, rz || 0);
        g.add(m); return m;
    };
    // Receiver
    add(new THREE.BoxGeometry(0.13, 0.13, 0.56), R.metal, 0, 0.02, -0.3);
    add(new THREE.BoxGeometry(0.1, 0.08, 0.5), R.dark, 0, -0.04, -0.3);
    // Pistolgriff (schraeg)
    const grip = add(new THREE.BoxGeometry(0.1, 0.22, 0.12), R.dark, 0, -0.16, -0.06, 0.32, 0, 0);
    // Schulterstuetz (stock)
    add(new THREE.BoxGeometry(0.09, 0.11, 0.26), R.dark, 0, -0.01, 0.12);
    add(new THREE.BoxGeometry(0.05, 0.08, 0.12), R.metal, 0, 0.02, 0.02);
    // Lauf + Shroud
    add(new THREE.CylinderGeometry(0.045, 0.05, 0.6, 16), R.metal, 0, 0.03, -0.72, Math.PI / 2, 0, 0);
    add(new THREE.CylinderGeometry(0.075, 0.075, 0.34, 16, 1, true), R.dark, 0, 0.03, -0.62, Math.PI / 2, 0, 0);
    add(new THREE.TorusGeometry(0.062, 0.02, 8, 18), R.metal, 0, 0.03, -0.46, Math.PI / 2, 0, 0);
    // Magazin
    add(new THREE.BoxGeometry(0.09, 0.2, 0.13), R.dark, 0, -0.16, -0.28, 0.12, 0, 0);
    // Top-Rail + Visier
    add(new THREE.BoxGeometry(0.04, 0.04, 0.46), R.metal, 0, 0.1, -0.26);
    add(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12), R.metal, 0, 0.15, -0.4, Math.PI / 2, 0, 0);
    add(new THREE.SphereGeometry(0.038, 12, 10), R.core, 0, 0.15, -0.51);
    // Frontgriff
    add(new THREE.BoxGeometry(0.05, 0.13, 0.06), R.dark, 0, -0.11, -0.56, 0.3, 0, 0);
    // Seiten-Schienen
    add(new THREE.BoxGeometry(0.02, 0.05, 0.34), R.metal, 0.075, 0.03, -0.34);
    add(new THREE.BoxGeometry(0.02, 0.05, 0.34), R.metal, -0.075, 0.03, -0.34);
    // Plasma-Kern + Spulen
    add(new THREE.SphereGeometry(0.05, 12, 10), R.core, 0, 0.06, -0.2);
    add(new THREE.TorusGeometry(0.055, 0.016, 8, 18), R.core, 0, 0.06, -0.36, Math.PI / 2, 0, 0);
    add(new THREE.TorusGeometry(0.06, 0.018, 8, 18), R.core, 0, 0.03, -0.78, Math.PI / 2, 0, 0); // Mündungsring
    return g;
}

/* ---------- HQ-Texturen (Wand, Objekte) ---------- */
function makeWallTexture3D(t, alt) {
    const S = 256, c = newCanvas(S), g = c.getContext('2d');
    if (t === 6) {
        // Fenster: Himmel/Aussenansicht statt Metallplatten-Musterung
        const sky = g.createLinearGradient(0, 0, 0, S);
        sky.addColorStop(0, '#7fa8c9'); sky.addColorStop(0.45, '#d7b884'); sky.addColorStop(0.75, '#e8c896'); sky.addColorStop(1, '#c99a5a');
        g.fillStyle = sky; g.fillRect(0, 0, S, S);
        const sunX = alt ? 190 : 70;
        const sun = g.createRadialGradient(sunX, 150, 4, sunX, 150, 70);
        sun.addColorStop(0, 'rgba(255,240,210,0.95)'); sun.addColorStop(1, 'rgba(255,240,210,0)');
        g.fillStyle = sun; g.fillRect(0, 0, S, S);
        // ferne Silhouetten einer Industrieanlage
        g.fillStyle = 'rgba(50,42,30,0.55)';
        g.fillRect(10, 190, 26, 40); g.fillRect(44, 170, 18, 60); g.fillRect(70, 200, 34, 30);
        g.fillRect(140, 185, 22, 45); g.fillRect(170, 165, 16, 65); g.fillRect(196, 195, 40, 35);
        g.fillStyle = 'rgba(50,42,30,0.4)'; g.fillRect(60, 150, 4, 90); g.fillRect(182, 140, 4, 100);
        g.fillStyle = 'rgba(30,24,16,0.7)'; g.fillRect(0, 224, S, 32);
        // Rahmen + Sprossen
        g.strokeStyle = '#241d14'; g.lineWidth = 16; g.strokeRect(8, 8, S - 16, S - 16);
        g.strokeStyle = '#3a2f20'; g.lineWidth = 6;
        g.beginPath(); g.moveTo(S / 2, 8); g.lineTo(S / 2, S - 8); g.stroke();
        g.beginPath(); g.moveTo(8, S / 2); g.lineTo(S - 8, S / 2); g.stroke();
        return c;
    }
    const base = ({ 1: alt ? '#3d3829' : '#4c4636', 2: alt ? '#3c3830' : '#48443a', 3: alt ? '#463f34' : '#403a30', 4: alt ? '#332e22' : '#3b3527', 5: alt ? '#332f26' : '#3a362c' })[t] || '#4c4636';
    g.fillStyle = base; g.fillRect(0, 0, S, S);
    const tiles = 2, ts = S / tiles;
    for (let i = 0; i < tiles; i++) for (let j = 0; j < tiles; j++) {
        const x = i * ts, y = j * ts;
        g.fillStyle = 'rgba(255,255,255,0.04)'; g.fillRect(x + 4, y + 4, ts - 8, ts - 8);
        g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(x + 4, y + ts - 12, ts - 8, 8);
        g.fillStyle = 'rgba(210,195,160,0.3)';
        [[x + 12, y + 12], [x + ts - 16, y + 12], [x + 12, y + ts - 16], [x + ts - 16, y + ts - 16]].forEach(([bx, by]) => {
            g.fillRect(bx, by, 5, 5); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(bx + 3, by + 3, 2, 2); g.fillStyle = 'rgba(210,195,160,0.3)';
        });
    }
    for (let i = 0; i < 2200; i++) {
        const v = Math.random();
        g.fillStyle = v < 0.5 ? 'rgba(0,0,0,' + (Math.random() * 0.18) + ')' : 'rgba(160,145,115,' + (Math.random() * 0.04) + ')';
        g.fillRect(Math.random() * S, Math.random() * S, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    if (t === 2) {
        g.fillStyle = '#11161c'; for (let yy = 40; yy < S - 40; yy += 14) g.fillRect(20, yy, S - 40, 7);
    } else if (t === 3) {
        g.fillStyle = '#1a1a14'; g.fillRect(0, S / 2 - 18, S, 36);
        for (let xx = 0; xx < S; xx += 28) { g.fillStyle = '#d9b021'; g.beginPath(); g.moveTo(xx, S / 2 - 18); g.lineTo(xx + 14, S / 2 - 18); g.lineTo(xx + 14 - 14, S / 2 + 18); g.lineTo(xx - 14, S / 2 + 18); g.closePath(); g.fill(); }
    } else if (t === 4) {
        g.strokeStyle = '#0e1620'; g.lineWidth = 10; g.beginPath(); g.moveTo(S / 2, 0); g.bezierCurveTo(S / 2 + 40, S / 3, S / 2 - 40, 2 * S / 3, S / 2, S); g.stroke();
    } else if (t === 5) {
        g.strokeStyle = '#0e1216'; g.lineWidth = 14; for (let xx = 30; xx < S; xx += 46) { g.beginPath(); g.moveTo(xx, 0); g.lineTo(xx, S); g.stroke(); }
    } else {
        g.fillStyle = '#0b1015'; g.fillRect(alt ? 120 : 24, 40, 80, 60);
        g.fillStyle = alt ? 'rgba(255,150,60,0.8)' : 'rgba(255,176,46,0.8)';
        g.fillRect(alt ? 128 : 32, 50, 24, 8); g.fillRect(alt ? 140 : 44, 50, 40, 4); g.fillRect(alt ? 128 : 32, 66, 56, 4);
        g.strokeStyle = '#141a20'; g.lineWidth = 8; g.beginPath(); g.moveTo(132, 0); g.bezierCurveTo(120, 90, 150, 170, 132, 256); g.stroke();
    }
    return c;
}

function makeWallEmissive3D(t, alt) {
    const S = 256, c = newCanvas(S), g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, S, S);
    if (t === 6) {
        const sky = g.createLinearGradient(0, 0, 0, S);
        sky.addColorStop(0, 'rgba(140,180,220,0.5)'); sky.addColorStop(0.6, 'rgba(255,210,150,0.7)'); sky.addColorStop(1, 'rgba(255,180,110,0.6)');
        g.fillStyle = sky; g.fillRect(10, 10, S - 20, S - 20);
        return c;
    }
    if (t === 4) { g.fillStyle = 'rgba(255,190,60,0.9)'; g.fillRect(S / 2 - 5, 10, 10, 236); }
    if (t === 1 || t === 5) {
        g.strokeStyle = alt ? 'rgba(255,140,40,0.5)' : 'rgba(255,190,60,0.5)'; g.lineWidth = 4;
        g.beginPath(); g.moveTo(8, 8); g.lineTo(S - 8, 8); g.lineTo(S - 8, S - 8); g.lineTo(8, S - 8); g.closePath(); g.stroke();
    }
    if (t === 4) { g.fillStyle = 'rgba(255,140,40,0.6)'; g.fillRect(alt ? 128 : 32, 50, 24, 8); }
    return c;
}

function buildPropTextures() {
    const S = 256;
    const crate = newCanvas(S), g = crate.getContext('2d');
    g.fillStyle = '#5a4632'; g.fillRect(0, 0, S, S);
    g.fillStyle = 'rgba(0,0,0,0.3)'; for (let i = 0; i < 1500; i++) g.fillRect(Math.random() * S, Math.random() * S, 2, 2);
    g.strokeStyle = '#2c2114'; g.lineWidth = 10; g.strokeRect(8, 8, S - 16, S - 16);
    g.lineWidth = 4; g.beginPath(); g.moveTo(8, 8); g.lineTo(S - 8, S - 8); g.moveTo(S - 8, 8); g.lineTo(8, S - 8); g.stroke();
    g.fillStyle = '#c9b48a'; g.fillRect(S / 2 - 40, S / 2 - 26, 80, 52);
    g.fillStyle = '#7a5a32'; g.font = 'bold 30px monospace'; g.fillText('7G', S / 2 - 24, S / 2 + 10);
    const barrel = newCanvas(S), gb = barrel.getContext('2d');
    gb.fillStyle = '#7a3326'; gb.fillRect(0, 0, S, S);
    gb.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 1400; i++) gb.fillRect(Math.random() * S, Math.random() * S, 2, 2);
    gb.fillStyle = '#d9b021'; for (let yy = 40; yy < S; yy += 70) gb.fillRect(0, yy, S, 26);
    gb.fillStyle = '#1a1a14'; for (let yy = 46; yy < S; yy += 70) for (let xx = 0; xx < S; xx += 30) gb.fillRect(xx, yy, 20, 14);
    const pipe = newCanvas(S), gp = pipe.getContext('2d');
    gp.fillStyle = '#3a424c'; gp.fillRect(0, 0, S, S);
    gp.fillStyle = 'rgba(255,255,255,0.08)'; gp.fillRect(0, 20, S, 40);
    gp.fillStyle = 'rgba(0,0,0,0.3)'; gp.fillRect(0, S - 50, S, 40);
    gp.strokeStyle = '#11151a'; gp.lineWidth = 12; gp.beginPath(); gp.moveTo(S / 2, 0); gp.lineTo(S / 2, S); gp.stroke();
    return { crate: tex(crate), barrel: tex(barrel), pipe: tex(pipe) };
}

/* ---------- Init ---------- */
function init3D() {
    const RW = canvas.clientWidth || 800, RH = canvas.clientHeight || 500;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(RW, RH, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x0a0805, 1);

    const scene = new THREE.Scene();
    // Black-Mesa-Stil: warmer, staubiger Beton-/Rost-Dunst statt kuehlem Sci-Fi-Blau.
    scene.fog = new THREE.FogExp2(0x0f0b06, 0.05);

    const camera = new THREE.PerspectiveCamera(72, RW / RH, 0.05, 220);
    camera.rotation.order = 'YXZ';

    // Licht: dunkel + Taschenlampe (Spot) mit Schatten.
    // Ambient/Hemisphere auf warmes Natriumdampf-/Gluehbirnenlicht umgestellt
    // (vorher kuehles Blau-Cyan); Taschenlampe von LED-Weiss auf warmes
    // Gluehlicht.
    scene.add(new THREE.AmbientLight(0x18130a, 0.22));
    scene.add(new THREE.HemisphereLight(0x4a3a20, 0x0a0704, 0.35));

    const flash = new THREE.SpotLight(0xffe6b8, 2.4, 24, 0.72, 0.4, 1.1);
    flash.position.set(0, 0, 0);
    flash.castShadow = true;
    flash.shadow.mapSize.set(1024, 1024);
    flash.shadow.camera.near = 0.4;
    flash.shadow.camera.far = 24;
    flash.shadow.bias = -0.0006;
    camera.add(flash);
    const flashTarget = new THREE.Object3D();
    flashTarget.position.set(0, 0, -1);
    camera.add(flashTarget);
    flash.target = flashTarget;
    const fill = new THREE.PointLight(0x4a3a20, 0.18, 7, 2);
    camera.add(fill);
    scene.add(camera);

    // Materialien Waende
    const wallMat = {};
    for (let t = 1; t <= 6; t++) {
        wallMat[t] = [0, 1].map(alt => {
            const col = makeWallTexture3D(t, alt);
            const nrm = makeNormalMap(col, 2.6);
            const emi = makeWallEmissive3D(t, alt);
            return new THREE.MeshStandardMaterial({
                map: tex(col), normalMap: tex(nrm, false),
                emissiveMap: tex(emi, false), emissive: 0xffffff, emissiveIntensity: 0.9,
                roughness: 0.8, metalness: 0.3,
                normalScale: new THREE.Vector2(0.8, 0.8)
            });
        });
    }
    const floorCol = makeFloorTexture(false), floorN = makeNormalMap(floorCol, 1.3);
    const ceilCol = makeFloorTexture(true), ceilN = makeNormalMap(ceilCol, 1.0);
    const floorMat = new THREE.MeshStandardMaterial({ map: tex(floorCol), normalMap: tex(floorN, false), roughness: 0.92, metalness: 0.12 });
    const ceilMat = new THREE.MeshStandardMaterial({ map: tex(ceilCol), normalMap: tex(ceilN, false), roughness: 0.95, metalness: 0.1 });
    floorMat.map.repeat.set(MW, MH); floorMat.normalMap.repeat.set(MW, MH);
    ceilMat.map.repeat.set(MW, MH); ceilMat.normalMap.repeat.set(MW, MH);

    const world = new THREE.Group();
    scene.add(world);
    const mats = { wallMat, floorMat, ceilMat };

    // (Welt-Geometrie wird in buildWorldGroup() aufgebaut – pro Level neu)

    // Ressourcen + Pools
    ENEMY_RES = buildEnemyResources();
    ITEM_RES = buildItemResources();
    WEAPON_RES = buildWeaponResources();

    // Waffe am Kamera
    const weapon = makeWeaponMesh(WEAPON_RES);
    weapon.position.set(0.32, -0.26, -0.6);
    camera.add(weapon);
    const muzzleLight = new THREE.PointLight(0xffc978, 0, 6, 2);
    muzzleLight.position.set(0, 0.03, -0.85); weapon.add(muzzleLight);
    const muzzleSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: (function () { const s = 64, c = newCanvas(s), g = c.getContext('2d');
            const gr = g.createRadialGradient(s / 2, s / 2, 1, s / 2, s / 2, s / 2);
            gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,200,120,0.8)');
            gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s); return tex(c); })(),
        color: 0xffc978, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    muzzleSprite.scale.set(0.5, 0.5, 1); muzzleSprite.position.set(0, 0.03, -0.9);
    muzzleSprite.visible = false; weapon.add(muzzleSprite);

    // Tracer
    const tracerGeo = new THREE.BufferGeometry();
    tracerGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 2 * 96), 3));
    const tracerLines = new THREE.LineSegments(tracerGeo, new THREE.LineBasicMaterial({
        color: 0xffc978, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending
    }));
    tracerLines.frustumCulled = false; scene.add(tracerLines);

    // Partikel (Points)
    const MAXP = 700;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAXP * 3), 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAXP * 3), 3));
    const pMat = new THREE.PointsMaterial({
        size: 0.16, map: (function () { const s = 32, c = newCanvas(s), g = c.getContext('2d');
            const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
            gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
            g.fillStyle = gr; g.fillRect(0, 0, s, s); return tex(c); })(),
        vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const points = new THREE.Points(pGeo, pMat); points.frustumCulled = false; scene.add(points);

    // Post-Processing: Bloom (mit sicherem Fallback)
    let composer = null;
    try {
        if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass && THREE.ShaderPass) {
            composer = new THREE.EffectComposer(renderer);
            composer.addPass(new THREE.RenderPass(scene, camera));
            // Weniger/gezielteres Gluehen als vorher: Black-Mesa-Look setzt auf
            // vereinzelte heisse Lichtquellen (Notlicht, Funken), nicht auf
            // durchgehendes Neon-Gluehen.
            const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(RW, RH), 0.5, 0.4, 0.75);
            composer.addPass(bloom);
            if (composer.setPixelRatio) composer.setPixelRatio(renderer.getPixelRatio());
        }
    } catch (e) { composer = null; }

    _3d = {
        renderer, scene, camera, flash, fill, weapon, muzzleLight, muzzleSprite, composer,
        tracerLines, points, pGeo, MAXP,
        world, mats, lightPanels: [], goalMesh: null,
        enemyPool: [], itemPool: [], projPool: [], boomPool: [],
        weaponBaseZ: -0.6
    };
    loadEnemyGLBs();
    loadExternalEnemyModels();
    buildWorldGroup();

    window.addEventListener('resize', () => {
        const w = canvas.clientWidth || 800, h = canvas.clientHeight || 500;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
        if (composer && composer.setSize) composer.setSize(w, h);
    });
}

function buildWorldGroup() {
    const d = _3d; if (!d || !d.world) return;
    const world = d.world, mats = d.mats;
    world.clear();
    const wallMat = mats.wallMat, floorMat = mats.floorMat, ceilMat = mats.ceilMat;
    const lightPanels = [];

    // Waende als InstancedMesh pro (Typ,Alt)
    const wallGeo = new THREE.BoxGeometry(1, WALL_H, 1);
    const counts = {};
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        const wt = grid[y * MW + x]; if (!wt) continue;
        const k = wt + '_' + ((x + y) & 1);
        counts[k] = (counts[k] || 0) + 1;
    }
    const dummy = new THREE.Object3D();
    for (let t = 1; t <= 6; t++) for (let alt = 0; alt < 2; alt++) {
        const k = t + '_' + alt; const n = counts[k] || 0; if (!n) continue;
        const inst = new THREE.InstancedMesh(wallGeo, wallMat[t][alt], n);
        inst.castShadow = true; inst.receiveShadow = true;
        let idx = 0;
        for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
            const wt = grid[y * MW + x]; if (!wt) continue;
            if ((wt + '_' + ((x + y) & 1)) !== k) continue;
            dummy.position.set(x + 0.5, WALL_H / 2, y + 0.5);
            dummy.updateMatrix();
            inst.setMatrixAt(idx++, dummy.matrix);
        }
        inst.instanceMatrix.needsUpdate = true;
        world.add(inst);
    }

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(MW, MH), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.set(MW / 2, 0, MH / 2);
    floor.receiveShadow = true; world.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(MW, MH), ceilMat);
    ceil.rotation.x = Math.PI / 2; ceil.position.set(MW / 2, WALL_H, MH / 2);
    ceil.receiveShadow = true; world.add(ceil);

    // Fensterlicht: pro Fensterzelle faellt warmes "Tageslicht" in den angrenzenden Raum
    let windowLights = 0;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (grid[y * MW + x] !== 6 || windowLights >= 40) continue;
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= MW || ny >= MH || grid[ny * MW + nx]) continue;
            const wl = new THREE.PointLight(0xffcf8a, 0.55, 6.5, 1.8);
            wl.position.set(nx + 0.5 - dx * 0.35, WALL_H * 0.62, ny + 0.5 - dy * 0.35);
            world.add(wl);
            windowLights++;
            break;
        }
    }

    // Deckenleuchten
    for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) {
        if (grid[y * MW + x]) continue;
        if (x % 7 === 0 && y % 7 === 0 && lightPanels.length < 11) {
            const pan = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.5),
                new THREE.MeshStandardMaterial({ color: 0x18140c, emissive: 0xffd9a0, emissiveIntensity: 1.6, roughness: 0.4 }));
            pan.position.set(x + 0.5, WALL_H - 0.06, y + 0.5); world.add(pan);
            const pl = new THREE.PointLight(0xffd9a0, 0.7, 9, 2); pl.position.set(x + 0.5, WALL_H - 0.2, y + 0.5);
            pl.userData.flick = 0.7 + (lightPanels.length % 5) * 0.05;
            world.add(pl); lightPanels.push(pl);
        }
    }
    d.lightPanels = lightPanels;

    // Umgebungsobjekte
    const propTex = buildPropTextures();
    const crateGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const barrelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.62, 16);
    const pipeGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.0, 14);
    const termGeo = new THREE.BoxGeometry(0.62, 0.5, 0.32);
    const screenGeo = new THREE.BoxGeometry(0.42, 0.3, 0.05);
    for (const p of propList) {
        if (p.kind === 'crate') {
            const m = new THREE.Mesh(crateGeo, new THREE.MeshStandardMaterial({ map: propTex.crate, roughness: 0.82, metalness: 0.25 }));
            m.position.set(p.x, 0.3, p.y); m.rotation.y = p.rot; m.castShadow = m.receiveShadow = true; world.add(m);
        } else if (p.kind === 'barrel') {
            const m = new THREE.Mesh(barrelGeo, new THREE.MeshStandardMaterial({ map: propTex.barrel, roughness: 0.5, metalness: 0.55, emissive: 0x3a0d00, emissiveIntensity: 0.4 }));
            m.position.set(p.x, 0.31, p.y); m.castShadow = m.receiveShadow = true; world.add(m);
        } else if (p.kind === 'pipe') {
            const m = new THREE.Mesh(pipeGeo, new THREE.MeshStandardMaterial({ map: propTex.pipe, roughness: 0.4, metalness: 0.8 }));
            m.rotation.z = Math.PI / 2; m.rotation.y = p.rot; m.position.set(p.x, 0.22, p.y); m.castShadow = m.receiveShadow = true; world.add(m);
        } else if (p.kind === 'terminal') {
            const g = new THREE.Group();
            const desk = new THREE.Mesh(termGeo, new THREE.MeshStandardMaterial({ map: propTex.crate, roughness: 0.6, metalness: 0.5 }));
            desk.position.y = 0.25; desk.castShadow = desk.receiveShadow = true; g.add(desk);
            const sc = new THREE.Mesh(screenGeo, new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffaa33, emissiveIntensity: 1.8 }));
            sc.position.set(0, 0.55, 0.17); g.add(sc);
            g.position.set(p.x, 0, p.y); g.rotation.y = p.rot; world.add(g);
        }
    }

    // Elektrische Schiebetueren
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x2e2a20, roughness: 0.45, metalness: 0.85 });
    const seamMat = new THREE.MeshStandardMaterial({ color: 0x1a1006, roughness: 0.3, metalness: 0.6, emissive: 0xff8822, emissiveIntensity: 1.4 });
    for (const dr of doors) {
        const g = new THREE.Group();
        g.position.set(dr.x, 0, dr.y);
        let panel, seam1, seam2;
        const W = WALL_H;
        if (dr.slide === 'x') {
            const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, W, 0.16), doorFrameMat); p1.position.set(0.47, W / 2, 0); g.add(p1);
            const p2 = p1.clone(); p2.position.x = -0.47; g.add(p2);
            const beam = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 0.16), doorFrameMat); beam.position.set(0, W - 0.08, 0); g.add(beam);
            panel = new THREE.Mesh(new THREE.BoxGeometry(0.94, W * 0.94, 0.12),
                new THREE.MeshStandardMaterial({ color: 0x232a31, roughness: 0.4, metalness: 0.9 }));
            panel.position.set(0, W / 2, 0); panel.castShadow = panel.receiveShadow = true; g.add(panel);
            const sg = new THREE.BoxGeometry(0.06, W * 0.86, 0.03);
            seam1 = new THREE.Mesh(sg, seamMat); seam1.position.set(0, W / 2, 0.075); panel.add(seam1);
            seam2 = new THREE.Mesh(sg, seamMat); seam2.position.set(0, W / 2, -0.075); panel.add(seam2);
        } else {
            const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, W, 0.16), doorFrameMat); p1.position.set(0, W / 2, 0.47); g.add(p1);
            const p2 = p1.clone(); p2.position.z = -0.47; g.add(p2);
            const beam = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 1.0), doorFrameMat); beam.position.set(0, W - 0.08, 0); g.add(beam);
            panel = new THREE.Mesh(new THREE.BoxGeometry(0.12, W * 0.94, 0.94),
                new THREE.MeshStandardMaterial({ color: 0x232a31, roughness: 0.4, metalness: 0.9 }));
            panel.position.set(0, W / 2, 0); panel.castShadow = panel.receiveShadow = true; g.add(panel);
            const sg = new THREE.BoxGeometry(0.03, W * 0.86, 0.06);
            seam1 = new THREE.Mesh(sg, seamMat); seam1.position.set(0.075, W / 2, 0); panel.add(seam1);
            seam2 = new THREE.Mesh(sg, seamMat); seam2.position.set(-0.075, W / 2, 0); panel.add(seam2);
        }
        dr.panel = panel; dr.seam1 = seam1; dr.seam2 = seam2;
        dr.mesh = g;
        world.add(g);
    }

    // Ziel-Portal (Ausgang zum naechsten Sektor) - nur wenn dieses Level eines hat
    if (goal) {
        const portal = new THREE.Group();
        portal.position.set(goal.x, 0, goal.y);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x0a2a1a, emissive: 0x35ff9a, emissiveIntensity: 2.4, roughness: 0.3, metalness: 0.4 });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.06, 12, 36), ringMat);
        ring.position.y = WALL_H / 2; ring.rotation.x = Math.PI / 2; portal.add(ring);
        const core = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32),
            new THREE.MeshBasicMaterial({ color: 0x35ff9a, transparent: true, opacity: 0.22, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
        core.position.y = WALL_H / 2; portal.add(core);
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, WALL_H, 20, 1, true),
            new THREE.MeshBasicMaterial({ color: 0x35ff9a, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
        beam.position.y = WALL_H / 2; portal.add(beam);
        const gl = new THREE.PointLight(0x35ff9a, 1.4, 7, 2); gl.position.y = WALL_H / 2; portal.add(gl);
        portal.userData.ring = ring; portal.userData.core = core; portal.userData.beam = beam;
        world.add(portal);
        d.goalMesh = portal;
    } else {
        d.goalMesh = null;
    }

    // Aufzug (alternativer Levelausgang) - Plattform mit Warnstreifen, Schachtgestaenge und Bedienpanel
    if (elevatorGoal) {
        const lift = new THREE.Group();
        lift.position.set(elevatorGoal.x, 0, elevatorGoal.y);
        const padMat = new THREE.MeshStandardMaterial({ color: 0x2e2a20, roughness: 0.5, metalness: 0.8 });
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 20), padMat);
        pad.position.y = 0.04; pad.castShadow = pad.receiveShadow = true; lift.add(pad);
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a14, roughness: 0.6, metalness: 0.3 });
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.05), i % 2 ? stripeMat :
                new THREE.MeshStandardMaterial({ color: 0xd9b021, roughness: 0.5, metalness: 0.3 }));
            s.position.set(Math.cos(a) * 0.62, 0.045, Math.sin(a) * 0.62); s.rotation.y = -a; lift.add(s);
        }
        // vier Eckstreben zur Decke (Schacht-Andeutung)
        const strutMat = new THREE.MeshStandardMaterial({ color: 0x3a352a, roughness: 0.4, metalness: 0.85 });
        [[0.5, 0.5], [-0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]].forEach(([sx, sz]) => {
            const strut = new THREE.Mesh(new THREE.BoxGeometry(0.07, WALL_H, 0.07), strutMat);
            strut.position.set(sx, WALL_H / 2, sz); lift.add(strut);
        });
        // Bedienpanel mit pulsierender Taste
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.06),
            new THREE.MeshStandardMaterial({ color: 0x2e2a20, roughness: 0.5, metalness: 0.7 }));
        panel.position.set(0.72, 0.9, 0); lift.add(panel);
        const btnMat = new THREE.MeshStandardMaterial({ color: 0x1a1006, emissive: 0xffb02e, emissiveIntensity: 1.8, roughness: 0.4 });
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), btnMat);
        btn.rotation.z = Math.PI / 2; btn.position.set(0.75, 0.9, 0); lift.add(btn);
        const liftLight = new THREE.PointLight(0xffb02e, 1.0, 6, 2); liftLight.position.set(0, WALL_H - 0.2, 0); lift.add(liftLight);
        lift.userData.btn = btn;
        world.add(lift);
        d.liftMesh = lift;
    } else {
        d.liftMesh = null;
    }
}

function hexRGB(h) {
    if (h === 'smoke') return [0.22, 0.24, 0.27];
    const n = parseInt(h.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function syncEnemies3D(dt) {
    const d = _3d, list = enemies;
    dt = dt || 0.016;
    for (let i = 0; i < list.length; i++) {
        const e = list[i];
        let g = d.enemyPool[i];
        if (!g) continue; // wird ueber buildEnemyMeshes() erstellt
        if (!e.alive && e.dieT > 0.55) { g.visible = false; continue; }
        const parts = g.userData.parts;
        const root = g.userData.root;

        // Boden-Offset (nur der Sentinel schwebt leicht)
        const step = (e.moving && e.type !== 'sentinel') ? Math.abs(Math.sin(e.walkPhase || 0)) * 0.05 : 0;
        const baseY = e.type === 'sentinel'
            ? 0.05 + Math.sin(timeAlive * 2 + (e.wanderA || 0) * 5) * 0.06 + step
            : step;
        g.position.set(e.x, baseY, e.y);

        // Front (+Z) zeigt zum Spieler
        g.rotation.y = Math.atan2(d.camera.position.x - e.x, d.camera.position.z - e.y);

        if (parts.mixer) {
            let want = 'dead';
            if (e.alive) {
                if (e.atkAnim > 0) want = 'attack';
                else if (parts.current === 'attack' && parts.actions.attack && parts.actions.attack.isRunning()) want = 'attack';
                else if ((e.hitAnimT > 0) || (parts.current === 'hit' && parts.actions.hit && parts.actions.hit.isRunning())) want = 'hit';
                else if (e.moving) {
                    if (parts.actions.run && e.speed > RUN_SPEED) want = 'run';
                    else if (parts.actions.walk) want = 'walk';
                    else want = 'idle';
                } else want = 'idle';
            }
            if (!parts.actions[want]) want = 'idle';
            if (parts.current !== want) {
                const prev = parts.actions[parts.current];
                const next = parts.actions[want];
                if (prev && prev !== next) prev.stop();
                if (next) { next.reset(); next.play(); }
                parts.current = want;
            }
            const lunge = (e.atkAnim > 0) ? Math.max(0, Math.min(1, e.atkAnim / 0.2)) * 0.12 : 0;
            let bob = 0;
            if (e.type !== 'sentinel' && e.moving) bob = Math.abs(Math.sin(e.walkPhase || 0)) * 0.04;
            else if (e.type === 'sentinel' && e.alive) bob = Math.sin(timeAlive * 2 + (e.wanderA || 0) * 5) * 0.06;
            root.position.z = lunge;
            root.position.y = (g.userData.baseY || 0) + bob;

            const f = Math.max(0, e.flashT / 0.12);
            if (!e.alive) {
                const k = Math.max(0, 1 - e.dieT / 0.55);
                for (const mm of parts.mats) {
                    if (!mm.userData._fd) { mm.transparent = true; mm.userData._fd = 1; mm.needsUpdate = true; }
                    mm.opacity = k;
                    if (f > 0.01) { mm.emissive.setRGB(f, f, f); mm.emissiveIntensity = 1.2; }
                    else { mm.emissive.copy(parts.baseEmissiveColor.get(mm)); mm.emissiveIntensity = parts.baseEmissive.get(mm); }
                }
                g.userData.faded = true;
            } else {
                if (g.userData.faded) {
                    for (const mm of parts.mats) { mm.opacity = 1; mm.transparent = false; mm.userData._fd = 0; mm.needsUpdate = true; }
                    g.userData.faded = false;
                }
                for (const mm of parts.mats) {
                    if (f > 0.01) { mm.emissive.setRGB(f, f, f); mm.emissiveIntensity = 1.2; }
                    else { mm.emissive.copy(parts.baseEmissiveColor.get(mm)); mm.emissiveIntensity = parts.baseEmissive.get(mm); }
                }
            }
            parts.mixer.update(dt);
        } else {
            // Prozeduraler Pfad (Fallback ohne GLB)
            const sw = Math.sin(e.walkPhase || 0);
            if (parts.leftLeg) {
                parts.leftLeg.rotation.x = sw * 0.5;
                parts.rightLeg.rotation.x = -sw * 0.5;
                parts.leftArm.rotation.x = -sw * 0.4;
                parts.rightArm.rotation.x = sw * 0.4;
            }
            if (e.type === 'sentinel' && parts.body) parts.body.rotation.y += 0.01;

            let lunge = 0;
            if (e.atkAnim > 0) {
                const ph = Math.max(0, Math.min(1, e.atkAnim / 0.2));
                if (parts.leftArm) { parts.leftArm.rotation.x = -1.4 * ph; parts.rightArm.rotation.x = -1.4 * ph; }
                if (parts.mouth) parts.mouth.scale.setScalar(1 + ph * 0.8);
                lunge = ph * 0.18;
            } else if (parts.mouth) parts.mouth.scale.setScalar(1);

            if (!e.alive) {
                const k = Math.max(0, 1 - e.dieT / 0.55);
                root.rotation.x = (1 - k) * (Math.PI / 2) * 0.9;
                root.position.set(0, -(1 - k) * 0.2, 0);
                for (const m of parts.mats) {
                    if (!m.userData._fd) { m.transparent = true; m.userData._fd = 1; m.needsUpdate = true; }
                    m.opacity = k;
                    m.emissive.copy(parts.baseEmissiveColor.get(m));
                    m.emissiveIntensity = parts.baseEmissive.get(m);
                }
                g.userData.faded = true;
                g.scale.setScalar(1);
            } else {
                if (g.userData.faded) {
                    for (const m of parts.mats) { m.opacity = 1; m.transparent = false; m.userData._fd = 0; m.needsUpdate = true; }
                    g.userData.faded = false;
                }
                root.rotation.x = 0;
                root.position.set(0, 0, lunge);
                const f = Math.max(0, e.flashT / 0.12);
                for (const m of parts.mats) {
                    if (f > 0.01) { m.emissive.setRGB(f, f, f); m.emissiveIntensity = 1.2; }
                    else { m.emissive.copy(parts.baseEmissiveColor.get(m)); m.emissiveIntensity = parts.baseEmissive.get(m); }
                }
                g.scale.setScalar(1 + (e.atkAnim > 0 ? e.atkAnim * 0.5 : 0));
            }
        }
        g.visible = true;
    }
    for (let i = list.length; i < d.enemyPool.length; i++) d.enemyPool[i].visible = false;
}

function syncItems3D() {
    const d = _3d;
    for (let i = 0; i < items.length; i++) {
        const it = items[i];
        let g = d.itemPool[i];
        if (!g) { g = makeItemMesh(ITEM_RES); d.scene.add(g); d.itemPool[i] = g; }
        if (it.taken) { g.visible = false; continue; }
        g.position.set(it.x, 0, it.y);
        g.userData.spin.rotation.y += 0.02;
        g.userData.ring.rotation.z += 0.03;
        const pulse = 1 + Math.sin(timeAlive * 4 + (it.bob || 0)) * 0.18;
        g.userData.core.scale.setScalar(pulse);
        g.userData.halo.material.opacity = 0.45 + Math.sin(timeAlive * 4 + (it.bob || 0)) * 0.2;
        g.position.y = Math.sin((timeAlive + (it.bob || 0)) * 2) * 0.05;
        g.visible = true;
    }
    for (let i = items.length; i < d.itemPool.length; i++) d.itemPool[i].visible = false;
}

function syncProjectiles3D() {
    const d = _3d;
    for (let i = 0; i < projectiles.length; i++) {
        const p = projectiles[i];
        let sp = d.projPool[i];
        if (!sp) {
            sp = new THREE.Sprite(new THREE.SpriteMaterial({
                map: (function () { const s = 48, c = newCanvas(s), g = c.getContext('2d');
                    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
                    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.7)');
                    gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s); return tex(c); })(),
                color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
            }));
            sp.scale.set(0.4, 0.4, 1); d.scene.add(sp); d.projPool[i] = sp;
        }
        sp.material.color.set(p.color || '#ff5bd0');
        sp.position.set(p.x, p.z || EYE_H, p.y);
        sp.visible = p.age < 5;
    }
    for (let i = projectiles.length; i < d.projPool.length; i++) d.projPool[i].visible = false;
}

function syncTracers3D() {
    const d = _3d, pos = d.tracerLines.geometry.attributes.position.array;
    let n = 0; const max = pos.length / 6;
    for (let i = 0; i < tracers.length && n < max; i++) {
        const t = tracers[i]; if (t.x1 === undefined) continue;
        const a = n * 6;
        pos[a] = t.x1; pos[a + 1] = EYE_H; pos[a + 2] = t.y1;
        pos[a + 3] = t.x2; pos[a + 4] = EYE_H; pos[a + 5] = t.y2;
        n++;
    }
    d.tracerLines.geometry.setDrawRange(0, n * 2);
    d.tracerLines.geometry.attributes.position.needsUpdate = true;
    d.tracerLines.visible = n > 0;
}

function syncBooms3D() {
    const d = _3d;
    for (let i = 0; i < booms.length; i++) {
        const b = booms[i];
        let sp = d.boomPool[i];
        if (!sp) {
            sp = new THREE.Sprite(new THREE.SpriteMaterial({
                map: (function () { const s = 64, c = newCanvas(s), g = c.getContext('2d');
                    const gr = g.createRadialGradient(s / 2, s / 2, 1, s / 2, s / 2, s / 2);
                    gr.addColorStop(0, 'rgba(255,230,200,1)'); gr.addColorStop(0.4, 'rgba(255,140,60,0.8)');
                    gr.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s); return tex(c); })(),
                color: 0xff8a3c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
            }));
            d.scene.add(sp); d.boomPool[i] = sp;
        }
        const k = Math.min(1, b.age / 0.25);
        sp.scale.setScalar(0.3 + k * 1.8);
        sp.position.set(b.x, EYE_H, b.y);
        sp.material.opacity = 1 - k;
        sp.visible = b.age < 0.25;
    }
    for (let i = booms.length; i < d.boomPool.length; i++) d.boomPool[i].visible = false;
}

function syncParticles3D() {
    const d = _3d, pa = d.pGeo.attributes.position.array, ca = d.pGeo.attributes.color.array;
    const n = Math.min(particles.length, d.MAXP);
    for (let i = 0; i < n; i++) {
        const p = particles[i];
        const a = i * 3;
        pa[a] = p.x; pa[a + 1] = p.z || EYE_H; pa[a + 2] = p.y;
        const c = hexRGB(p.color);
        ca[a] = c[0]; ca[a + 1] = c[1]; ca[a + 2] = c[2];
    }
    d.pGeo.setDrawRange(0, n);
    d.pGeo.attributes.position.needsUpdate = true;
    d.pGeo.attributes.color.needsUpdate = true;
}

function render(dt) {
    if (typeof THREE === 'undefined') return; // Headless/Test: kein WebGL
    if (!_3d) init3D();
    const d = _3d;

    // Effekt-Arrays altern
    for (let i = booms.length - 1; i >= 0; i--) { booms[i].age += dt; if (booms[i].age > 0.25) booms.splice(i, 1); }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > (rings[i].life || 0.5)) rings.splice(i, 1); }
    for (let i = tracers.length - 1; i >= 0; i--) { tracers[i].age += dt; if (tracers[i].age > 0.09) tracers.splice(i, 1); }
    updateParticles(dt);

    const cam = d.camera;
    cam.position.set(player.x, EYE_H, player.y);
    cam.rotation.order = 'YXZ';
    cam.rotation.y = Math.PI * 1.5 - player.a;
    cam.rotation.x = (player.pitch / MAX_PITCH) * PITCH_MAX_RAD;
    if (shakeT > 0) {
        const s = shakeT * 0.05;
        cam.position.x += (Math.random() - 0.5) * s;
        cam.position.y += (Math.random() - 0.5) * s;
    }

    // Taschenlampe-Flackern + Mündungsblitz
    const flick = 0.9 + Math.sin(timeAlive * 37) * 0.05 + (Math.random() - 0.5) * 0.06;
    d.flash.intensity = (muzzleT > 0 ? 3.6 : 2.2) * flick;
    d.fill.intensity = muzzleT > 0 ? 0.5 : 0.18;
    d.muzzleLight.intensity = muzzleT > 0 ? 3.0 : 0;
    d.muzzleSprite.visible = muzzleT > 0;
    for (const pl of d.lightPanels) pl.intensity = pl.userData.flick * (0.8 + Math.sin(timeAlive * 9 + pl.position.x) * 0.2);

    // Ziel-Portal animieren
    if (d.goalMesh) {
        d.goalMesh.userData.ring.rotation.z += dt * 1.6;
        d.goalMesh.userData.core.material.opacity = 0.18 + Math.sin(timeAlive * 3) * 0.08;
        d.goalMesh.userData.beam.material.opacity = 0.1 + Math.sin(timeAlive * 2.5) * 0.05;
    }
    if (d.liftMesh) {
        d.liftMesh.userData.btn.material.emissiveIntensity = 1.4 + Math.sin(timeAlive * 4) * 0.6;
    }

    // Waffen-Rückstoß
    d.weapon.position.z = d.weaponBaseZ + (typeof recoil !== 'undefined' ? recoil * 0.12 : 0);
    d.weapon.position.x = 0.32 + (shakeT > 0 ? (Math.random() - 0.5) * shakeT * 0.04 : 0);

    syncEnemies3D(dt);
    syncItems3D();
    syncProjectiles3D();
    syncTracers3D();
    syncBooms3D();
    syncParticles3D();

    if (d.composer) {
        try { d.composer.render(); }
        catch (e) { d.renderer.render(d.scene, cam); }
    } else {
        d.renderer.render(d.scene, cam);
    }
}

/* ================= Game-Loop ================= */
let lastT = performance.now();

function loop(now) {
    requestAnimationFrame(loop);
    let dt = (now - lastT) / 1000;
    lastT = now;
    if (dt > 0.05) dt = 0.05;

    if (state === 'playing') {
        timeAlive += dt;
        updatePlayer(dt);
        updateEnemies(dt);
        updateItems(dt);
        updateDoors(dt);
        if (!elevatorRiding && goal && Math.hypot(player.x - goal.x, player.y - goal.y) < 0.7) advanceLevel();
        if (!elevatorRiding && elevatorGoal && Math.hypot(player.x - elevatorGoal.x, player.y - elevatorGoal.y) < 0.55) startElevator();
        if (elevatorRiding) {
            elevatorT -= dt;
            if (elevatorT <= 0) { elevatorRiding = false; advanceLevel(); }
        }
        updateAmbient(dt);
        updateHud();
        elDmg.style.opacity = hurtFlash * 0.9;
    }

    render(dt);
    drawMinimap();
}

resetGame();
initMinimap();
requestAnimationFrame(loop);

/* Debug-Schnittstelle fuer automatisierte Tests */
window.OX_ALPHA_TEST = {
    get state() { return state; },
    set state(v) { state = v; },
    player, enemies, shoot, damagePlayer, resetGame, startReload
};

})();
