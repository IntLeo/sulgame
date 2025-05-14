const perguntas = [
  {
    titulo: "OLÁ",
    texto:
      "VAMOS DESCOBRIR QUAL O MODELO DE CONECTIVIDADE IDEAL PARA SUA CASA?",
    pergunta: "Primeiro, sua casa possui quantos m²? (Aprox.)",
    tipo: "number",
  },
  {
    titulo: "PERGUNTA 2",
    texto: "Quantas pessoas utilizam internet diariamente?",
    pergunta: "Informe um número:",
    tipo: "number",
  },
  {
    titulo: "PERGUNTA 3",
    texto: "Você utiliza internet para quais finalidades principais?",
    pergunta: "(Selecione no máximo 2)",
    tipo: "checkbox",
    opcoes: ["Assistir filmes/séries", "Trabalhar", "Estudar", "Informar"],
  },
  {
    titulo: "PERGUNTA 4",
    texto:
      "Você tem algum anexo? (Ex: Festeiro, área de piscina, quarto de hóspedes externo, etc)",
    pergunta: "Selecione uma opção:",
    tipo: "radio",
    opcoes: ["Sim", "Não"],
  },
  {
    titulo: "PERGUNTA 5",
    texto: "Por fim, qual o seu nome?",
    pergunta: "Nome completo:",
    tipo: "text",
  },
  {
    titulo: "PERGUNTA 6",
    texto: "E telefone?",
    pergunta: "Digite seu telefone:",
    tipo: "tel",
  },
];

let passo = 0;
let respostas = [];

function renderPergunta() {
  const card = document.getElementById("formCard");
  const atual = perguntas[passo];
  let inputHTML = "";

  if (atual.tipo === "checkbox" || atual.tipo === "radio") {
    inputHTML = atual.opcoes
      .map(
        (opcao, index) => `
        <div class="form-check mb-2">
          <input class="form-check-input" type="${atual.tipo}" name="resposta" id="opcao${index}" value="${opcao}">
          <label class="form-check-label" for="opcao${index}">${opcao}</label>
        </div>`
      )
      .join("");
  } else {
    
    inputHTML = `<input type="${atual.tipo}" class="input-line mb-4" id="resposta" />`;
  }

 
  card.innerHTML = `
    <img src="../img/anexo/logo-sulnet.png" alt="Logo Sulnet" class="logo mb-3">
    <h1>${atual.titulo}</h1>
    <strong><p class="mb-3">${atual.texto}</p></strong>
    <p class="mb-2">${atual.pergunta}</p>
    ${inputHTML}
    <div id="mensagemErro" style="color: red; font-weight: bold; margin-bottom: 10px;"></div>
    <button class="btn-gradient" onclick="proximaPergunta()">PRÓXIMO</button>
  `;

  
  if (atual.tipo === "tel") {
    new Cleave("#resposta", {
      delimiters: ["(", ") ", "-", ""],
      blocks: [0, 2, 5, 4],
      numericOnly: true,
    });
  }
}

function proximaPergunta() {
  let resposta;

  const atual = perguntas[passo];
  if (atual.tipo === "checkbox") {
    const checkboxes = document.querySelectorAll(
      'input[name="resposta"]:checked'
    );
    if (checkboxes.length === 0) {
      document.getElementById("mensagemErro").innerText = "Selecione pelo menos uma opção.";
      return;
    }
    if (checkboxes.length > 2) {
      document.getElementById("mensagemErro").innerText = "Selecione no máximo 2 opções.";
      return;
    }
    
    resposta = Array.from(checkboxes).map((el) => el.value);
  } else if (atual.tipo === "radio") {
    const selecionado = document.querySelector(
      'input[name="resposta"]:checked'
    );
    if (!selecionado) {
      document.getElementById("mensagemErro").innerText = "Selecione uma opção.";
      return;
    }
    resposta = selecionado.value;
  } else {
    resposta = document.getElementById("resposta").value;
    document.getElementById("mensagemErro").innerText = ""; // limpa o erro antigo
    
    if (!resposta) {
      document.getElementById("mensagemErro").innerText = "Por favor, preencha a resposta.";
      return;
    }
    
    if (perguntas[passo].tipo === "tel") {
      const telefoneNumeros = resposta.replace(/\D/g, "");
      if (telefoneNumeros.length < 11 || telefoneNumeros.length > 13) {
        document.getElementById("mensagemErro").innerText = "Digite o número completo com DDD e número. Ex: 55 9 3520-8000";
        return;
      }
      resposta = telefoneNumeros; 
    }
    
    
  }

  respostas.push(resposta);

  if (passo < perguntas.length - 1) {
    passo++;
    renderPergunta();
  } else {
    document.getElementById("formCard").innerHTML = `
      <h1>Obrigado!</h1>
      <p>Estamos identificando a melhor opção de conectividade para você...</p>
      <div class="loader"></div> <!-- loader simples -->
    `;

    setTimeout(() => {
      const nome = respostas[4];
      const usos = respostas[2];
      const metragem = parseInt(respostas[0]);
      const anexo = respostas[3];
      let redeIdeal = "";
      
      let qtdRoteadores = 1;
      if (metragem > 70) {
        qtdRoteadores = 1 + Math.ceil((metragem - 70) / 60);
      }

    
      let finalidade = usos.map(u => u.toLowerCase());
      if (finalidade.length === 1 && finalidade[0] === "informar") {
        finalidade = "se informar";
      } else if (finalidade.includes("informar") && finalidade.length > 1) {
        const ultima = finalidade.pop();
        finalidade = `${finalidade.join(" e ")} e se ${ultima}`;
      } else {
        finalidade = finalidade.join(" e ");
      }
      
      if (anexo == "Sim") {
        qtdRoteadores++;
      }

      if(qtdRoteadores === 1){
        redeIdeal = "[1 ROTEADOR]";
      }else{
        redeIdeal = `[700 MEGA COM ${qtdRoteadores} ROTEADORES EM MESH]`;
      }

      let mensagem = ``;
 
      if (qtdRoteadores == 1) {

        mensagem = `
            <h1>${nome},</h1>
          <p>Para sua casa estar sempre conectada e você <strong>${finalidade}</strong> sem interrupções, a rede ideal para você é <strong>${redeIdeal}.</strong></p>
          <p>A Sulnet tem o plano perfeito pra você: <strong>700 MEGA por R$119,90</strong></p>
          <p>Em breve, um de nossos vendedores entrará em contato para te ajudar a garantir seu plano agora mesmo!</p>
          <p>Com a Sulnet, conecte todos os ambientes da sua casa com economia e estabilidade!</p>
        `;
      } else if (qtdRoteadores == 2) {
        mensagem = `
            <h1>${nome},</h1>
          <p>Para sua casa estar sempre conectada e você <strong>${finalidade} </strong>sem interrupções, a rede ideal para você é <strong>${redeIdeal}.</strong></p>
          <p>A Sulnet tem o plano perfeito pra você e ainda com uma condição especial: Assinando sua <strong>rede personalizada</strong> entre os dias <strong>16 e 25 de maio</strong>, você ganha o <strong>segundo roteador</strong> totalmente de graça pelos primeiros 6 meses.</p>
          <p>Em breve, um de nossos vendedores entrará em contato para te ajudar a garantir seu plano especial!</p>
          <p>Com a Sulnet, conecte todos os ambientes da sua casa com economia e estabilidade!</p>
        `;
      } else {
              mensagem = `
            <h1>${nome},</h1>
          <p>Para sua casa estar sempre conectada e você <strong>${finalidade} </strong>sem interrupções, a rede ideal para você é <strong>${redeIdeal}.</strong></p>
          <p>A Sulnet tem o plano perfeito pra você e ainda com uma condição especial: Assinando sua <strong>rede personalizada</strong> entre os dias <strong>16 e 25 de maio</strong>, você ganha um dos<strong> roteadorres adicionais</strong> totalmente de graça pelos primeiros 6 meses.</p>
          <p>Em breve, um de nossos vendedores entrará em contato para te ajudar a garantir seu plano especial!</p>
          <p>Com a Sulnet, conecte todos os ambientes da sua casa com economia e estabilidade!</p>
        `;
      }

     
     document.getElementById("formCard").innerHTML = mensagem;
     const entradaDados = `${respostas[4]} - ${respostas[5]} - ${respostas[3]} - ${qtdRoteadores}`;
      
     //Linha que envia os dados para o PHP a fim de criar a LEAD
      enviarDados(entradaDados, respostas[5]); 
      
    }, 4000);
  }
}

renderPergunta();

function enviarDados(entradaDados, telefone) {
  fetch("EnviaLead.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      entradaDados: entradaDados,
      telefone: telefone,
    }),
  })
    .then((response) => {
      if (response.ok) {
      } else {
        console.error("Erro ao enviar os dados.");
      }
    })
    .catch((error) => {
      console.error("Erro de rede:", error);
    });
}
