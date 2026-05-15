// game.js — Lógica principal del juego: variables, flujo, respuestas, comodines, timer

let questionsDB           = [];
let currentQuestion       = 0;
let currentPrize          = 0;
let lifelines             = { '5050': true, 'phone': true, 'public': true };
let timer;
let timeLeft              = 30;
let shuffledQuestions     = [];
let used5050              = false;
let currentCorrectIndex   = 0;
let awaitingMilestoneChoice = false;

const prizeLadder = [
  100000, 200000, 300000, 500000, 1000000,
  2000000, 3000000, 5000000, 7000000, 10000000,
  15000000, 20000000, 50000000, 100000000, 150000000,
  200000000, 250000000, 300000000, 400000000, 500000000
];

const themes = {
  facil:   { bg: 'from-cyan-200 via-sky-100 to-indigo-200',    accent: 'text-cyan-600',    progress: 'from-cyan-500 to-blue-500',    icon: 'sparkles',     label: 'Fácil' },
  media:   { bg: 'from-orange-200 via-amber-100 to-pink-100',   accent: 'text-orange-600',  progress: 'from-orange-500 to-pink-500',  icon: 'flame',        label: 'Media' },
  dificil: { bg: 'from-violet-300 via-fuchsia-200 to-pink-200', accent: 'text-violet-700',  progress: 'from-violet-500 to-fuchsia-500', icon: 'shield-alert', label: 'Difícil' }
};

const difficultyIcons  = { 'facil': 'sparkles', 'media': 'flame', 'dificil': 'shield-alert' };
const difficultyLabels = { 'facil': 'Fácil', 'media': 'Media', 'dificil': 'Difícil' };

function getGamePhase() {
  const pct = (currentQuestion + 1) / getTotalQuestions();
  if (pct <= 0.4) return 'early';
  if (pct <= 0.7) return 'mid';
  return 'late';
}

function showReadyScreen() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('readyContent').classList.remove('hidden');
  try { lucide.createIcons(); } catch(e) {}
  playBg(audioFiles.temaPrincipal);

  if (questionsDB.length) {
    shuffledQuestions = selectQuestionsByDifficulty();
    currentQuestion = 0;
    document.getElementById('loadingPreguntas').textContent = '✅ Preguntas listas';
    document.getElementById('btnIniciar').disabled = false;
  } else {
    document.getElementById('loadingPreguntas').textContent = '⏳ Cargando banco de preguntas...';
    const check = setInterval(() => {
      if (questionsDB.length) {
        shuffledQuestions = selectQuestionsByDifficulty();
        currentQuestion = 0;
        document.getElementById('loadingPreguntas').textContent = '✅ Preguntas listas';
        document.getElementById('btnIniciar').disabled = false;
        clearInterval(check);
      }
    }, 300);
  }
}

function startGame() {
  if (!shuffledQuestions.length) {
    if (!questionsDB.length) {
      document.getElementById('loadingPreguntas').textContent = '⏳ Aún cargando preguntas, espera un momento...';
      return;
    }
    shuffledQuestions = selectQuestionsByDifficulty();
    currentQuestion = 0;
  }
  currentPrize = 0;
  lifelines = { '5050': true, 'phone': true, 'public': true };
  used5050 = false;

  stopAllAudio();
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('gameArea').classList.remove('hidden');
  renderMoneyLadder();

  loadQuestionWithSound();
}

function applyTheme(diff) {
  const t = themes[diff] || themes.facil;
  document.body.className = 'min-h-screen flex items-center justify-center p-4 lg:p-6 bg-gradient-to-br ' + t.bg + ' transition-all duration-1000';
  document.getElementById('highlight').className = t.accent;
  document.getElementById('startHighlight').className = t.accent;
  document.getElementById('progress').className = 'h-full rounded-full bg-gradient-to-r ' + t.progress + ' transition-all duration-700';
}

function renderMoneyLadder() {
  const total = getTotalQuestions();
  const container = document.getElementById('levels');
  container.innerHTML = '';
  document.getElementById('ladderTotal').textContent = total + ' niveles';
  for (let i = total - 1; i >= 0; i--) {
    const div = document.createElement('div');
    let cls = 'ladder-item rounded-2xl px-4 py-2 font-semibold transition-all duration-500 ';
    if (i === currentQuestion) cls += 'bg-white/30 text-slate-900 scale-105 shadow-lg';
    else if (i < currentQuestion) cls += 'bg-white/20 text-slate-700';
    else cls += 'bg-white/10 text-slate-500';
    if (getMilestones().includes(i)) cls += ' milestone';
    if (i < currentQuestion) cls += ' passed';
    div.className = cls;
    div.innerHTML = '<div class="flex justify-between items-center"><span>' + (i + 1) + '</span><span>' + formatMoney(prizeLadder[i]) + '</span></div>';
    container.appendChild(div);
  }
}

function getCurrentDifficulty() {
  const q = shuffledQuestions[currentQuestion];
  return q ? q.difficulty || 'media' : 'media';
}

function playQuestionMusic() {
  stopAmb();
  const list = audioFiles.musicaPreguntas;
  if (list && list.length) playAmb(pickRandom(list));
}

function loadQuestionWithSound() {
  stopSfx();
  const diff = getCurrentDifficulty();
  const phase = getGamePhase();
  let introAudio = null;
  if (phase !== 'early' && diff === 'dificil') {
    introAudio = playSfx(audioFiles.suspenso);
  } else if (phase === 'late' && Math.random() < 0.25) {
    introAudio = playSfxRandom('inicioPregunta');
  }
  if (phase !== 'early') playSfxRandomly('faciles', 0.15);
  if (introAudio) introAudio.onended = () => playQuestionMusic();
  else playQuestionMusic();
  loadQuestion();
}

function loadQuestion() {
  const total = getTotalQuestions();
  if (currentQuestion >= total) { endGame(true); return; }
  const q = shuffledQuestions[currentQuestion];
  const diff = q.difficulty || 'media';
  const t = themes[diff] || themes.facil;

  const permutated = q.answers.map((text, i) => ({ text, original: i }));
  const shuffledAnswers = shuffleArray(permutated);
  currentCorrectIndex = shuffledAnswers.findIndex(item => item.original === q.correct);

  applyTheme(diff);
  document.getElementById('difficultyText').textContent = 'Dificultad ' + t.label;
  document.getElementById('difficultyIcon').innerHTML = '<i data-lucide="' + t.icon + '" class="w-5 h-5 lg:w-6 lg:h-6"></i>';
  document.getElementById('categoryBadge').textContent = q.category || '';
  document.getElementById('question').textContent = q.question;
  document.getElementById('money').textContent = formatMoney(prizeLadder[currentQuestion]);
  document.getElementById('levelText').textContent = 'Pregunta ' + (currentQuestion + 1) + '/' + total;

  const pct = ((currentQuestion + 1) / total) * 100;
  document.getElementById('progress').style.width = pct + '%';

  const answersContainer = document.getElementById('answers');
  answersContainer.innerHTML = '';
  const letters = ['A','B','C','D'];
  shuffledAnswers.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = 'answer glass rounded-3xl p-4 lg:p-5 text-left font-medium text-base lg:text-lg text-slate-800';
    btn.innerHTML = '<div class="flex items-center gap-3 lg:gap-4"><div class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white/30 flex items-center justify-center font-bold shrink-0">' + letters[index] + '</div><span>' + item.text + '</span></div>';
    btn.onclick = () => checkAnswer(index);
    answersContainer.appendChild(btn);
  });
  renderMoneyLadder();
  startTimer();
  try { lucide.createIcons(); } catch(e) {}
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 30;
  document.getElementById('timerDisplay').textContent = timeLeft;
  document.getElementById('timerDisplay').classList.remove('timer-warn');
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timerDisplay').textContent = Math.max(0, timeLeft);
    if (timeLeft <= 10) document.getElementById('timerDisplay').classList.add('timer-warn');
    else document.getElementById('timerDisplay').classList.remove('timer-warn');
    if (timeLeft === 10 && getCurrentDifficulty() === 'dificil') playSfx(audioFiles.cuentaAtras);
    if (timeLeft < 0) { timeLeft = 0; clearInterval(timer); }
  }, 1000);
}

function checkAnswer(selectedIndex) {
  clearInterval(timer);
  if (sfxPlayer.audio) sfxPlayer.audio.onended = null;
  stopAmb();
  const q = shuffledQuestions[currentQuestion];
  const buttons = document.querySelectorAll('.answer');
  buttons.forEach(b => b.disabled = true);
  if (selectedIndex === currentCorrectIndex) {
    buttons[selectedIndex].classList.add('correct');
    currentPrize = prizeLadder[currentQuestion];
    const phase = getGamePhase();
    playSfx(audioFiles.respuestaCorrecta);
    if (phase !== 'early' && q.difficulty === 'media' && Math.random() < 0.3) playSfxRandom('correctas');
    if (phase !== 'early' && q.difficulty === 'dificil') {
      if (Math.random() < 0.6) playSfxRandom('correctas');
      if (Math.random() < 0.4) playSfxRandom('dificiles');
    }

    const wasMilestone = isMilestoneReached();

    setTimeout(() => {
      currentQuestion++;
      used5050 = false;

      if (wasMilestone && currentQuestion < getTotalQuestions()) {
        const m = getMilestones();
        const milestoneIdx = m.indexOf(currentQuestion - 1);
        if (milestoneIdx === 1) playSfx('assets/audio/preguntas-faciles/buenos-dias-estrellitas.mp3');
        setTimeout(() => showMilestoneChoice(prizeLadder[currentQuestion - 1]), 800);
      } else {
        loadQuestionWithSound();
      }
    }, 2500);
  } else {
    buttons[selectedIndex].classList.add('wrong');
    buttons[currentCorrectIndex].classList.add('correct');
    stopAmb();
    const failAudio = playSfxRandom('incorrectas');
    if (failAudio) {
      failAudio.onended = () => endGame(false);
    } else {
      setTimeout(() => endGame(false), 2500);
    }
  }
}

function useLifeline(type) {
  if (!lifelines[type]) { showModal('Comodín Agotado', 'Ya has usado este comodín.'); return; }
  const q = shuffledQuestions[currentQuestion];
  if (type === '5050') {
    if (used5050) { showModal('Comodín Agotado', 'Ya usaste el 50:50 en esta pregunta.'); return; }
    use5050(q); playSfxRandom('poderes'); playSfxRandomly('atencion', 0.4);
  } else if (type === 'phone') {
    usePhone(q); playSfxRandom('ayudas'); playSfxRandomly('atencion', 0.5);
  } else {
    usePublic(q); playSfxRandom('votacion'); playSfxRandomly('ayudas', 0.6);
  }
  lifelines[type] = false;
  document.getElementById('btn' + (type === '5050' ? '5050' : type.charAt(0).toUpperCase() + type.slice(1))).disabled = true;
}

function use5050() {
  const buttons = document.querySelectorAll('.answer');
  const toRemove = shuffleArray([0,1,2,3].filter(i => i !== currentCorrectIndex)).slice(0,2);
  toRemove.forEach(i => { buttons[i].style.opacity = '0.25'; buttons[i].disabled = true; });
  used5050 = true;
}

function usePhone() {
  const confidence = Math.random();
  const msg = confidence > 0.6
    ? 'Tu amigo dice: "Estoy ' + Math.floor(confidence * 100) + '% seguro de que es la opción ' + String.fromCharCode(65 + currentCorrectIndex) + '"'
    : 'Tu amigo dice: "Creo que es la opción ' + String.fromCharCode(65 + Math.floor(Math.random() * 4)) + ', pero no estoy muy seguro..."';
  showModal('📞 Llamada a un Amigo', msg);
}

function usePublic() {
  const p = [0,0,0,0]; let r = 100;
  p[currentCorrectIndex] = Math.floor(Math.random() * 40) + 40; r -= p[currentCorrectIndex];
  for (let i = 0; i < 4; i++) { if (i !== currentCorrectIndex) { if (i === 3) p[i] = r; else { const v = Math.floor(Math.random() * r); p[i] = v; r -= v; } } }
  const l = ['A','B','C','D'];
  showModal('👥 Ayuda del Público', 'Distribución:\n' + l.map((a,i) => a + ': ' + p[i] + '%').join('\n'));
}

function showModal(title, text) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').textContent = text;
  const md = document.getElementById('modal');
  md.classList.remove('hidden');
  md.style.display = 'flex';
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }

function showMilestoneChoice(prize) {
  awaitingMilestoneChoice = true;
  const modal = document.getElementById('modal');
  modal.innerHTML = '<div class="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 max-w-md w-full mx-4 text-slate-800 text-center shadow-2xl">' +
    '<div class="text-2xl font-bold mb-4">🏆 ¡SEGURO ALCANZADO! 🏆</div>' +
    '<div class="text-base text-slate-600 mb-6">Has asegurado <b>' + formatMoney(prize) + '</b>.<br><br>¿Qué deseas hacer?</div>' +
    '<div class="flex flex-col sm:flex-row gap-3 justify-center">' +
    '<button id="continueBtn" class="bg-white text-slate-800 px-6 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition">🎯 Seguir jugando</button>' +
    '<button id="retireBtn" class="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition">💰 Retirarme con ' + formatMoney(prize) + '</button>' +
    '</div></div>';
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.getElementById('continueBtn').onclick = () => {
    awaitingMilestoneChoice = false; modal.style.display = 'none';
    restoreModal(); loadQuestionWithSound();
  };
  document.getElementById('retireBtn').onclick = () => {
    awaitingMilestoneChoice = false; modal.style.display = 'none'; restoreModal();
    const meme = playSfxRandom('ayudas');
    if (meme) meme.onended = () => endGame(false, false, prize);
    else endGame(false, false, prize);
  };
}

function restoreModal() {
  const modal = document.getElementById('modal');
  modal.innerHTML = '<div class="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 max-w-md w-full mx-4 text-slate-800 text-center shadow-2xl">' +
    '<div class="modal-title text-2xl font-bold mb-4" id="modalTitle"></div>' +
    '<div class="modal-text text-base text-slate-600 mb-6" id="modalText"></div>' +
    '<button class="close-modal bg-white text-slate-800 px-6 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition" onclick="closeModal()">Cerrar</button></div>';
}

function goToStart() {
  stopAllAudio();
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('readyContent').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
  updateLevelInfo();
  playBg(audioFiles.temaPrincipal);
}

function endGame(won, timeout = false, retiredPrize = 0) {
  clearInterval(timer);
  stopAllAudio();
  document.getElementById('gameArea').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('hidden');
  playBg(audioFiles.resultados);
  const t = document.getElementById('endTitle');
  const m = document.getElementById('endMessage');
  const p = document.getElementById('endPrize');
  if (retiredPrize > 0) {
    t.textContent = '💰 ¡Sabia decisión! 💰';
    m.textContent = 'Te retiraste a tiempo. ¡Bien jugado!';
    p.textContent = 'Te llevas: ' + formatMoney(retiredPrize);
    return;
  }
  if (timeout) { t.textContent = '⏰ ¡Se acabó el tiempo!'; m.textContent = 'No respondiste a tiempo.'; }
  else if (won) { t.textContent = '🎉 ¡FELICIDADES! 🎉'; m.textContent = '¡Eres millonario! Respondiste correctamente todas las preguntas.'; p.textContent = formatMoney(prizeLadder[getTotalQuestions() - 1]); return; }
  else { t.textContent = '❌ PERDISTE'; m.textContent = 'Respuesta incorrecta.'; }
  let gp = 0;
  for (const ms of [...getMilestones()].reverse()) { if (currentQuestion > ms) { gp = prizeLadder[ms]; break; } }
  p.textContent = gp > 0 ? 'Te llevas: ' + formatMoney(gp) : 'No ganas premio. ¡Inténtalo de nuevo!';
}

function restartGame() { stopAllAudio(); shuffledQuestions = []; startGame(); }
