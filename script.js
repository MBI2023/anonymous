/* =========================================================
   for Lisa ❤️ — interactions, particles, confetti, music
   ---------------------------------------------------------
   EDIT ME: change the photo / name / question in CONFIG.
   ========================================================= */
const CONFIG = {
  name: "Lisa",
  // Replace the file "lisa.jpg" in this folder (or paste any image URL here).
  photo: "lisa.jpg",
  // The big question shown in the proposal section.
  question: "aio i forget .................................................",
  // Optional: set to "song.mp3" (a file in this folder) or a full URL to use
  // your own track. Leave empty ("") to use the built-in soft generated music.
  musicSrc: "",
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- apply config ---------- */
$("#lisaPhoto").src = CONFIG.photo;
$("#bigQuestion").textContent = CONFIG.question;
document.title = `for ${CONFIG.name} ❤️`;

/* =========================================================
   Scene manager (smooth transitions + staggered reveals)
   ========================================================= */
let currentScene = "intro";
const sceneTimers = [];

function clearSceneTimers() {
  while (sceneTimers.length) clearTimeout(sceneTimers.pop());
}

function revealStagger(scene) {
  const items = $$("[data-reveal]", scene);
  items.forEach((el, i) => {
    el.classList.remove("is-revealed");
    el.style.transitionDelay = `${140 + i * 110}ms`;
  });
  // let the scene fade in first, then cascade the reveals
  sceneTimers.push(
    setTimeout(() => items.forEach((el) => el.classList.add("is-revealed")), 60)
  );
}

function resetReveals(scene) {
  $$("[data-reveal]", scene).forEach((el) => {
    el.classList.remove("is-revealed");
    el.style.transitionDelay = "0ms";
  });
}

function goTo(name) {
  if (name === currentScene) return;
  const from = $(`.scene[data-scene="${currentScene}"]`);
  const to = $(`.scene[data-scene="${name}"]`);
  if (!to) return;

  clearSceneTimers();
  stopCountdown();
  if (currentScene === "celebrate") stopConfetti();

  currentScene = name;

  // hard-reset any other lingering scenes so nothing invisible overlaps
  $$(".scene").forEach((s) => {
    if (s !== to && s !== from) {
      s.hidden = true;
      s.classList.remove("is-leaving", "is-active");
    }
  });

  if (from) {
    from.classList.add("is-leaving");
    from.classList.remove("is-active");
    resetReveals(from);
  }

  to.hidden = false;
  resetReveals(to);
  // double rAF so the enter transition actually animates
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      to.classList.add("is-active");
      revealStagger(to);
      onSceneEnter(name);
    })
  );

  sceneTimers.push(
    setTimeout(() => {
      if (from) {
        from.classList.remove("is-leaving");
        from.hidden = true;
      }
    }, 720)
  );
}

function onSceneEnter(name) {
  if (name === "photo") spawnFloatingHearts();
  if (name === "suspense") startCountdown();
  if (name === "celebrate") startConfetti();
}

// wire up every "go to scene" button
$$("[data-goto]").forEach((btn) =>
  btn.addEventListener("click", () => goTo(btn.dataset.goto))
);

/* =========================================================
   Floating hearts around the photo
   ========================================================= */
const HEART_COLORS = ["#ff6f91", "#ffb3c6", "#9d7bff", "#ffd9a8", "#ff8fae"];
function spawnFloatingHearts() {
  const host = $("#floatingHearts");
  if (!host) return;
  host.innerHTML = "";
  if (reduceMotion) return;
  const count = 14;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "float-heart";
    s.textContent = Math.random() > 0.35 ? "♥" : "❤";
    s.style.setProperty("--x", `${4 + Math.random() * 92}%`);
    s.style.setProperty("--s", `${10 + Math.random() * 16}px`);
    s.style.setProperty("--c", HEART_COLORS[i % HEART_COLORS.length]);
    s.style.setProperty("--d", `${7 + Math.random() * 7}s`);
    s.style.setProperty("--dl", `${-Math.random() * 9}s`);
    s.style.setProperty("--dx", `${(Math.random() * 44 - 22).toFixed(0)}px`);
    host.appendChild(s);
  }
}

/* =========================================================
   Suspense countdown
   ========================================================= */
let countdownTimer = null;
function stopCountdown() {
  if (countdownTimer) clearTimeout(countdownTimer);
  countdownTimer = null;
}
function startCountdown() {
  const wrap = $("#countdown");
  const num = $("#countNum");
  const ring = $("#ringFill");
  const nervous = $("#nervousLine");
  const ask = $("#askBtn");
  if (!wrap) return;

  stopCountdown();
  nervous.hidden = true;
  ask.hidden = true;
  wrap.hidden = false;
  wrap.classList.remove("is-done");

  let n = 3;
  num.textContent = n;

  const tick = () => {
    num.classList.remove("is-pop");
    void num.offsetWidth;
    num.classList.add("is-pop");
    ring.classList.remove("is-sweeping");
    void ring.getBoundingClientRect();
    ring.classList.add("is-sweeping");

    countdownTimer = setTimeout(() => {
      n -= 1;
      if (n > 0) {
        num.textContent = n;
        tick();
      } else {
        wrap.classList.add("is-done");
        countdownTimer = setTimeout(() => {
          wrap.hidden = true;
          nervous.hidden = false;
          ask.hidden = false;
        }, 430);
      }
    }, 1000);
  };
  tick();
}

/* =========================================================
   Proposal: "Yes" + playful dodge button
   ========================================================= */
$("#yesBtn").addEventListener("click", () => goTo("celebrate"));

const dodgeBtn = $("#dodgeBtn");
const answerRow = $("#answerRow");
const dodgeNote = $("#dodgeNote");
const DODGE_MAX = 4;
const isCoarse = window.matchMedia("(pointer: coarse)").matches;
let dodgeOffset = { x: 0, y: 0 };
let dodgeCount = 0;

const DODGE_LINES = [
  "hey… that button just moved. suspicious. 😏",
  "okay okay, it's shy. give it a second.",
  "it's not running away… much.",
  "alright, it'll behave now. promise.",
];

function setDodgeTransform() {
  dodgeBtn.style.transform = `translate3d(${dodgeOffset.x}px, ${dodgeOffset.y}px, 0)`;
}
function showDodgeNote(text) {
  dodgeNote.textContent = text;
  dodgeNote.hidden = false;
}

if (answerRow && dodgeBtn) {
  answerRow.addEventListener("pointermove", (e) => {
    if (isCoarse || reduceMotion) return;
    const r = dodgeBtn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < 92 && dodgeCount < DODGE_MAX) {
      // nudge slightly away from the cursor, always staying small & usable
      const dirX = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : -Math.sign(dx);
      const dirY = dy === 0 ? -1 : -Math.sign(dy);
      dodgeOffset.x = clamp(dodgeOffset.x + dirX * 26, -42, 42);
      dodgeOffset.y = clamp(dodgeOffset.y + dirY * 16, -24, 24);
      dodgeCount += 1;
      setDodgeTransform();
      showDodgeNote(DODGE_LINES[Math.min(dodgeCount, DODGE_LINES.length) - 1]);
    } else if (dist > 150) {
      // ease back toward home when the cursor wanders off
      dodgeOffset.x += (0 - dodgeOffset.x) * 0.12;
      dodgeOffset.y += (0 - dodgeOffset.y) * 0.12;
      if (Math.abs(dodgeOffset.x) < 0.5) dodgeOffset.x = 0;
      if (Math.abs(dodgeOffset.y) < 0.5) dodgeOffset.y = 0;
      setDodgeTransform();
    }
  });

  answerRow.addEventListener("pointerleave", () => {
    dodgeOffset = { x: 0, y: 0 };
    setDodgeTransform();
  });

  dodgeBtn.addEventListener("click", () => {
    showDodgeNote("take all the time you need… I'll be right here. 🤍");
    dodgeOffset = { x: 0, y: 0 };
    setDodgeTransform();
    burstHeartsAtButton();
  });
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/* =========================================================
   Ambient particle canvas (soft glowing dots + hearts)
   ========================================================= */
const ambientCanvas = $("#ambient");
const actx = ambientCanvas.getContext("2d");
let ambientParticles = [];
let ambientRAF = null;
let dpr = 1;

function sizeCanvas(canvas, ctx) {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}

function buildAmbient() {
  const { w, h } = sizeCanvas(ambientCanvas, actx);
  const count = reduceMotion ? 0 : Math.min(70, Math.round((w * h) / 24000));
  ambientParticles = [];
  for (let i = 0; i < count; i++) {
    const isHeart = Math.random() < 0.16;
    ambientParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: isHeart ? 6 + Math.random() * 8 : 0.8 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 0.16,
      vy: -(0.06 + Math.random() * 0.22),
      tw: Math.random() * Math.PI * 2,
      tws: 0.004 + Math.random() * 0.012,
      hue: HEART_COLORS[i % HEART_COLORS.length],
      heart: isHeart,
    });
  }
}

function drawAmbient() {
  const w = ambientCanvas.clientWidth;
  const h = ambientCanvas.clientHeight;
  actx.clearRect(0, 0, w, h);
  for (const p of ambientParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.tw += p.tws;
    if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;

    const alpha = 0.25 + Math.abs(Math.sin(p.tw)) * 0.5;
    actx.globalAlpha = alpha;
    if (p.heart) {
      actx.fillStyle = p.hue;
      actx.font = `${p.r}px serif`;
      actx.fillText("♥", p.x, p.y);
    } else {
      const g = actx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      g.addColorStop(0, hexToRgba(p.hue, 0.5));
      g.addColorStop(1, hexToRgba(p.hue, 0));
      actx.fillStyle = g;
      actx.beginPath();
      actx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      actx.fill();
    }
  }
  actx.globalAlpha = 1;
  ambientRAF = requestAnimationFrame(drawAmbient);
}

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function startAmbient() {
  if (reduceMotion) return;
  buildAmbient();
  cancelAnimationFrame(ambientRAF);
  drawAmbient();
}
window.addEventListener("resize", () => {
  buildAmbient();
  if (confettiActive) sizeConfetti();
});

/* =========================================================
   Celebration confetti (confetti + hearts + glow)
   ========================================================= */
const confettiCanvas = $("#confetti");
const cctx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
let confettiPieces = [];
let confettiRAF = null;
let confettiActive = false;

function sizeConfetti() {
  if (!confettiCanvas) return;
  sizeCanvas(confettiCanvas, cctx);
}

function startConfetti() {
  if (!confettiCanvas || reduceMotion) return;
  sizeConfetti();
  confettiActive = true;
  confettiPieces = [];
  const w = confettiCanvas.clientWidth;
  const h = confettiCanvas.clientHeight;

  // initial burst from the bottom-center
  for (let i = 0; i < 150; i++) {
    confettiPieces.push(makePiece(w / 2 + (Math.random() - 0.5) * 120, h * 0.72, true));
  }
  cancelAnimationFrame(confettiRAF);
  loopConfetti();
}

function makePiece(x, y, burst) {
  const type = Math.random();
  const w = confettiCanvas.clientWidth;
  return {
    x,
    y,
    vx: burst ? (Math.random() - 0.5) * 7 : (Math.random() - 0.5) * 1.2,
    vy: burst ? -(4 + Math.random() * 7) : 0.6 + Math.random() * 1.4,
    g: 0.12 + Math.random() * 0.08,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.24,
    size: 5 + Math.random() * 8,
    color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    kind: type < 0.5 ? "rect" : type < 0.8 ? "heart" : "glow",
    life: 1,
    decay: 0.0035 + Math.random() * 0.004,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.02 + Math.random() * 0.04,
    w,
  };
}

function loopConfetti() {
  const w = confettiCanvas.clientWidth;
  const h = confettiCanvas.clientHeight;
  cctx.clearRect(0, 0, w, h);

  // keep a gentle drizzle going
  if (confettiPieces.length < 130 && Math.random() < 0.5) {
    confettiPieces.push(makePiece(Math.random() * w, -20, false));
  }

  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const p = confettiPieces[i];
    p.vy += p.g;
    p.vx *= 0.995;
    p.sway += p.swaySpeed;
    p.x += p.vx + Math.sin(p.sway) * 0.6;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= p.decay;

    if (p.y > h + 40 || p.life <= 0) {
      confettiPieces.splice(i, 1);
      continue;
    }

    cctx.save();
    cctx.globalAlpha = Math.max(0, Math.min(1, p.life));
    cctx.translate(p.x, p.y);
    cctx.rotate(p.rot);
    if (p.kind === "rect") {
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
    } else if (p.kind === "heart") {
      cctx.fillStyle = p.color;
      cctx.font = `${p.size * 2}px serif`;
      cctx.textAlign = "center";
      cctx.textBaseline = "middle";
      cctx.fillText("♥", 0, 0);
    } else {
      const g = cctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
      g.addColorStop(0, hexToRgba(p.color, 0.6));
      g.addColorStop(1, hexToRgba(p.color, 0));
      cctx.fillStyle = g;
      cctx.beginPath();
      cctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
      cctx.fill();
    }
    cctx.restore();
  }

  confettiRAF = requestAnimationFrame(loopConfetti);
}

function stopConfetti() {
  confettiActive = false;
  cancelAnimationFrame(confettiRAF);
  if (cctx) cctx.clearRect(0, 0, confettiCanvas.clientWidth, confettiCanvas.clientHeight);
}

// tiny heart puff when the dodge button is clicked
function burstHeartsAtButton() {
  const bg = $(".proposal-bg");
  if (!bg || reduceMotion) return;
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("span");
    s.className = "heart-puff";
    s.textContent = "♥";
    s.style.setProperty("--x", `${28 + Math.random() * 44}%`);
    s.style.setProperty("--s", `${10 + Math.random() * 14}px`);
    s.style.setProperty("--c", HEART_COLORS[i % HEART_COLORS.length]);
    s.style.setProperty("--dx", `${(Math.random() * 80 - 40).toFixed(0)}px`);
    s.addEventListener("animationend", () => s.remove());
    bg.appendChild(s);
  }
}

/* =========================================================
   Optional music (never autoplays)
   ========================================================= */
const musicToggle = $("#musicToggle");
const music = { ctx: null, master: null, timer: null, playing: false, step: 0, audioEl: null };
const CHORDS = [
  [220.0, 277.18, 329.63, 415.3],   // A maj7
  [174.61, 220.0, 261.63, 329.63],  // F maj7
  [196.0, 246.94, 293.66, 392.0],   // G add
  [164.81, 207.65, 246.94, 329.63], // E min-ish warm
];

function ensureAudio() {
  if (!music.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    music.ctx = new AC();
    music.master = music.ctx.createGain();
    music.master.gain.value = 0;
    music.master.connect(music.ctx.destination);
  }
}
function playNote(freq, t, dur, type, gain) {
  const o = music.ctx.createOscillator();
  const g = music.ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(music.master);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function scheduleBar() {
  if (!music.ctx) return;
  const chord = CHORDS[music.step % CHORDS.length];
  const t0 = music.ctx.currentTime + 0.05;
  chord.forEach((f, i) => playNote(f, t0 + i * 0.03, 3.4, "triangle", 0.03));
  const arp = [chord[0] * 2, chord[2] * 2, chord[1] * 2, chord[3] * 2];
  arp.forEach((f, i) => playNote(f, t0 + 0.5 + i * 0.6, 1.3, "sine", 0.045));
  music.step += 1;
}

function startMusic() {
  if (CONFIG.musicSrc) {
    if (!music.audioEl) {
      music.audioEl = new Audio(CONFIG.musicSrc);
      music.audioEl.loop = true;
      music.audioEl.volume = 0.6;
    }
    music.audioEl.play().catch(() => {});
  } else {
    ensureAudio();
    music.ctx.resume();
    music.master.gain.cancelScheduledValues(music.ctx.currentTime);
    music.master.gain.linearRampToValueAtTime(0.5, music.ctx.currentTime + 0.6);
    scheduleBar();
    music.timer = setInterval(scheduleBar, 3500);
  }
  music.playing = true;
  musicToggle.setAttribute("aria-pressed", "true");
}
function stopMusic() {
  if (CONFIG.musicSrc && music.audioEl) {
    music.audioEl.pause();
  } else if (music.ctx) {
    music.master.gain.cancelScheduledValues(music.ctx.currentTime);
    music.master.gain.linearRampToValueAtTime(0, music.ctx.currentTime + 0.4);
    clearInterval(music.timer);
    music.timer = null;
  }
  music.playing = false;
  musicToggle.setAttribute("aria-pressed", "false");
}
musicToggle.addEventListener("click", () => {
  if (music.playing) stopMusic();
  else startMusic();
});

/* =========================================================
   Boot
   ========================================================= */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(ambientRAF);
    cancelAnimationFrame(confettiRAF);
  } else {
    if (!reduceMotion) drawAmbient();
    if (confettiActive) loopConfetti();
  }
});

startAmbient();
// reveal intro on load
revealStagger($("#scene-intro"));
