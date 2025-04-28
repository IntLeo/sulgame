areas: [
    "Sala",
    "Cozinha",
    "Quarto",
    "Banheiro",
    "Varanda",
    "Garagem",
    "Escritório",
    "Lavanderia",
    "Sala de Jantar",
    "Closet"
  ]
  
  const mapas = [
    {
      nome: "Casa Pequena 1",
      imagem: "../img/casa1-cinza.png",
      areas: ["Sala", "Cozinha", "Quarto", "Banheiro"]
    },
    {
      nome: "Casa Pequena 2",
      imagem: "../img/casa2-cinza.png",
      areas: ["Sala", "Cozinha", "Quarto", "Banheiro", "Varanda"]
    },
    {
      nome: "Casa Grande",
      imagem: "../img/casa3-cinza.png",
      areas: ["Sala", "Cozinha", "Quarto 1", "Quarto 2", "Banheiro 1", "Banheiro 2", "Garagem", "Lavanderia", "Escritório", "Sala de Jantar"]
    }
  ];
  
  
  /* Estilos para filtros da fase 1 */
  .fase-1 #area1 { top: 20px; left: 30px; width: 100px; height: 80px; }
  .fase-1 #area2 { top: 120px; left: 50px; width: 90px; height: 70px; }
  /* E assim por diante */
  
  /* Estilos para filtros da fase 2 */
  .fase-2 #area1 { top: 10px; left: 10px; width: 120px; height: 90px; }
  .fase-2 #area2 { top: 100px; left: 40px; width: 80px; height: 60px; }
  /* Etc */
  
  
  function carregarFase(fase) {
    const imgPlanta = document.querySelector('.planta-img');
    const plantaContainer = document.querySelector('.planta-container');
  
    // Atualizar a imagem
    if (fase === 1) {
      imgPlanta.src = "../img/casa1-cinza.png";
  
      plantaContainer.innerHTML = `
        <img src="../img/casa1-cinza.png" class="planta-img" />
        <div class="filtro-area1" id="area1"></div>
        <div class="filtro-area2" id="area2"></div>
        <!-- Áreas da casa 1 -->
      `;
    } else if (fase === 2) {
      imgPlanta.src = "../img/casa2-cinza.png";
  
      plantaContainer.innerHTML = `
        <img src="../img/casa2-cinza.png" class="planta-img" />
        <div class="filtro-area1" id="area1"></div>
        <div class="filtro-area2" id="area2"></div>
        <div class="filtro-area3" id="area3"></div>
        <!-- Áreas diferentes da casa 2 -->
      `;
    }
  }
  
  


  // Lista de mapas
const mapas = [
    {
      nome: "Nivel1",
      imagem: "../img/casa1-cinza.png",
      areas: ["Sala", "Cozinha", "Quarto", "Banheiro"]
    },
    {
      nome: "Casa Média",
      imagem: "../img/casa2-cinza.png",
      areas: ["Sala", "Cozinha", "Quarto 1", "Quarto 2", "Banheiro", "Lavanderia", "Varanda"]
    },
    {
      nome: "Casa Grande",
      imagem: "../img/casa3-cinza.png",
      areas: ["Sala", "Cozinha", "Quarto 1", "Quarto 2", "Quarto 3", "Banheiro 1", "Banheiro 2", "Garagem", "Escritório", "Sala de Jantar", "Lavanderia", "Varanda", "Closet", "Biblioteca", "Área Gourmet"]
    }
  ];
  
  // Controle de qual fase está
  let nivelAtual = 0;
  
  // Função para carregar o mapa
  function carregarMapa(mapa) {
    const plantaContainer = document.querySelector('.planta-container');
  
    let html = `<img src="${mapa.imagem}" class="planta-img" />`;
  
    mapa.areas.forEach((nomeArea, index) => {
      html += `<div class="filtro-area" id="area${index+1}" data-nome="${nomeArea}"></div>`;
    });
  
    plantaContainer.innerHTML = html;
  }
  
  // Função para trocar para o próximo nível
  function trocarNivel() {
    nivelAtual++;
  
    if (nivelAtual >= mapas.length) {
      nivelAtual = 0; // Volta para o início se passar do último
    }
  
    const mapaSelecionado = mapas[nivelAtual];
    carregarMapa(mapaSelecionado);
  }
  
  // Carrega o primeiro mapa ao iniciar
  carregarMapa(mapas[nivelAtual]);
  



  /* Estilos para filtros da fase 1 */




quarto-1
