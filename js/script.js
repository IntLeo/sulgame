// Fatores para cobertura
const RAIO_FORTE_FACTOR = 0.55; // <= 55% do raio → sinal forte (verde)
const RAIO_FRACO_FACTOR = 0.85; // <= 85% do raio → sinal fraco (amarelo)
const RAIO_REFERENCIA_FIXO = 450; // pixels, alcance fixo de cobertura

// Estado de jogo
let timeLeft = 10; // segundos
let timerInterval = null;
let gameStarted = false;

// Elementos de UI
let timerBox;
let nivelAtual = 0;
let limite_roteador = 0;

/**
 * Habilita arrastar (drag & drop) em um elemento .dispositivo
 */

const mapas = [
  {
    nome: "Nivel 1",
    imagem: "../img/nivel-1/mapa-1.svg",
    areas: [
      { nome: "sala", top: "2.2%", left: "61.4%", width: "32.85%", height: "62%" },
      { nome: "sala-angulo", top: "22%", left: "94.21%", width: "4.7%", height: "10%", clipPath: "polygon(0% 0%, 0% 100%, 100% 100%)" },
      { nome: "sala-recorte", top: "32%", left: "94.21%", width: "4.53%", height: "32.2%" },
      { nome: "corredor", top: "49.3%", left: "20.7%", width: "40.7%", height: "14.9%" },
      { nome: "cozinha", top: "66.1%", left: "61.4%", width: "37.35%", height: "31.8%" },
      { nome: "quarto-1", top: "2.2%", left: "1.1%", width: "27.2%", height: "44.9%" },
      { nome: "quarto-2", top: "2.2%", left: "40%", width: "20.4%", height: "44.9%" },
      { nome: "quarto-3", top: "49.3%", left: "1.1%", width: "18.6%", height: "48.6%" },
      { nome: "quarto-3-recorte", top: "66.1%", left: "19.7%", width: "24.2%", height: "31.8%" },
      { nome: "banheiro-1", top: "2.2%", left: "29.3%", width: "9.7%", height: "44.7%" },
      { nome: "banheiro-2", top: "66.1%", left: "44.9%", width: "15.5%", height: "31.8%" },
    ],
    roteadores: 2,
  }
];


function carregarMapa(mapa) {
  const plantaContainer = document.querySelector('.planta-container');

  let html = `<img src="${mapa.imagem}" class="planta-img" />`;

  mapa.areas.forEach((area, index) => {
    html += `
      <div class="filtro-area" 
           id="area${index+1}" 
           data-nome="${area.nome}"
           style="
             top: ${area.top}; 
             left: ${area.left}; 
             width: ${area.width}; 
             height: ${area.height};
             ${area.clipPath ? `clip-path: ${area.clipPath};` : ''}
           ">
      </div>`;
  });

  plantaContainer.innerHTML = html;
  limite_roteador = mapa.roteadores;
}


carregarMapa(mapas[nivelAtual]);

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
  const filtros = document.querySelectorAll(".filtro-area");
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

    // Define a cor conforme a distância
    if (menorDist <= RAIO_FORTE_FACTOR * RAIO_REFERENCIA_FIXO) {
      filtro.style.backgroundColor = "rgba(0,255,0,0.4)"; // Cobertura forte
    } else if (menorDist <= RAIO_FRACO_FACTOR * RAIO_REFERENCIA_FIXO) {
      filtro.style.backgroundColor = "rgba(255,255,0,0.4)"; // Cobertura fraca
    } else {
      filtro.style.backgroundColor = "rgba(255,0,0,0.4)"; // Sem cobertura
    }
  });
}

function validateAll() {
  const filtros = document.querySelectorAll(".filtro-area");
  const total = filtros.length;

  const greenCount = Array.from(filtros).filter((filtro) => {
    const bg = window.getComputedStyle(filtro).backgroundColor;
    // Verifica se é verde (considerando qualquer formato de rgba/rgb)
    return bg.includes("0, 255, 0");
  }).length;

  if (gameStarted) {
    mostrarNotificacao(greenCount, total);
  }
}

/**
 * Cria e adiciona um novo dispositivo (roteador) na planta
 */
function addDevice() {
  const container = document.querySelector(".editor");
  const existingCount = container.querySelectorAll(".dispositivo").length;
  if (existingCount >= limite_roteador) {
    alert(`Limite de ${limite_roteador} dispositivos atingido.`);
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
