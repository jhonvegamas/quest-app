// main.js — Inicialización, eventos DOM, volumen, mute

window.addEventListener('DOMContentLoaded', loadQuestions);

function updateLevelInfo() {
  const mode = getLevelMode();
  const total = getTotalQuestions();
  document.getElementById('levelInfo').innerHTML = mode === 3
    ? '<i data-lucide="layers" class="w-3.5 h-3.5 inline"></i> 3 seguros · 10 preguntas · Fácil → Difícil'
    : '<i data-lucide="layers" class="w-3.5 h-3.5 inline"></i> 5 seguros · 20 preguntas · Fácil → Difícil 🚀';
  const m = getMilestones();
  document.getElementById('milestoneDisplay').innerHTML = m.map(i =>
    '<p>Pregunta ' + (i + 1) + ': ' + formatMoney(prizeLadder[i]) + '</p>'
  ).join('');
}

// Volume controls
let musicMuted = false, sfxMuted = false;
const musicSlider = document.getElementById('musicVolume');
const sfxSlider   = document.getElementById('sfxVolume');
const musicLabel  = document.getElementById('musicVolumeLabel');
const sfxLabel    = document.getElementById('sfxVolumeLabel');
const musicIcon   = document.getElementById('musicIcon');
const sfxIcon     = document.getElementById('sfxIcon');

function toggleMute(type) {
  if (type === 'music') {
    musicMuted = !musicMuted;
    musicSlider.value = musicMuted ? '0' : (musicSlider.dataset.last || '40');
    musicLabel.textContent = musicSlider.value + '%';
    musicIcon.textContent = musicMuted ? '🔇' : '🎵';
  } else {
    sfxMuted = !sfxMuted;
    sfxSlider.value = sfxMuted ? '0' : (sfxSlider.dataset.last || '70');
    sfxLabel.textContent = sfxSlider.value + '%';
    sfxIcon.textContent = sfxMuted ? '🔇' : '🔊';
  }
  updateAllVolumes();
}

musicSlider.addEventListener('input', function() {
  musicLabel.textContent = this.value + '%';
  musicMuted = this.value === '0';
  musicIcon.textContent = musicMuted ? '🔇' : '🎵';
  if (this.value !== '0') this.dataset.last = this.value;
  updateAllVolumes();
});

sfxSlider.addEventListener('input', function() {
  sfxLabel.textContent = this.value + '%';
  sfxMuted = this.value === '0';
  sfxIcon.textContent = sfxMuted ? '🔇' : '🔊';
  if (this.value !== '0') this.dataset.last = this.value;
  updateAllVolumes();
});

window.onclick = function(e) {
  if (awaitingMilestoneChoice) return;
  const modal = document.getElementById('modal');
  if (e.target === modal) closeModal();
};
