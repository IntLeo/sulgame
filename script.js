const dispositivos = document.querySelectorAll('.dispositivo');

// Fatores para cobertura
const RAIO_FORTE_FACTOR = 0.6;  // <= 60% do raio → sinal forte (verde)
const RAIO_FRACO_FACTOR = 1.0;  // <= 100% do raio → sinal fraco (amarelo)
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
