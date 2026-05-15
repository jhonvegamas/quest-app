// questions.js — Carga y selección de preguntas, aleatoriedad, niveles

function cryptoRandom() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / (0xFFFFFFFF + 1);
}

function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(cryptoRandom() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatMoney(amount) { return '$' + amount.toLocaleString('es-CO'); }

async function loadQuestions() {
  try {
    const r = await fetch('questions.json');
    if (!r.ok) throw Error('Error');
    questionsDB = await r.json();
    document.getElementById('startBtn').disabled = false;
    document.getElementById('startBtn').textContent = '¡COMENZAR!';
    try { lucide.createIcons(); } catch(e) {}
    updateLevelInfo();
  } catch (e) {
    document.getElementById('startBtn').textContent = 'Error al cargar';
  }
}

function selectQuestionsByDifficulty() {
  const easy = shuffleArray(questionsDB.filter(q => q.difficulty === 'facil'));
  const med  = shuffleArray(questionsDB.filter(q => q.difficulty === 'media'));
  const hard = shuffleArray(questionsDB.filter(q => q.difficulty === 'dificil'));
  if (getLevelMode() === 5) {
    return [...easy.slice(0,4), ...med.slice(0,8), ...hard.slice(0,8)];
  }
  return [...easy.slice(0,4), ...med.slice(0,3), ...hard.slice(0,3)];
}

function getLevelMode() {
  const sel = document.querySelector('input[name="levelMode"]:checked');
  return sel ? parseInt(sel.value) : 3;
}
function getTotalQuestions() { return getLevelMode() === 5 ? 20 : 10; }
function getMilestones() { return getLevelMode() === 5 ? [3, 7, 11, 15, 19] : [3, 6, 9]; }
function isMilestoneReached() { return getMilestones().includes(currentQuestion); }
