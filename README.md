# 🍺 ¿Quién quiere ser el Borracho?

Juego web de preguntas con temática de tragos. Responde correctamente para evitar los shots. Si pierdes, la ruleta decide tu castigo.

## 🎮 ¿De qué trata?

Pon a prueba tus conocimientos respondiendo preguntas de opción múltiple. Cada respuesta correcta te acerca a la victoria. Cada respuesta incorrecta activa la **ruleta de castigos** que decide cuántos shots tomas (o repartes).

### Llegaste a un seguro

Cada ciertas preguntas alcanzas una **zona segura**. Puedes retirarte y activar una **ruleta de retiro** (con daños colaterales para los demás), o seguir jugando para ser el Rey de la fiesta.

### Ruletas

- **🎰 Ruleta de castigo** — Al perder: decide qué te toca (desde salvarte hasta 3 shots)
- **🎲 Ruleta de retiro** — Al retirarte en un seguro: castigos compartidos con la mesa
- **🪙 Moneda** — Si sale en la ruleta, la lanzas manualmente (cara = 2 shots, sello = nada)

---

## 🎯 Cómo jugar

1. Elige **3 o 5 zonas seguras** en la pantalla de inicio
2. Presiona **COMENZAR** y luego **INICIAR**
3. Responde cada pregunta en **30 segundos**
4. Al llegar a una zona segura, decide si seguir o retirarte
5. Si pierdes, la ruleta de castigo decide tu destino

---

## 🛠️ Tecnologías

- HTML5, CSS3 y JavaScript vanilla
- Tailwind CSS (CDN) + Lucide Icons (CDN)
- Banco de preguntas en 3 archivos JSON separados por dificultad
- Sonidos en 3 canales independientes (música, ambiente, efectos)
- `crypto.getRandomValues()` para aleatoriedad criptográfica
- Despliegue automático a GitHub Pages vía GitHub Actions

---

## 📂 Estructura del proyecto

```
quien-quiere-ser-millonario/
├── index.html              # Interfaz principal (HTML + Tailwind CSS)
├── js/
│   ├── audio.js            # Sistema de audio (3 canales, playlists, mute)
│   ├── questions.js        # Carga y selección de preguntas por dificultad
│   ├── roulette.js         # Ruleta de castigo/retiro + moneda
│   ├── game.js             # Lógica del juego (checkAnswer, timer, seguros)
│   └── main.js             # Init, eventos DOM, control de volumen
├── questions.json          # Banco combinado (185 preguntas, autogenerado)
├── faciles.json            # Preguntas fáciles (70)
├── medias.json             # Preguntas medias (50)
├── dificiles.json          # Preguntas difíciles (65)
├── assets/
│   ├── audio/              # Memes organizados por categoría
│   │   ├── inicio-pregunta/
│   │   ├── respuestas-correctas/
│   │   ├── respuestas-incorrectas/
│   │   ├── poderes-habilidades/
│   │   ├── ayudas/
│   │   ├── preguntas-faciles/
│   │   ├── preguntas-dificiles/
│   │   └── mitad-juego/
│   ├── audios/             # Fuente original de audios (intacta)
│   └── *.mp3               # Sonidos del juego (tema, ruleta, votación...)
├── .github/
│   └── workflows/
│       └── deploy.yml      # Deploy automático a GitHub Pages
└── README.md
```

---

## 🚀 Despliegue en GitHub Pages

1. Sube el repositorio a GitHub
2. Ve a **Settings > Pages**
3. En **Build and deployment > Source**, selecciona **GitHub Actions**
4. Haz push a `main` — el workflow se ejecuta automáticamente

URL: `https://<tu-usuario>.github.io/<nombre-repo>/`

---

## ✏️ Personalizar

### Editar preguntas

Las preguntas están en 3 archivos JSON separados por dificultad. Cada uno tiene esta estructura:

```json
{
  "preguntas": [
    {
      "id": 1,
      "categoria": "Nostalgia TV y Animación",
      "dificultad": "Baja",
      "pregunta": "¿Cómo se llama el ogro verde que vive en un pantano?",
      "opciones": ["Hulk", "Shrek", "Sulley", "Mike Wazowski"],
      "respuesta_correcta": "Shrek"
    }
  ]
}
```

Después de editar, regenera `questions.json`:

```bash
node -e "
const fs = require('fs');
const path = require('path');
const dir = __dirname;
function readJSON(file) { return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); }
function convert(data, diff) {
  const key = data.preguntas ? 'preguntas' : 'preguntas_continuacion_hardcore';
  return data[key].map(q => {
    const idx = q.opciones.indexOf(q.respuesta_correcta);
    return { question: q.pregunta, answers: q.opciones, correct: idx, category: q.categoria, difficulty: diff };
  }).filter(q => q.correct !== -1);
}
const all = [...convert(readJSON('faciles.json'),'facil'), ...convert(readJSON('medias.json'),'media'), ...convert(readJSON('dificiles.json'),'dificil')];
fs.writeFileSync(path.join(dir, 'questions.json'), JSON.stringify(all, null, 2), 'utf8');
console.log('Total:', all.length);
"
```

### Agregar música y efectos

Coloca archivos `.mp3` en sus carpetas correspondientes dentro de `assets/audio/` o directamente en `assets/`. El juego los referencia desde `js/audio.js` en el objeto `audioFiles`.

### Cambiar la escalera de tragos

Edita el array `drinkLadder` en `js/game.js` para modificar las consecuencias de cada pregunta.

---

## 📝 Licencia

Proyecto personal sin fines comerciales.
