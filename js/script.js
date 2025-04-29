// Fatores para cobertura
const RAIO_FORTE_FACTOR = 0.55; // <= 55% do raio → sinal forte (verde)
const RAIO_FRACO_FACTOR = 0.85; // <= 85% do raio → sinal fraco (amarelo)
let RAIO_REFERENCIA_FIXO = 0;

let timeLeft = 0;
let timerInterval = null;
let gameStarted = false;

let timerBox;
let nivelAtual = 0;
let limite_roteador = 0;

const mapas = [
  {
    nome: "Nível 1",
    subnome: "80m² - 100m²",
    dificuldadeRaio: 447,
    dificuldadeTempo: 25,
    imagem: "../img/nivel-1/mapa-1.svg",
    areas: [
      {
        nome: "sala",
        top: "2.2%",
        left: "61.4%",
        width: "32.85%",
        height: "62%",
      },
      {
        nome: "sala-angulo",
        top: "22%",
        left: "94.21%",
        width: "4.7%",
        height: "10%",
        clipPath: "polygon(0% 0%, 0% 100%, 100% 100%)",
      },
      {
        nome: "sala-recorte",
        top: "32%",
        left: "94.21%",
        width: "4.53%",
        height: "32.2%",
      },
      {
        nome: "corredor",
        top: "49.3%",
        left: "20.7%",
        width: "40.7%",
        height: "14.9%",
      },
      {
        nome: "cozinha",
        top: "66.1%",
        left: "61.4%",
        width: "37.35%",
        height: "31.8%",
      },
      {
        nome: "quarto_1",
        top: "2.2%",
        left: "1.1%",
        width: "27.2%",
        height: "44.9%",
      },
      {
        nome: "quarto_2",
        top: "2.2%",
        left: "40%",
        width: "20.4%",
        height: "44.9%",
      },
      {
        nome: "quarto_3",
        top: "49.3%",
        left: "1.1%",
        width: "18.6%",
        height: "48.6%",
      },
      {
        nome: "quarto_3-recorte",
        top: "66.1%",
        left: "19.7%",
        width: "24.2%",
        height: "31.8%",
      },
      {
        nome: "banheiro_1",
        top: "2.2%",
        left: "29.3%",
        width: "9.7%",
        height: "44.7%",
      },
      {
        nome: "banheiro_2",
        top: "66.1%",
        left: "44.9%",
        width: "15.5%",
        height: "31.8%",
      },
    ],
    roteadores: 2,
  },
  {
    nome: "Nível 2",
    subnome: "100m² - 120m²",
    dificuldadeRaio: 445,
    dificuldadeTempo: 25,
    imagem: "../img/nivel-2/mapa-1.svg",
    areas: [
      {
        nome: "sala",
        top: "55.8%",
        left: "61.3%",
        width: "30.3%",
        height: "42.4%",
      },
      {
        nome: "sala-recorte",
        top: "67.2%",
        left: "91.6%",
        width: "7.4%",
        height: "31%",
      },
      {
        nome: "corredor",
        top: "42.3%",
        left: "14.8%",
        width: "46.1%",
        height: "11.9%",
      },
      {
        nome: "cozinha_1",
        top: "55.8%",
        left: "37.3%",
        width: "24.07%",
        height: "42.4%",
      },
      {
        nome: "cozinha_1-2",
        top: "55.8%",
        left: "14.8%",
        width: "22.5%",
        height: "42.4%",
      },
      {
        nome: "quarto_1",
        top: "1.7%",
        left: "0.87%",
        width: "20.1%",
        height: "31.2%",
      },
      {
        nome: "quarto_1-recorte",
        top: "32.8%",
        left: "14.8%",
        width: "6.2%",
        height: "7.6%",
      },
      {
        nome: "quarto_2",
        top: "1.7%",
        left: "30.7%",
        width: "17.1%",
        height: "38.8%",
      },
      {
        nome: "quarto_3",
        top: "1.7%",
        left: "48.7%",
        width: "12.3%",
        height: "38.8%",
      },
      {
        nome: "quarto_4",
        top: "1.7%",
        left: "61.8%",
        width: "17.2%",
        height: "52.3%",
      },
      {
        nome: "quarto_4-recorte",
        top: "35.4%",
        left: "79%",
        width: "12.7%",
        height: "18.6%",
      },
      {
        nome: "banheiro_1",
        top: "1.7%",
        left: "21.8%",
        width: "8%",
        height: "38.8%",
      },
      {
        nome: "banheiro_2",
        top: "1.7%",
        left: "79.8%",
        width: "11.9%",
        height: "32%",
      },
      {
        nome: "lavanderia",
        top: "34.8%",
        left: "0.87%",
        width: "13.1%",
        height: "19.2%",
      },
    ],
    roteadores: 2,
  },
  {
    nome: "Nível 3",
    subnome: "120m² - 170m²",
    dificuldadeRaio: 445,
    dificuldadeTempo: 30,
    imagem: "../img/nivel-3/mapa-1.svg",
    areas: [
      {
        nome: "festeiro",
        top: "1.4%",
        left: "0.85%",
        width: "26.95%",
        height: "38.1%",
      },
      {
        nome: "cozinha",
        top: "1.3%",
        left: "28.65%",
        width: "36%",
        height: "38.19%",
      },
      {
        nome: "sala",
        top: "1.3%",
        left: "64.65%",
        width: "19%",
        height: "38.1%",
      },
      {
        nome: "sala-recorte",
        top: "26.7%",
        left: "83.65%",
        width: "11.1%",
        height: "12.8%",
      },
      {
        nome: "escritorio",
        top: "1.3%",
        left: "84.5%",
        width: "10.3%",
        height: "24%",
      },
      {
        nome: "lavanderia",
        top: "40.9%",
        left: "0.85%",
        width: "8.37%",
        height: "43.2%",
      },
      {
        nome: "quarto_1-recorte",
        top: "40.9%",
        left: "10%",
        width: "8.2%",
        height: "14%",
      },
      {
        nome: "quarto_1",
        top: "40.9%",
        left: "18.2%",
        width: "16%",
        height: "43.2%",
      },
      {
        nome: "quarto_1-recorte2",
        top: "40.9%",
        left: "34.2%",
        width: "4.35%",
        height: "9%",
      },
      {
        nome: "banheiro_1",
        top: "56.2%",
        left: "10%",
        width: "7.4%",
        height: "27.9%",
      },
      {
        nome: "corredor",
        top: "40.9%",
        left: "39.4%",
        width: "18.7%",
        height: "9%",
      },
      {
        nome: "quarto_2",
        top: "51.1%",
        left: "35%",
        width: "15.1%",
        height: "33%",
      },
      {
        nome: "banheiro_2",
        top: "51.1%",
        left: "50.85%",
        width: "7.3%",
        height: "33%",
      },
      {
        nome: "quarto_3",
        top: "40.9%",
        left: "58.9%",
        width: "15.3%",
        height: "43.2%",
      },
      {
        nome: "garagem",
        top: "40.9%",
        left: "75%",
        width: "25%",
        height: "57.8%",
      },
    ],
    roteadores: 3,
  },
];

function carregarMapa(mapa) {
  const plantaContainer = document.querySelector(".planta-container");

  let html = `<img src="${mapa.imagem}" class="planta-img" />`;

  mapa.areas.forEach((area, index) => {
    html += `
      <div class="filtro-area" 
           id="area${index + 1}" 
           data-nome="${area.nome}"
           style="
             top: ${area.top}; 
             left: ${area.left}; 
             width: ${area.width}; 
             height: ${area.height};
             ${area.clipPath ? `clip-path: ${area.clipPath};` : ""}
           ">
      </div>`;
  });

  plantaContainer.innerHTML = html;
  const nivelHtml = document.getElementById("nivel");
  nivelHtml.innerHTML = `<h1>${mapa.nome}</h1><p>${mapa.subnome}</p>`;

  RAIO_REFERENCIA_FIXO = mapa.dificuldadeRaio;

  timeLeft = mapa.dificuldadeTempo;
  const timerBoxx = document.getElementById("timerBox");
  timerBoxx.innerHTML = `${timeLeft}s`;

  limite_roteador = mapa.roteadores;
  atualizarContadorRoteadores(); 

}

function enableDrag(dispositivo) {
  function startDrag(pageX, pageY, shiftX, shiftY) {
    function moveAt(x, y) {
      dispositivo.style.left = x - shiftX + "px";
      dispositivo.style.top = y - shiftY + "px";
      atualizarCoberturaGlobal();
    }

    function onMouseMove(ev) {
      moveAt(ev.pageX, ev.pageY);
    }

    function onTouchMove(ev) {
      if (ev.touches.length > 0) {
        moveAt(ev.touches[0].pageX, ev.touches[0].pageY);
      }
    }

    function stopDrag() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", stopDrag);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", stopDrag);
  }

  dispositivo.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (!gameStarted) startTimer();
    const rect = dispositivo.getBoundingClientRect();
    const shiftX = e.clientX - rect.left;
    const shiftY = e.clientY - rect.top;
    startDrag(e.pageX, e.pageY, shiftX, shiftY);
  });

  dispositivo.addEventListener("touchstart", (e) => {
    if (!gameStarted) startTimer();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = dispositivo.getBoundingClientRect();
      const shiftX = touch.clientX - rect.left;
      const shiftY = touch.clientY - rect.top;
      startDrag(touch.pageX, touch.pageY, shiftX, shiftY);
      e.preventDefault(); // impede rolagem durante o arrasto
    }
  }, { passive: false });

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

  const grupoDistancias = {}; // Novo: armazenar menor distância por grupo

  filtros.forEach((filtro) => {
    const fr = filtro.getBoundingClientRect();
    const cx = fr.left + fr.width / 2;
    const cy = fr.top + fr.height / 2;
    const nomeGrupo = filtro.dataset.nome.split("-")[0]; // Pega o nome base do grupo

    let menorDist = Infinity;
    dispositivos.forEach((d) => {
      const dr = d.getBoundingClientRect();
      const dx = dr.left + dr.width / 2 - cx;
      const dy = dr.top + dr.height / 2 - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < menorDist) menorDist = dist;
    });

    if (
      !(nomeGrupo in grupoDistancias) ||
      menorDist < grupoDistancias[nomeGrupo]
    ) {
      grupoDistancias[nomeGrupo] = menorDist;
    }
  });

  filtros.forEach((filtro) => {
    const nomeGrupo = filtro.dataset.nome.split("-")[0];
    const menorDist = grupoDistancias[nomeGrupo];

    if (menorDist <= RAIO_FORTE_FACTOR * RAIO_REFERENCIA_FIXO) {
      filtro.style.backgroundColor = "rgba(0,255,0,0.4)"; // Verde
    } else if (menorDist <= RAIO_FRACO_FACTOR * RAIO_REFERENCIA_FIXO) {
      filtro.style.backgroundColor = "rgba(255,255,0,0.4)"; // Amarelo
    } else {
      filtro.style.backgroundColor = "rgba(255,0,0,0.4)"; // Vermelho
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

function atualizarContadorRoteadores() {
  const container = document.querySelector(".editor");
  const existingCount = container.querySelectorAll(".dispositivo").length;
  const roteadoresDisponiveis = limite_roteador - existingCount;
  const limite_roteador_tela = document.getElementById("roteadores-tela");
  limite_roteador_tela.innerHTML = roteadoresDisponiveis;
}

function addDevice() {
  const container = document.querySelector(".editor");
  const existingCount = container.querySelectorAll(".dispositivo").length;
  if (existingCount >= limite_roteador) {
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
  atualizarContadorRoteadores(); 
}


document.addEventListener("DOMContentLoaded", () => {
  carregarMapa(mapas[nivelAtual]);
  

  timerBox = document.getElementById("timerBox");

  document.querySelectorAll(".dispositivo").forEach(enableDrag);

  document.getElementById("btnAddDevice").addEventListener("click", addDevice);

  const validateBtn = document.getElementById("btnValidate");
  if (validateBtn) validateBtn.addEventListener("click", validateAll);

  atualizarCoberturaGlobal();
});


function mostrarNotificacao(greenCount, total) {
  const notification = document.getElementById("notification");

  if (greenCount === total) {
    clearInterval(timerInterval);
    nivelAtual++;
    gameStarted = false; 
    if (nivelAtual >= mapas.length) {
      window.location.href = "parabens.html";
    }

    notification.style.background = "#4caf50";
    notification.innerHTML =
      " <h2>🎉 Fase Concluída! 🎉</h2> <p>Parabéns! Você completou esta fase!</p>";
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
      const dispositivos = document.querySelectorAll(".dispositivo");
      dispositivos.forEach((disp) => disp.remove());

        carregarMapa(mapas[nivelAtual]);
      
    }, 3000);
  } else {
    if (timeLeft <= 0) {
      notification.style.background = "#ff0000cc";
      notification.innerHTML =
        "<h2>🚨 Tempo Esgotado! 🚨</h2> <p>Game Over!</p>";
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        window.location.href = "agradecimento.html";

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
