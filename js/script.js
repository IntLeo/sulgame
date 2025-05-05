
import { mapas } from './mapas.js';

const RAIO_FORTE_FACTOR = 0.55; //(verde)
const RAIO_FRACO_FACTOR = 0.85; //(amarelo)
let RAIO_REFERENCIA_FIXO = 0; 

let timeLeft = 0; 
let timerInterval = null;
let gameStarted = false;

let timerBox;
let nivelAtual = 1;
let mapaAtual = null;
let limite_roteador = 0;

function carregarMapa(mapa) {
  mapaAtual = mapa;

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

  document.querySelector('.planta-container').style.maxWidth = mapa.tamanho;


  timeLeft = mapa.dificuldadeTempo;
  const timerBoxx = document.getElementById("timerBox");
  timerBoxx.innerHTML = `${timeLeft}s`;

  limite_roteador = mapa.roteadores;
  atualizarContadorRoteadores(); 
  atualizarCoberturaGlobal(); 

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

          function atualizarCoberturaGlobal() {
            const filtros = document.querySelectorAll(".filtro-area");
            const dispositivos = document.querySelectorAll(".dispositivo");
          
            const raioVerde = RAIO_REFERENCIA_FIXO * RAIO_FORTE_FACTOR;
            const raioAmarelo = RAIO_REFERENCIA_FIXO * RAIO_FRACO_FACTOR;
          
            const grupos = {}; // { nomeBase: [filtro1, filtro2, ...] }
          
            // Agrupar áreas com mesmo nome-base (ex: sala, sala-recorte...)
            filtros.forEach((filtro) => {
              const nomeBase = filtro.dataset.nome.split("-")[0];
              if (!grupos[nomeBase]) grupos[nomeBase] = [];
              grupos[nomeBase].push(filtro);
            });
          
            // Agora avaliamos cada grupo como um todo
            Object.entries(grupos).forEach(([nomeGrupo, filtrosGrupo]) => {
              let totalPontos = 0;
              let totalVerdes = 0;
              let totalAmarelos = 0;
          
              filtrosGrupo.forEach((filtro) => {
                const fr = filtro.getBoundingClientRect();
                const gridSize = 10; // 6x6 grid
                const pontosTotais = gridSize * gridSize;
          
                totalPontos += pontosTotais;
          
                for (let i = 0; i < gridSize; i++) {
                  for (let j = 0; j < gridSize; j++) {
                    const px = fr.left + (fr.width / (gridSize + 1)) * (i + 1);
                    const py = fr.top + (fr.height / (gridSize + 1)) * (j + 1);
          
                    let menorDist = Infinity;
                    dispositivos.forEach((d) => {
                      const dr = d.getBoundingClientRect();
                      const dx = dr.left + dr.width / 2 - px;
                      const dy = dr.top + dr.height / 2 - py;
                      const dist = Math.hypot(dx, dy);
                      if (dist < menorDist) menorDist = dist;
                    });
          
                    if (menorDist <= raioVerde) {
                      totalVerdes++;
                    } else if (menorDist <= raioAmarelo) {
                      totalAmarelos++;
                    }
                  }
                }
              });
          
              const percentVerde = (totalVerdes / totalPontos) * 100;
              const percentAmarelo = ((totalVerdes + totalAmarelos) / totalPontos) * 100;
          
              let cor;
              if (percentVerde >= 70) {
                cor = "rgba(0,255,0,0.4)";
              } else if (percentAmarelo >= 70) {
                cor = "rgba(255,255,0,0.4)";
              } else {
                cor = "rgba(255,0,0,0.4)";
              }
          
              // Aplica cor em todas as partes do grupo
              filtrosGrupo.forEach((filtro) => {
                filtro.style.backgroundColor = cor;
              });
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
  
  if (mapaAtual?.abrangencia) {
    atualizarAbrangencia(abrang, mapaAtual.abrangencia.width, mapaAtual.abrangencia.height);
  }
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

  sortearMapa(nivelAtual);

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
    gameStarted = false; 
    if (nivelAtual >= 5) {
      
      window.location.href = "parabens.html";
    }else{
      
      notification.style.background = "#4caf50";
      notification.innerHTML =
      ` <h2>🎉 Nível Concluído! 🎉</h2> <p>Parabéns! Você completou o ${nivelAtual}º Nível!</p>`;
      notification.classList.add("show");
      
      setTimeout(() => {
        notification.classList.remove("show");
        const dispositivos = document.querySelectorAll(".dispositivo");
        dispositivos.forEach((disp) => disp.remove());
        nivelAtual++;
        sortearMapa(nivelAtual);
        
      }, 3000);
    };
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
        ` <h2>⚠️ Nível ${nivelAtual} Incompleto! ⚠️</h2> <p>Continue a tentativa ainda há ${timeLeft} segundos!</p>`;
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 1500);
    }
  }
}

function sortearMapa(numeroNivel) {
  const chaveNivel = `nivel-${numeroNivel}`;
  const mapasDoNivel = mapas[chaveNivel];

  if (!mapasDoNivel || mapasDoNivel.length === 0) {
    console.warn(`Nenhum mapa encontrado para o nível ${numeroNivel}`);
    return;
  }

  const mapaSorteado = mapasDoNivel[Math.floor(Math.random() * mapasDoNivel.length)];
  console.log(mapaSorteado);
  carregarMapa(mapaSorteado);
}

function atualizarAbrangencia(elemento, width, height) {
  if (!elemento) return;
  elemento.style.width = width;
  elemento.style.height = height;
}


document.addEventListener('contextmenu', event => event.preventDefault());