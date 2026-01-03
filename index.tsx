
import { GoogleGenAI, Type } from "@google/genai";

// --- Constants & Config ---
const API_KEY = process.env.API_KEY;
const ANNIVERSARY_DATE = "May 4th";

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
const inputImg1 = document.getElementById('input-img-1') as HTMLInputElement;
const inputImg2 = document.getElementById('input-img-2') as HTMLInputElement;

const noteHeader = document.getElementById('note-header')!;
const noteBody = document.getElementById('note-body')!;
const noteSig = document.getElementById('note-sig')!;
const feelingsLoader = document.getElementById('feelings-loader')!;
const feelingsContent = document.getElementById('feelings-content')!;

const canvas = document.getElementById('sparkleCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// --- State ---
let isSparkling = false;
let particles: any[] = [];
let editing = false;

// --- Sparkle Engine ---
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
    
    // Draw heart-ish star
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
  setTimeout(() => { isSparkling = false; }, 5000);
});

// --- Page Navigation ---
btnEnter.addEventListener('click', () => {
  pageWelcome.classList.replace('active', 'hidden');
  pageMemories.classList.replace('hidden', 'active');
  fetchLoveNote();
});

btnBack.addEventListener('click', () => {
  pageMemories.classList.replace('active', 'hidden');
  pageWelcome.classList.replace('hidden', 'active');
});

// --- Editable Photos Logic ---
btnEdit.addEventListener('click', () => {
  editing = !editing;
  btnEdit.textContent = editing ? '✓ Done' : '✎ Edit Photos';
  inputImg1.classList.toggle('hidden', !editing);
  inputImg2.classList.toggle('hidden', !editing);
});

inputImg1.addEventListener('input', (e) => {
  const url = (e.target as HTMLInputElement).value;
  if (url) img1.src = url;
});

inputImg2.addEventListener('input', (e) => {
  const url = (e.target as HTMLInputElement).value;
  if (url) img2.src = url;
});

// --- AI Love Note Integration ---
async function fetchLoveNote() {
  feelingsLoader.classList.remove('hidden');
  feelingsContent.classList.add('hidden');
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Write a short, heart-touching anniversary message for a partner. No names, just deep romance. 2 sentences max.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: { type: Type.STRING },
            message: { type: Type.STRING },
            signature: { type: Type.STRING }
          },
          required: ["header", "message", "signature"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    noteHeader.textContent = data.header;
    noteBody.textContent = `"${data.message}"`;
    noteSig.textContent = data.signature;
  } catch (err) {
    console.error(err);
    noteHeader.textContent = "My Soulmate";
    noteBody.textContent = "Every moment with you is a treasure I cherish. Thank you for being my light and my love.";
    noteSig.textContent = "Forever Yours";
  } finally {
    feelingsLoader.classList.add('hidden');
    feelingsContent.classList.remove('hidden');
  }
}

btnRefreshNote.addEventListener('click', fetchLoveNote);
