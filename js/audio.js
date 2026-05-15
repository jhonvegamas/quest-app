// audio.js — Sistema de audio (3 canales), playlists, volumen, mute
// Debe cargarse PRIMERO

function log(msg) { console.log('[audio ' + new Date().toISOString().substr(11,12) + '] ' + msg); }

function getVol(id) { const el = document.getElementById(id); return el ? parseInt(el.value) / 100 : 0.5; }

const bgPlayer   = { audio: null };
const ambPlayer  = { audio: null };
const sfxPlayer  = { audio: null };

function enc(u) { return encodeURI(u); }

function playBg(src, loop = true) {
  log('► BG  ' + src.split('/').pop());
  try { if (bgPlayer.audio) { bgPlayer.audio.pause(); bgPlayer.audio.onended = null; bgPlayer.audio.src = ''; bgPlayer.audio.load(); } } catch(e) {}
  bgPlayer.audio = new Audio(enc(src));
  bgPlayer.audio.loop = loop;
  bgPlayer.audio.volume = getVol('musicVolume');
  bgPlayer.audio.play().catch(() => {});
  return bgPlayer.audio;
}
function stopBg() { log('■ BG  STOP'); try { if (bgPlayer.audio) { bgPlayer.audio.pause(); bgPlayer.audio.onended = null; bgPlayer.audio.src = ''; bgPlayer.audio.load(); } } catch(e) {} }

function playAmb(src) {
  log('► AMB ' + src.split('/').pop());
  try { if (ambPlayer.audio) { ambPlayer.audio.pause(); ambPlayer.audio.onended = null; ambPlayer.audio.src = ''; ambPlayer.audio.load(); } } catch(e) {}
  ambPlayer.audio = new Audio(enc(src));
  ambPlayer.audio.volume = getVol('musicVolume');
  ambPlayer.audio.play().catch(() => {});
  return ambPlayer.audio;
}
function stopAmb() { log('■ AMB STOP'); try { if (ambPlayer.audio) { ambPlayer.audio.pause(); ambPlayer.audio.onended = null; ambPlayer.audio.src = ''; ambPlayer.audio.load(); } } catch(e) {} }

function playSfx(src) {
  log('► SFX ' + src.split('/').pop());
  try { if (sfxPlayer.audio) { sfxPlayer.audio.pause(); sfxPlayer.audio.onended = null; sfxPlayer.audio.src = ''; sfxPlayer.audio.load(); } } catch(e) {}
  sfxPlayer.audio = new Audio(enc(src));
  sfxPlayer.audio.volume = getVol('sfxVolume');
  sfxPlayer.audio.play().catch(() => {});
  return sfxPlayer.audio;
}
function stopSfx() { log('■ SFX STOP'); try { if (sfxPlayer.audio) { sfxPlayer.audio.pause(); sfxPlayer.audio.onended = null; sfxPlayer.audio.src = ''; sfxPlayer.audio.load(); } } catch(e) {} }

function stopAllAudio() { stopBg(); stopAmb(); stopSfx(); }

function updateAllVolumes() {
  const mv = getVol('musicVolume');
  const sv = getVol('sfxVolume');
  try { if (bgPlayer.audio)   bgPlayer.audio.volume   = mv; } catch(e) {}
  try { if (ambPlayer.audio)  ambPlayer.audio.volume  = mv; } catch(e) {}
  try { if (sfxPlayer.audio)  sfxPlayer.audio.volume  = sv; } catch(e) {}
}

const audioFiles = {
  temaPrincipal:      'assets/tema principal.mp3',
  introJuego:         'assets/inicio juego_.mp3',
  atencion:           ['assets/pregunta-de-atencion_.mp3', 'assets/pregunta-tencion.mp3'],
  votacion:           ['assets/pregunta-votacion.mp3', 'assets/ayuda publico.mp3'],
  suspenso:           'assets/pregunta-suspenso.mp3',
  cuentaAtras:        'assets/cuenta-atras.mp3',
  resultados:         'assets/resultados-del-juego_.mp3',
  respuestaCorrecta:  'assets/respuesta-correcta.mp3',
  preguntas:          'assets/preguntas.mp3',
  inicioPregunta: [
    'assets/audio/inicio-pregunta/quien-quiere-ser-millonario_ScfDHTc.mp3',
    'assets/audio/inicio-pregunta/que-dificil-me-la-pusiste-diablo.mp3'
  ],
  correctas: [
    'assets/audio/respuestas-correctas/adam-sandler-que-ricooooo.mp3',
    'assets/audio/respuestas-correctas/blue-label-de-johnnie-walker.mp3',
    'assets/audio/respuestas-correctas/corre-pocoyo_ZmkqM4O.mp3',
    'assets/audio/respuestas-correctas/el-monte-everest-no-tiene-nada-en-contra-de-mi.mp3',
    'assets/audio/respuestas-correctas/el-senor-de-la-noche-don-omar.mp3',
    'assets/audio/respuestas-correctas/esquivo-esquivo_lC4gBbN.mp3',
    'assets/audio/respuestas-correctas/intro-uefa-champions-league2.mp3',
    'assets/audio/respuestas-correctas/la-bebecita-saturado.mp3',
    'assets/audio/respuestas-correctas/los-noto-asustados-petro.mp3',
    'assets/audio/respuestas-correctas/senor-me-has-mirado-a-los-ojos.mp3',
    'assets/audio/respuestas-correctas/si-a-bueno.mp3',
    'assets/audio/respuestas-correctas/super-excelente-maravilloso.mp3',
    'assets/audio/respuestas-correctas/ya-no-aguanto-mas.mp3'
  ],
  incorrectas: [
    'assets/audio/respuestas-incorrectas/arrepientete-hijo-del-diablo.mp3',
    'assets/audio/respuestas-incorrectas/fail-sound-effect.mp3',
    'assets/audio/respuestas-incorrectas/miau-triste.mp3',
    'assets/audio/respuestas-incorrectas/nadie-ama-a-calvin-por-chaparro.mp3',
    'assets/audio/respuestas-incorrectas/no-creo.mp3',
    'assets/audio/respuestas-incorrectas/no-estes-fumando.mp3',
    'assets/audio/respuestas-incorrectas/oh-no-no-no-tik-tok-song-sound-effect.mp3',
    'assets/audio/respuestas-incorrectas/quede-minimo-comun.mp3',
    'assets/audio/respuestas-incorrectas/sad_sad.mp3',
    'assets/audio/respuestas-incorrectas/spongebob-fail.mp3'
  ],
  poderes: [
    'assets/audio/poderes-habilidades/damn-damn-damn-son.mp3',
    'assets/audio/poderes-habilidades/va-jugar-o-que.mp3',
    'assets/audio/poderes-habilidades/dios-mio-salvame.mp3'
  ],
  ayudas: [
    'assets/audio/ayudas/a-colombia-la-esta-matando-la-pereza.mp3',
    'assets/audio/ayudas/a-mi-se-me-hace-que-eres-marica_INzinVu.mp3',
    'assets/audio/ayudas/among-us-role-reveal-sound.mp3',
    'assets/audio/ayudas/detecto-de-marica-activado.mp3',
    'assets/audio/ayudas/estaba-paralizado-con-mucho-miedo.mp3',
    'assets/audio/ayudas/identificate.mp3',
    'assets/audio/ayudas/los-noto-asustados-petro.mp3',
    'assets/audio/ayudas/no-puedo-tengo-sida.mp3',
    'assets/audio/ayudas/no-sea-tan-sapo-tan-lambon-marica.mp3',
    'assets/audio/ayudas/pelea-de-invalidos-south-park.mp3',
    'assets/audio/ayudas/por-favor-necesito-pito-me-muero.mp3',
    'assets/audio/ayudas/por-fin-apareciste-malnacido-picoro.mp3',
    'assets/audio/ayudas/que-bendicion.mp3',
    'assets/audio/ayudas/se-ha-detectado-un-peruano.mp3',
    'assets/audio/ayudas/senora-su-hijo-esta-biendo_dFaNfQi.mp3',
    'assets/audio/ayudas/n0-digas-mamadas.mp3'
  ],
  faciles: [
    'assets/audio/preguntas-faciles/alarma-petro.mp3',
    'assets/audio/preguntas-faciles/anime-ahh.mp3',
    'assets/audio/preguntas-faciles/buenos-dias-estrellitas.mp3'
  ],
  dificiles: [
    'assets/audio/preguntas-dificiles/acostate-a-dormir.mp3',
    'assets/audio/preguntas-dificiles/en-ese-momento-cell-sintio-el-verdadero-terror-v-descarga.mp3',
    'assets/audio/preguntas-dificiles/ya-no-aguanto-mas_GRvlFPI.mp3',
    'assets/audio/respuestas-correctas/tuve-fe.mp3'
  ],
  mitadJuego:     ['assets/audio/mitad-juego/quiero-tomar-cerveza.mp3'],
  musicaPreguntas: ['assets/preguntas.mp3','assets/pregunta-suspenso.mp3','assets/audio/inicio-pregunta/quien-quiere-ser-millonario_ScfDHTc.mp3']
};

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

let lastPlayedFile = '';
function pickRandomNoRepeat(arr) {
  if (!arr || !arr.length) return null;
  const filtered = arr.filter(f => f !== lastPlayedFile);
  const file = filtered.length ? pickRandom(filtered) : pickRandom(arr);
  lastPlayedFile = file;
  return file;
}

function playSfxRandom(listKey) {
  const list = audioFiles[listKey];
  if (!list || !list.length) return null;
  return playSfx(pickRandomNoRepeat(list));
}

function playSfxRandomly(listKey, prob = 0.4) {
  if (Math.random() < prob) return playSfxRandom(listKey);
  return null;
}
