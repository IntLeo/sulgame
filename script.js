const dispositivos = document.querySelectorAll('.dispositivo');

// Fatores para cobertura
const RAIO_FORTE_FACTOR = 0.55;  // <= 60% do raio → sinal forte (verde)
const RAIO_FRACO_FACTOR = 0.85;  // <= 100% do raio → sinal fraco (amarelo)
// > 100% do raio → sem cobertura (vermelho)

dispositivos.forEach(dispositivo => {
  dispositivo.addEventListener('mousedown', e => {
    e.preventDefault();
    const shiftX = e.clientX - dispositivo.getBoundingClientRect().left;
    const shiftY = e.clientY - dispositivo.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      dispositivo.style.left = pageX - shiftX + 'px';
      dispositivo.style.top  = pageY - shiftY + 'px';
      atualizarCoberturaGlobal();
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
    document.addEventListener('mousemove', onMouseMove);

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mouseup', onMouseUp);
  });

  dispositivo.ondragstart = () => false;

});


const RAIO_REFERENCIA_FIXO = 440; // pixels

function atualizarCoberturaGlobal() {
  const filtros = document.querySelectorAll('.filtro-area1, .filtro-area2, .filtro-area3, .filtro-area4, .filtro-area5, .filtro-area6, .filtro-area7, .filtro-area8, .filtro-area9, .filtro-area10');

  filtros.forEach(filtro => {
    const filtroRect = filtro.getBoundingClientRect();
    const centroFiltroX = filtroRect.left + filtroRect.width / 2;
    const centroFiltroY = filtroRect.top + filtroRect.height / 2;

    let menorDistancia = Infinity;

    dispositivos.forEach(dispositivo => {
      const dispRect = dispositivo.getBoundingClientRect();
      const centroDispX = dispRect.left + dispRect.width / 2;
      const centroDispY = dispRect.top + dispRect.height / 2;

      const distancia = Math.sqrt(
        Math.pow(centroDispX - centroFiltroX, 2) +
        Math.pow(centroDispY - centroFiltroY, 2)
      );

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
      }
    });

    // Usando valor fixo
    const raioReferencia = RAIO_REFERENCIA_FIXO;

    if (menorDistancia <= RAIO_FORTE_FACTOR * raioReferencia) {
      filtro.style.backgroundColor = 'rgba(0, 255, 0, 0.4)';
    } else if (menorDistancia <= RAIO_FRACO_FACTOR * raioReferencia) {
      filtro.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
    } else {
      filtro.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
    }
  });
}
