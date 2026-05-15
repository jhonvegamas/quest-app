// roulette.js — Ruleta horizontal de castigo y retiro (manual, con moneda)

const castigoOptions = [
  { emoji: '🥃',   label: 'Toma 1',               desc: 'Un shot para ti' },
  { emoji: '🥃🥃', label: 'Toma 2',               desc: 'Dos shots para ti' },
  { emoji: '🔥',   label: 'Castigo',               desc: 'Tres shots para ti' },
  { emoji: '🃏',   label: 'Te salvas',             desc: 'No tomas nada' },
  { emoji: '🪙',   label: '¡Moneda!',              desc: 'Cara = 2 shots / Sello = 0' },
  { emoji: '🛢️',   label: 'Sacar petróleo',       desc: '5 vueltas a la mesa' },
  { emoji: '🍻',   label: 'Todos toman 1',         desc: 'Ronda grupal contigo' },
];

const retiroOptions = [
  { emoji: '🥃🥃', label: 'Toma 2',         desc: 'Dos shots tú' },
  { emoji: '🍻',   label: 'Todos toman 1',  desc: 'Repartes un shot a cada uno' },
  { emoji: '👉',   label: 'Señalas a 2',    desc: 'Dos personas toman 1' },
  { emoji: '🔥',   label: 'Castigo',         desc: 'Tú 3 + resto 1' },
  { emoji: '🃏',   label: 'Te salvas tú',    desc: 'Tú 0, el resto sigue igual' },
  { emoji: '👑',   label: 'Rey',             desc: 'Eliges quién toma 3' },
];

let rouletteResult = null;
let rouletteResolve = null;

function spinRoulette(options) {
  return new Promise(resolve => {
    rouletteResolve = resolve;
    rouletteResult = options[Math.floor(Math.random() * options.length)];

    const modal = document.getElementById('modal');
    const itemW = options.length <= 6 ? 120 : 100;
    let html = '<div class="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 pb-6 max-w-lg w-full mx-4 text-slate-800 text-center shadow-2xl">';
    html += '<div class="text-lg font-bold mb-2">🎰 ¡GIRA LA RULETA! 🎰</div>';
    html += '<div class="text-xs text-slate-500 mb-2">Presiona el botón para girar</div>';

    // Sliding strip
    html += '<div style="overflow:hidden;position:relative;height:90px;margin:0 -2rem 0.5rem;">';
    html += '<div id="rouletteStrip" style="display:flex;position:absolute;left:0;top:0;white-space:nowrap;">';

    for (let r = 0; r < 30; r++) {
      options.forEach(opt => {
        html += '<div class="roulette-item" style="min-width:' + itemW + 'px;height:90px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:2.2rem;opacity:0.4;padding:0 8px;">';
        html += '<div>' + opt.emoji + '</div>';
        html += '<div style="font-size:0.55rem;font-weight:600;color:#475569;">' + opt.label + '</div>';
        html += '</div>';
      });
    }
    html += '</div>';
    html += '<div style="position:absolute;top:0;left:175px;width:' + itemW + 'px;height:100%;border:3px solid #ffd700;border-radius:8px;z-index:2;box-shadow:0 0 14px rgba(255,215,0,0.4),inset 0 0 14px rgba(255,215,0,0.1);transform:translateX(-50%);pointer-events:none;"></div>';
    html += '<div style="position:absolute;top:-6px;left:175px;transform:translateX(-50%);font-size:1rem;z-index:3;color:#ffd700;">▼</div>';
    html += '</div>';

    // Result area
    html += '<div id="rouletteResult" class="mb-3" style="min-height:70px;"></div>';

    // Buttons
    html += '<div class="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-1">';
    html += '<button id="rouletteSpinBtn" class="bg-cyan-500 text-white px-8 py-3 rounded-2xl font-bold shadow hover:scale-105 transition pulse-soft">🎰 GIRAR</button>';
    html += '<button id="rouletteClose" class="bg-white text-slate-800 px-6 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition hidden" onclick="closeRoulette()">OK</button>';
    html += '</div>';
    html += '</div>';

    modal.innerHTML = html;
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    const strip = document.getElementById('rouletteStrip');
    const totalStripWidth = options.length * 30 * itemW;
    strip.style.width = totalStripWidth + 'px';
    const targetIdx = options.findIndex(o => o === rouletteResult);
    const stopIdx = (15 * options.length) + targetIdx;
    const offset = stopIdx * itemW - 175 + Math.floor(itemW / 2);

    document.getElementById('rouletteSpinBtn').onclick = () => {
      const btn = document.getElementById('rouletteSpinBtn');
      btn.disabled = true;
      btn.classList.remove('pulse-soft');
      btn.textContent = '🎰 Girando...';

      playSfx(audioFiles.ruletaGira);
      strip.style.transition = 'transform 6s cubic-bezier(0.12,0.02,0.25,0.95)';
      strip.style.transform = 'translateX(-' + offset + 'px)';

      setTimeout(() => {
        btn.style.display = 'none';
        showRouletteResult();
      }, 6200);
    };
  });
}

function showRouletteResult() {
  const resultDiv = document.getElementById('rouletteResult');

  if (rouletteResult.label === '¡Moneda!') {
    resultDiv.innerHTML = '<div class="text-3xl mb-1">🪙</div><div class="font-bold text-slate-700 mb-2">¡Te salió la moneda!</div>';
    const coinBtn = document.createElement('button');
    coinBtn.id = 'coinFlipBtn';
    coinBtn.textContent = '🪙 LANZAR MONEDA';
    coinBtn.className = 'bg-yellow-400 text-slate-800 px-6 py-2 rounded-2xl font-bold shadow hover:scale-105 transition';
    resultDiv.appendChild(coinBtn);

    coinBtn.onclick = () => {
      coinBtn.disabled = true;
      coinBtn.textContent = '🪙 Girando...';
      resultDiv.querySelector('div:first-child').classList.add('animate-flip');
      setTimeout(() => {
        const cara = Math.random() < 0.5;
        const final = cara
          ? { emoji: '🪙', label: '¡Cara! Toma 2', desc: '🥃🥃 Dos shots para ti' }
          : { emoji: '🪙', label: '¡Sello! Nada', desc: '🃏 Te salvaste' };
        rouletteResult = final;
        resultDiv.innerHTML = '<div class="text-4xl mb-2">' + final.emoji + '</div>' +
          '<div class="text-xl font-bold text-slate-700">' + final.label + '</div>' +
          '<div class="text-sm text-slate-500">' + final.desc + '</div>';
        document.getElementById('rouletteClose').classList.remove('hidden');
      }, 1500);
    };
  } else {
    resultDiv.innerHTML = '<div class="text-4xl mb-2">' + rouletteResult.emoji + '</div>' +
      '<div class="text-xl font-bold text-slate-700">' + rouletteResult.label + '</div>' +
      '<div class="text-sm text-slate-500">' + rouletteResult.desc + '</div>';
    document.getElementById('rouletteClose').classList.remove('hidden');
  }
}

window.closeRoulette = function() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  restoreRouletteModal();
  if (rouletteResolve) { rouletteResolve(rouletteResult); rouletteResolve = null; }
};

function restoreRouletteModal() {
  const modal = document.getElementById('modal');
  modal.innerHTML = '<div class="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 max-w-md w-full mx-4 text-slate-800 text-center shadow-2xl">' +
    '<div class="modal-title text-2xl font-bold mb-4" id="modalTitle"></div>' +
    '<div class="modal-text text-base text-slate-600 mb-6" id="modalText"></div>' +
    '<button class="close-modal bg-white text-slate-800 px-6 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition" onclick="closeModal()">Cerrar</button></div>';
}
