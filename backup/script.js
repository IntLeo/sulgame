// Fatores para cobertura
const RAIO_FORTE_FACTOR = 0.55; // <= 55% do raio → sinal forte (verde)
const RAIO_FRACO_FACTOR = 0.85; // <= 85% do raio → sinal fraco (amarelo)
const RAIO_REFERENCIA_FIXO = 370; // pixels, alcance fixo de cobertura

// Estado de jogo
let timeLeft = 10; // segundos
let timerInterval = null;
let gameStarted = false;

// Elementos de UI
let timerBox;

const MAX_DEVICES = 2;

/**
 * Habilita arrastar (drag & drop) em um elemento .dispositivo
 */

function mudarFase(fase) {
  const body = document.querySelector('body');

  // Remove qualquer classe de fase anterior
  body.classList.remove('fase-1', 'fase-2', 'fase-3');

  // Adiciona a nova
  body.classList.add(`fase-${fase}`);
}


function enableDrag(dispositivo) {
  dispositivo.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (!gameStarted) startTimer();
    const rect = dispositivo.getBoundingClientRect();
    const shiftX = e.clientX - rect.left;
    const shiftY = e.clientY - rect.top;

    function moveAt(pageX, pageY) {
      dispositivo.style.left = pageX - shiftX + "px";
      dispositivo.style.top = pageY - shiftY + "px";
      atualizarCoberturaGlobal();
    }

    function onMouseMove(ev) {
      moveAt(ev.pageX, ev.pageY);
    }
    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    });
  });

  dispositivo.ondragstart = () => false;
}

function startTimer() {
  gameStarted = true;
  if (!timerBox) return;
  timerBox.textContent = `${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerBox.textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      validateAll();
    }
  }, 1000);
}

/**
 * Recalcula a cor de cada filtro com base no dispositivo mais próximo e atualiza score
 */
function atualizarCoberturaGlobal() {
  const filtros = document.querySelectorAll(
    ".filtro-area1, .filtro-area2, .filtro-area3, .filtro-area4, " +
      ".filtro-area5, .filtro-area6, .filtro-area7, .filtro-area8, " +
      ".filtro-area9, .filtro-area10"
  );
  const dispositivos = document.querySelectorAll(".dispositivo");

  filtros.forEach((filtro) => {
    const fr = filtro.getBoundingClientRect();
    const cx = fr.left + fr.width / 2;
    const cy = fr.top + fr.height / 2;

    let menorDist = Infinity;
    dispositivos.forEach((d) => {
      const dr = d.getBoundingClientRect();
      const dx = dr.left + dr.width / 2 - cx;
      const dy = dr.top + dr.height / 2 - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < menorDist) menorDist = dist;
    });

    // Usa raio fixo para todos os filtros (uniforme)
    if (menorDist <= RAIO_FORTE_FACTOR * RAIO_REFERENCIA_FIXO) {
      filtro.style.backgroundColor = "rgba(0,255,0,0.4)";
    } else if (menorDist <= RAIO_FRACO_FACTOR * RAIO_REFERENCIA_FIXO) {
      filtro.style.backgroundColor = "rgba(255,255,0,0.4)";
    } else {
      filtro.style.backgroundColor = "rgba(255,0,0,0.4)";
    }
  });
}

function validateAll() {
  const filtros = document.querySelectorAll(
    ".filtro-area1, .filtro-area2, .filtro-area3, .filtro-area4, " +
      ".filtro-area5, .filtro-area6, .filtro-area7, .filtro-area8, " +
      ".filtro-area9, .filtro-area10"
  );
  const total = filtros.length;
  const greenCount = Array.from(filtros).filter((f) => {
    const bg = window.getComputedStyle(f).backgroundColor;
    return bg.includes("0, 255, 0");
  }).length;

  if (gameStarted == true) {
    mostrarNotificacao(greenCount, total);
  }
}

/**
 * Cria e adiciona um novo dispositivo (roteador) na planta
 */
function addDevice() {
  const container = document.querySelector(".editor");
  const existingCount = container.querySelectorAll(".dispositivo").length;
  if (existingCount >= MAX_DEVICES) {
    alert(`Limite de ${MAX_DEVICES} dispositivos atingido.`);
    return;
  }

  const count = existingCount + 1;
  const disp = document.createElement("div");
  disp.classList.add("dispositivo");
  disp.style.left = "50%";
  disp.style.top = "50%";

  const abrang = document.createElement("div");
  abrang.classList.add("abrangencia");
  disp.appendChild(abrang);

  const img = document.createElement("img");
  img.src = "../img/anexo/roteador.png";
  img.alt = `Roteador-${count}`;
  disp.appendChild(img);

  container.appendChild(disp);
  enableDrag(disp);
  atualizarCoberturaGlobal();
}

// Inicialização após carregar a página
document.addEventListener("DOMContentLoaded", () => {
  // Obtém referência ao timer embutido no HTML
  timerBox = document.getElementById("timerBox");

  // Habilita drag para dispositivos já existentes
  document.querySelectorAll(".dispositivo").forEach(enableDrag);

  // Configura botão de adicionar dispositivo
  document.getElementById("btnAddDevice").addEventListener("click", addDevice);

  const validateBtn = document.getElementById("btnValidate");
  if (validateBtn) validateBtn.addEventListener("click", validateAll);
  // Primeira verificação de cobertura
  atualizarCoberturaGlobal();
});

function mostrarNotificacao(greenCount, total) {
  const notification = document.getElementById("notification");

  if (greenCount === total) {
    notification.style.background = "#4caf50";
    notification.innerHTML =
      " <h2>🎉 Fase Concluída! 🎉</h2> <p>Parabéns! Você completou esta fase!</p>";
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
      // Aqui você pode carregar a próxima fase ou mudar a página
      // window.location.href = "/";
    }, 3000);
  } else {
    if (timeLeft <= 0) {
      notification.style.background = "#ff0000cc";
      notification.innerHTML =
        "<h2>🚨 Tempo Esgotado! 🚨</h2> <p>Game Over!</p>";
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    } else {
      notification.style.background = "#ecdd02cc";
      notification.innerHTML =
        " <h2>⚠️ Fase Incompleta! ⚠️</h2> <p>Continue a tentativa ainda há tempo!</p>";
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 1500);
    }
  }
}
