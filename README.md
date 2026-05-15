# ¿Quién Quiere Ser Millonario? - Edición Colombia 🇨🇴

Juego web interactivo inspirado en el clásico programa de televisión "¿Quién quiere ser millonario?", con temática colombiana y cultura pop de los años 90 y 2000.

## 🎮 ¿De qué trata?

Pon a prueba tus conocimientos respondiendo 15 preguntas de opción múltiple. Cada respuesta correcta te acerca más al premio máximo de **$300.000.000 COP**. Pero cuidado: una respuesta incorrecta y el juego termina.

### Categorías de preguntas

- **Colombia** — Historia, geografía, cultura, deportes y personajes colombianos
- **Dibujos animados** — Series animadas clásicas de los 80s, 90s y 2000s
- **Series de TV** — Programas de televisión colombianos e internacionales
- **Películas** — Cine clásico, blockbusters y cine colombiano
- **Jerga colombiana** — Expresiones y modismos del habla popular
- **Preguntas graciosas** — Chistes, colmos y humor ligero
- **Tecnología retro** — Gadgets y tecnología de los 90s y 2000s

## 🎯 Cómo jugar

1. Presiona **COMENZAR** en la pantalla de inicio
2. Se te presentarán 15 preguntas con 4 opciones cada una
3. Tienes **30 segundos** para responder cada pregunta
4. Selecciona la respuesta que creas correcta haciendo clic en ella

### Premios y hitos garantizados

| Pregunta | Premio |
|---|---|
| 5 | $1.000.000 |
| 10 | $10.000.000 |
| 15 | $300.000.000 |

Si fallas antes de la pregunta 5, no ganas nada. Si fallas después de un hito, te llevas el premio de ese hito.

### Comodines

Tienes **3 comodines** disponibles durante toda la partida:

- **50:50** — Elimina 2 respuestas incorrectas (una vez por pregunta)
- **📞 Llamada** — Un amigo te dará su opinión (no siempre confiable)
- **👥 Público** — El público vota y muestra los porcentajes

## 🛠️ Tecnologías

- HTML5, CSS3 y JavaScript (vanilla, sin frameworks)
- Archivo JSON externo para el banco de preguntas
- Diseño responsive adaptable a móviles
- Sin dependencias externas

## 📂 Estructura del proyecto

```
quien-quiere-ser-millonario/
├── index.html              # Página principal con el juego completo
├── questions.json          # Banco de preguntas (editable)
├── README.md               # Este archivo
├── assets/
│   └── audio/              # Carpeta para música y efectos (opcional)
└── .github/
    └── workflows/
        └── deploy.yml      # Despliegue automático a GitHub Pages
```

## 🚀 Despliegue en GitHub Pages

Este proyecto incluye un workflow de GitHub Actions para desplegar automáticamente a GitHub Pages cada vez que hagas push a la rama `main`.

### Pasos para activar:

1. Sube el repositorio a GitHub
2. Ve a **Settings > Pages** del repositorio
3. En "Source", selecciona **GitHub Actions**
4. El workflow `Deploy to GitHub Pages` se ejecutará automáticamente

El sitio quedará disponible en `https://<tu-usuario>.github.io/<nombre-repo>/`

## ✏️ Cómo personalizar

### Editar preguntas

Abre `questions.json` y verás la estructura de cada pregunta:

```json
{
    "question": "Texto de la pregunta",
    "answers": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correct": 0,
    "category": "colombia"
}
```

- `correct`: índice de la respuesta correcta (0 = A, 1 = B, 2 = C, 3 = D)
- `category`: categoría para organización (no afecta el juego)

### Agregar música

Coloca archivos `.mp3` o `.ogg` en `assets/audio/` y edita el script en `index.html` para reproducirlos. El juego usa el botón COMENZAR como interacción del usuario, requisito para que los navegadores permitan autoplay de audio.

### Cambiar premios

Edita el array `prizeLadder` dentro de `index.html` para modificar los montos.

## 📝 Licencia

Proyecto personal sin fines comerciales. Inspirado en el formato original de "Who Wants to Be a Millionaire?" de la cadena ABC.
