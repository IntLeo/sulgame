# Jogo de Cobertura Wi-Fi - GameFi

Este projeto é um **jogo interativo** desenvolvido para a **Sulnet**, com o objetivo de ensinar e demonstrar como posicionar roteadores de forma eficiente para cobrir áreas de um mapa com o sinal Wi-Fi.

## 🎮 Sobre o Jogo

O usuário recebe um mapa com áreas marcadas e deve posicionar os roteadores estrategicamente para cobrir o maior número de áreas possível, dentro de um limite de tempo e quantidade de roteadores.

As áreas são coloridas dinamicamente conforme a força do sinal:
- 🟢 **Verde**: Cobertura excelente
- 🟡 **Amarelo**: Cobertura aceitável
- 🔴 **Vermelho**: Sem cobertura

O jogo possui múltiplos níveis e dá feedback visual ao final de cada etapa.

## 🛠 Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript Puro (Vanilla JS)**

## 📂 Estrutura do Projeto

- `index.html` — Página principal do jogo
- `style.css` — Estilos visuais
- `script.js` — Lógica de jogo (como movimentação, contagem, validação)
- `mapas.js` — Arquivo com os dados dos mapas e níveis
- `img/` — Imagens usadas no jogo (mapas, roteadores)

## 🚀 Como Executar

1. Clone ou baixe este repositório
2. Coloque os arquivos em um servidor local (ex: XAMPP, WAMP, ou `Live Server` no VS Code)
3. Abra o `index.html` no navegador

> 💡 Este jogo funciona tanto com **mouse** quanto com **toque** (touch), adaptado para dispositivos móveis e desktops.

## 📌 Funcionalidades

- Posicionamento dinâmico de roteadores por `drag and drop`
- Compatibilidade com touch (dispositivos móveis)
- Níveis com tempo limite
- Validação automática de cobertura
- Feedback visual e de progresso

# 🏠 Formulário Interativo de Conectividade – Sulnet

Um questionário interativo desenvolvido com **HTML, CSS e JavaScript** para identificar o modelo ideal de conectividade para a sua residência.

---

## 📋 Descrição

Este projeto oferece uma experiência guiada ao usuário através de uma série de perguntas (número, texto, checkbox, radio, telefone) para determinar o plano de internet perfeito. Com base no tamanho da casa, número de moradores, tipos de uso da internet e existência de anexos, o sistema valida as respostas e gera uma sugestão personalizada, incluindo a quantidade ideal de roteadores e o preço estimado.

---

## ✨ Funcionalidades

* **Navegação intuitiva:** Botão "PRÓXIMO" para avançar entre as perguntas.
* **Validação robusta:** Campos obrigatórios para garantir informações completas.
* **Seleção controlada:** Limite de até 2 opções em campos do tipo checkbox.
* **Máscara de telefone:** Formatação automática com a biblioteca Cleave.js.
* **Cálculo inteligente de roteadores:** Determinação automática da quantidade ideal baseada nas características da residência.
* **Sugestão personalizada:** Geração dinâmica de texto com nome, uso da internet e plano recomendado.
* **Feedback visual:** Animação de carregamento antes da exibição do resultado final.
* **Pronto para integração:** Estrutura para fácil conexão com backend PHP para envio de dados como lead.

---

## 🧠 Lógica de Cálculo da Rede Ideal

* **Até 80m²:** 1 roteador
* **A cada 50m² adicionais:** +1 roteador
* **Anexo externo (ex: área de lazer):** +1 roteador
* **Custo adicional por roteador:** + R$ 24,90
* **Plano base:** 700 MEGA - R$ 119,90

---

## ⚙️ Estrutura das Perguntas

As perguntas são definidas em um array de objetos JavaScript com a seguinte estrutura:

```javascript
const perguntas = [
  {
    titulo: "PERGUNTA 1",
    texto: "Texto explicativo",
    pergunta: "Texto da pergunta",
    tipo: "number" | "text" | "tel" | "checkbox" | "radio",
    opcoes: ["Opção 1", "Opção 2"] // somente para checkbox ou radio
  },
  // ... mais perguntas
];
```

---

## 🚀 Funcionalidades

* Navegação entre perguntas com botão "PRÓXIMO"
* Validação obrigatória para todos os tipos de campo
* Limitação de seleção para checkbox (máx. 2 opções)
* Máscara para campo de telefone com Cleave.js
* Cálculo automático da quantidade ideal de roteadores
* Geração dinâmica de texto personalizado com nome, uso e plano sugerido
* Animação de carregamento antes de mostrar o resultado final
* Pronto para integração com backend PHP para envio dos dados como lead

---

## 📦 Requisitos

* Biblioteca Cleave.js para máscaras de telefone
* PHP (usado no backend para comunicação e criação de Lead)

---

## 📄 Licença

* Este projeto é de uso exclusivo da empresa Sulnet. Pode ser modificado para fins internos e comerciais conforme a necessidade.
  
---

## 👨‍💻 Autor

Desenvolvido por **Leonardo Machado**  
