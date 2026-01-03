
// --- Constants ---
const ANNIVERSARY_DATE = "May 4th";

// A collection of romantic messages to cycle through locally (No API needed)
const LOVE_NOTES = [
  {
    header: "My Whole World",
    message: "Thank you for being my anchor in every storm and my sunshine on every gray day. I love you more than words can say.",
    signature: "Always Yours"
  },
  {
    header: "A Beautiful Journey",
    message: "Looking back at our time together, I'm amazed by how much love we've shared. I can't wait for our forever.",
    signature: "With All My Love"
  },
  {
    header: "My Soulmate",
    message: "Every moment spent with you is like a beautiful dream come true. You are my greatest blessing.",
    signature: "Forever & Always"
  },
  {
    header: "To My Love",
    message: "You make my life so much brighter just by being in it. Happy anniversary to the person who has my heart.",
    signature: "Your One and Only"
  }
];

// --- DOM Elements ---
const pageWelcome = document.getElementById('page-welcome')!;
const pageMemories = document.getElementById('page-memories')!;
const btnSparkle = document.getElementById('btn-sparkle')!;
const btnEnter = document.getElementById('btn-enter')!;
const btnBack = document.getElementById('btn-back')!;
const btnEdit = document.getElementById('btn-edit')!;
const btnRefreshNote = document.getElementById('btn-refresh-note')!;

const img1 = document.getElementById('img-slot-1') as HTMLImageElement;
const img2 = document.getElementById('img-slot-2') as HTMLImageElement;
const img3 = document.getElementById('img-slot-3') as HTMLImageElement;

const inputImg1 = document.getElementById('input-img-1') as HTMLInputElement;
const inputImg2 = document.getElementById('input-img-2') as HTMLInputElement;
const inputImg3 = document.getElementById('input-img-3') as HTMLInputElement;

const noteHeader = document.getElementById('note-header')!;
const noteBody = document.getElementById('note-body')!;
const noteSig = document.getElementById('note-sig')!;

const canvas = document.getElementById('sparkleCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// --- State ---
let isSparkling = false;
let particles: any[] = [];
let editing = false;
let currentNoteIndex = 0;

// --- Sparkle Engine (Pure Canvas) ---
function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

function createParticle() {
  const colors = ['#FFD700', '#FF69B4', '#FF1493', '#FFFFFF', '#FFB6C1'];
  return {
    x: Math.random() * canvas.width,
    y: -20,
    size: Math.random() * 5 + 2,
    speedX: (Math.random() - 0.5) * 3,
    speedY: Math.random() * 5 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 1,
    rot: Math.random() * Math.PI * 2,
    rotS: (Math.random() - 0.5) * 0.1
  };
}

function updateSparkles() {
  if (!isSparkling && particles.length === 0) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (isSparkling && particles.length < 300) {
    particles.push(createParticle());
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.rot += p.rotS;
    
    if (p.y > canvas.height * 0.8) p.opacity -= 0.02;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.fillStyle = p.color;
    
    ctx.beginPath();
    for (let j = 0; j < 5; j++) {
      ctx.lineTo(0, p.size);
      ctx.rotate(Math.PI / 5);
      ctx.lineTo(0, p.size / 2);
      ctx.rotate(Math.PI / 5);
    }
    ctx.fill();
    ctx.restore();

    if (p.y > canvas.height || p.opacity <= 0) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(updateSparkles);
}

btnSparkle.addEventListener('click', () => {
  isSparkling = true;
  updateSparkles();
  setTimeout(() => { isSparkling = false; }, 8000);
});

// --- Navigation ---
btnEnter.addEventListener('click', () => {
  pageWelcome.classList.replace('active', 'hidden');
  pageMemories.classList.replace('hidden', 'active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

btnBack.addEventListener('click', () => {
  pageMemories.classList.replace('active', 'hidden');
  pageWelcome.classList.replace('hidden', 'active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Photo Editing Logic ---
btnEdit.addEventListener('click', () => {
  editing = !editing;
  btnEdit.textContent = editing ? '✓ Done' : '✎ Edit Photos';
  inputImg1.classList.toggle('hidden', !editing);
  inputImg2.classList.toggle('hidden', !editing);
  inputImg3.classList.toggle('hidden', !editing);
});

function handleImageChange(input: HTMLInputElement, img: HTMLImageElement) {
  input.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value;
    if (val) img.src = val;
  });
}

handleImageChange(inputImg1, img1);
handleImageChange(inputImg2, img2);
handleImageChange(inputImg3, img3);

// --- Love Note Cycling (Offline/No API) ---
function displayLoveNote() {
  const note = LOVE_NOTES[currentNoteIndex];
  noteHeader.textContent = note.header;
  noteBody.textContent = `"${note.message}"`;
  noteSig.textContent = note.signature;
}

btnRefreshNote.addEventListener('click', () => {
  currentNoteIndex = (currentNoteIndex + 1) % LOVE_NOTES.length;
  displayLoveNote();
});

// Initialize first note
displayLoveNote();
