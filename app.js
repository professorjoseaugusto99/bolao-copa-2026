import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

console.log("App.js conectado com sucesso!");

// 1. COLOQUE SUAS CREDENCIAIS AQUI
const firebaseConfig = {
  apiKey: "AIzaSyBaD9Ti_9AP4H_EdQYk7FnRyXxgZ08bNOg",
  authDomain: "bolao-copa-2026-a8ce5.firebaseapp.com",
  projectId: "bolao-copa-2026-a8ce5",
  storageBucket: "bolao-copa-2026-a8ce5.firebasestorage.app",
  messagingSenderId: "1091673930029",
  appId: "1:1091673930029:web:0a2ce60fe8eb928f33bba4"
};

// 2. INICIALIZAÇÃO
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 🚨 COLE O SEU UID DE ADMIN AQUI 🚨 ---
const ADMIN_UID = "1gOIqVCPlwbhWwYhLAPeLPhaOMe2";

// Adicione estas duas linhas junto com os outros elementos do ecrã
const adminPanel = document.getElementById('admin-panel');
const lockBetsBtn = document.getElementById('lock-bets-btn');
const adminMatchesList = document.getElementById('admin-matches-list');
const saveResultsBtn = document.getElementById('save-results-btn');
// --- DADOS FICTÍCIOS DAS RODADAS ---
// --- DADOS REAIS DA COPA DO MUNDO 2026 (FASE DE GRUPOS) ---
// --- DADOS REAIS DA COPA DO MUNDO 2026 (FASE DE GRUPOS) ---
const jogos = {
  rodada1: [
    { id: "A1", timeA: "México", timeB: "África do Sul", siglaA: "mx", siglaB: "za", data: "11/06 • Quinta", hora: "17:00", local: "Cidade do México" },
    { id: "A2", timeA: "Coreia do Sul", timeB: "Tchéquia", siglaA: "kr", siglaB: "cz", data: "12/06 • Sexta", hora: "14:00", local: "Los Angeles" },
    { id: "B1", timeA: "Canadá", timeB: "Bósnia", siglaA: "ca", siglaB: "ba", data: "12/06 • Sexta", hora: "20:00", local: "Toronto" },
    { id: "B2", timeA: "Suíça", timeB: "Catar", siglaA: "ch", siglaB: "qa", data: "13/06 • Sábado", hora: "13:00", local: "Boston" },
    { id: "C1", timeA: "Brasil", timeB: "Marrocos", siglaA: "br", siglaB: "ma", data: "13/06 • Sábado", hora: "16:00", local: "Miami" },
    { id: "C2", timeA: "Haiti", timeB: "Escócia", siglaA: "ht", siglaB: "gb-sct", data: "13/06 • Sábado", hora: "21:00", local: "New York" },
    { id: "D1", timeA: "EUA", timeB: "Paraguai", siglaA: "us", siglaB: "py", data: "12/06 • Sexta", hora: "21:00", local: "Los Angeles" },
    { id: "D2", timeA: "Austrália", timeB: "Turquia", siglaA: "au", siglaB: "tr", data: "13/06 • Sábado", hora: "18:00", local: "Dallas" },
    { id: "E1", timeA: "Alemanha", timeB: "Curaçao", siglaA: "de", siglaB: "cw", data: "14/06 • Domingo", hora: "13:00", local: "Philadelphia" },
    { id: "E2", timeA: "Costa do Marfim", timeB: "Equador", siglaA: "ci", siglaB: "ec", data: "14/06 • Domingo", hora: "16:00", local: "Houston" },
    { id: "F1", timeA: "Holanda", timeB: "Japão", siglaA: "nl", siglaB: "jp", data: "14/06 • Domingo", hora: "19:00", local: "Kansas City" },
    { id: "F2", timeA: "Suécia", timeB: "Tunísia", siglaA: "se", siglaB: "tn", data: "15/06 • Segunda", hora: "13:00", local: "Monterrey" },
    { id: "G1", timeA: "Bélgica", timeB: "Egito", siglaA: "be", siglaB: "eg", data: "15/06 • Segunda", hora: "16:00", local: "Guadalajara" },
    { id: "G2", timeA: "Irã", timeB: "Nova Zelândia", siglaA: "ir", siglaB: "nz", data: "15/06 • Segunda", hora: "20:00", local: "Seattle" },
    { id: "H1", timeA: "Espanha", timeB: "Cabo Verde", siglaA: "es", siglaB: "cv", data: "16/06 • Terça", hora: "13:00", local: "San Francisco" },
    { id: "H2", timeA: "Arábia Saudita", timeB: "Uruguai", siglaA: "sa", siglaB: "uy", data: "16/06 • Terça", hora: "16:00", local: "Dallas" },
    { id: "I1", timeA: "França", timeB: "Senegal", siglaA: "fr", siglaB: "sn", data: "16/06 • Terça", hora: "20:00", local: "Atlanta" },
    { id: "I2", timeA: "Repescagem", timeB: "Noruega", siglaA: "un", siglaB: "no", data: "17/06 • Quarta", hora: "13:00", local: "Houston" },
    { id: "J1", timeA: "Argentina", timeB: "Argélia", siglaA: "ar", siglaB: "dz", data: "17/06 • Quarta", hora: "16:00", local: "Miami" },
    { id: "J2", timeA: "Áustria", timeB: "Jordânia", siglaA: "at", siglaB: "jo", data: "17/06 • Quarta", hora: "20:00", local: "New York" },
    { id: "K1", timeA: "Portugal", timeB: "RD Congo", siglaA: "pt", siglaB: "cd", data: "18/06 • Quinta", hora: "14:00", local: "Atlanta" },
    { id: "K2", timeA: "Uzbequistão", timeB: "Colômbia", siglaA: "uz", siglaB: "co", data: "18/06 • Quinta", hora: "18:00", local: "Houston" },
    { id: "L1", timeA: "Inglaterra", timeB: "Croácia", siglaA: "gb-eng", siglaB: "hr", data: "18/06 • Quinta", hora: "21:00", local: "Toronto" },
    { id: "L2", timeA: "Gana", timeB: "Panamá", siglaA: "gh", siglaB: "pa", data: "19/06 • Sexta", hora: "15:00", local: "Vancouver" }
  ],
  rodada2: [
    { id: "A3", timeA: "México", timeB: "Coreia do Sul", siglaA: "mx", siglaB: "kr", data: "17/06 • Quarta", hora: "17:00", local: "Cidade do México" },
    { id: "A4", timeA: "África do Sul", timeB: "Tchéquia", siglaA: "za", siglaB: "cz", data: "17/06 • Quarta", hora: "21:00", local: "Guadalajara" },
    { id: "B3", timeA: "Canadá", timeB: "Suíça", siglaA: "ca", siglaB: "ch", data: "18/06 • Quinta", hora: "17:00", local: "Vancouver" },
    { id: "B4", timeA: "Bósnia", timeB: "Catar", siglaA: "ba", siglaB: "qa", data: "18/06 • Quinta", hora: "20:00", local: "Seattle" },
    { id: "C3", timeA: "Brasil", timeB: "Haiti", siglaA: "br", siglaB: "ht", data: "19/06 • Sexta", hora: "16:00", local: "Orlando" },
    { id: "C4", timeA: "Marrocos", timeB: "Escócia", siglaA: "ma", siglaB: "gb-sct", data: "19/06 • Sexta", hora: "19:00", local: "Miami" },
    { id: "D3", timeA: "EUA", timeB: "Austrália", siglaA: "us", siglaB: "au", data: "19/06 • Sexta", hora: "22:00", local: "San Francisco" },
    { id: "D4", timeA: "Paraguai", timeB: "Turquia", siglaA: "py", siglaB: "tr", data: "20/06 • Sábado", hora: "13:00", local: "Kansas City" },
    { id: "E3", timeA: "Alemanha", timeB: "Costa do Marfim", siglaA: "de", siglaB: "ci", data: "20/06 • Sábado", hora: "16:00", local: "Dallas" },
    { id: "E4", timeA: "Curaçao", timeB: "Equador", siglaA: "cw", siglaB: "ec", data: "20/06 • Sábado", hora: "20:00", local: "Houston" },
    { id: "F3", timeA: "Holanda", timeB: "Suécia", siglaA: "nl", siglaB: "se", data: "21/06 • Domingo", hora: "14:00", local: "Boston" },
    { id: "F4", timeA: "Japão", timeB: "Tunísia", siglaA: "jp", siglaB: "tn", data: "21/06 • Domingo", hora: "18:00", local: "Philadelphia" },
    { id: "G3", timeA: "Bélgica", timeB: "Irã", siglaA: "be", siglaB: "ir", data: "21/06 • Domingo", hora: "21:00", local: "New York" },
    { id: "G4", timeA: "Egito", timeB: "Nova Zelândia", siglaA: "eg", siglaB: "nz", data: "22/06 • Segunda", hora: "15:00", local: "Denver" },
    { id: "H3", timeA: "Espanha", timeB: "Arábia Saudita", siglaA: "es", siglaB: "sa", data: "22/06 • Segunda", hora: "18:00", local: "Los Angeles" },
    { id: "H4", timeA: "Cabo Verde", timeB: "Uruguai", siglaA: "cv", siglaB: "uy", data: "22/06 • Segunda", hora: "21:00", local: "Las Vegas" },
    { id: "I3", timeA: "França", timeB: "Repescagem", siglaA: "fr", siglaB: "un", data: "23/06 • Terça", hora: "15:00", local: "Boston" },
    { id: "I4", timeA: "Senegal", timeB: "Noruega", siglaA: "sn", siglaB: "no", data: "23/06 • Terça", hora: "18:00", local: "New York" },
    { id: "J3", timeA: "Argentina", timeB: "Áustria", siglaA: "ar", siglaB: "at", data: "23/06 • Terça", hora: "21:00", local: "Atlanta" },
    { id: "J4", timeA: "Argélia", timeB: "Jordânia", siglaA: "dz", siglaB: "jo", data: "24/06 • Quarta", hora: "14:00", local: "Miami" },
    { id: "K3", timeA: "Portugal", timeB: "Uzbequistão", siglaA: "pt", siglaB: "uz", data: "24/06 • Quarta", hora: "17:00", local: "Dallas" },
    { id: "K4", timeA: "RD Congo", timeB: "Colômbia", siglaA: "cd", siglaB: "co", data: "24/06 • Quarta", hora: "21:00", local: "Houston" },
    { id: "L3", timeA: "Inglaterra", timeB: "Gana", siglaA: "gb-eng", siglaB: "gh", data: "25/06 • Quinta", hora: "16:00", local: "Philadelphia" },
    { id: "L4", timeA: "Croácia", timeB: "Panamá", siglaA: "hr", siglaB: "pa", data: "25/06 • Quinta", hora: "20:00", local: "Toronto" }
  ],
  rodada3: [
    { id: "A5", timeA: "México", timeB: "Tchéquia", siglaA: "mx", siglaB: "cz", data: "24/06 • Quarta", hora: "18:00", local: "Cidade do México" },
    { id: "A6", timeA: "África do Sul", timeB: "Coreia do Sul", siglaA: "za", siglaB: "kr", data: "24/06 • Quarta", hora: "18:00", local: "Monterrey" },
    { id: "B5", timeA: "Canadá", timeB: "Catar", siglaA: "ca", siglaB: "qa", data: "24/06 • Quarta", hora: "21:00", local: "Toronto" },
    { id: "B6", timeA: "Bósnia", timeB: "Suíça", siglaA: "ba", siglaB: "ch", data: "24/06 • Quarta", hora: "21:00", local: "Vancouver" },
    { id: "C5", timeA: "Brasil", timeB: "Escócia", siglaA: "br", siglaB: "gb-sct", data: "25/06 • Quinta", hora: "15:00", local: "Miami" },
    { id: "C6", timeA: "Marrocos", timeB: "Haiti", siglaA: "ma", siglaB: "ht", data: "25/06 • Quinta", hora: "15:00", local: "Orlando" },
    { id: "D5", timeA: "EUA", timeB: "Turquia", siglaA: "us", siglaB: "tr", data: "25/06 • Quinta", hora: "19:00", local: "Los Angeles" },
    { id: "D6", timeA: "Paraguai", timeB: "Austrália", siglaA: "py", siglaB: "au", data: "25/06 • Quinta", hora: "19:00", local: "San Francisco" },
    { id: "E5", timeA: "Alemanha", timeB: "Equador", siglaA: "de", siglaB: "ec", data: "26/06 • Sexta", hora: "16:00", local: "Kansas City" },
    { id: "E6", timeA: "Curaçao", timeB: "Costa do Marfim", siglaA: "cw", siglaB: "ci", data: "26/06 • Sexta", hora: "16:00", local: "Houston" },
    { id: "F5", timeA: "Holanda", timeB: "Tunísia", siglaA: "nl", siglaB: "tn", data: "26/06 • Sexta", hora: "20:00", local: "Boston" },
    { id: "F6", timeA: "Japão", timeB: "Suécia", siglaA: "jp", siglaB: "se", data: "26/06 • Sexta", hora: "20:00", local: "Philadelphia" },
    { id: "G5", timeA: "Bélgica", timeB: "Nova Zelândia", siglaA: "be", siglaB: "nz", data: "27/06 • Sábado", hora: "15:00", local: "New York" },
    { id: "G6", timeA: "Egito", timeB: "Irã", siglaA: "eg", siglaB: "ir", data: "27/06 • Sábado", hora: "15:00", local: "Dallas" },
    { id: "H5", timeA: "Espanha", timeB: "Uruguai", siglaA: "es", siglaB: "uy", data: "27/06 • Sábado", hora: "19:00", local: "Los Angeles" },
    { id: "H6", timeA: "Cabo Verde", timeB: "Arábia Saudita", siglaA: "cv", siglaB: "sa", data: "27/06 • Sábado", hora: "19:00", local: "Las Vegas" },
    { id: "I5", timeA: "França", timeB: "Noruega", siglaA: "fr", siglaB: "no", data: "28/06 • Domingo", hora: "15:00", local: "Atlanta" },
    { id: "I6", timeA: "Senegal", timeB: "Repescagem", siglaA: "sn", siglaB: "un", data: "28/06 • Domingo", hora: "15:00", local: "Houston" },
    { id: "J5", timeA: "Argentina", timeB: "Jordânia", siglaA: "ar", siglaB: "jo", data: "28/06 • Domingo", hora: "19:00", local: "Miami" },
    { id: "J6", timeA: "Argélia", timeB: "Áustria", siglaA: "dz", siglaB: "at", data: "28/06 • Domingo", hora: "19:00", local: "New York" },
    { id: "K5", timeA: "Portugal", timeB: "Colômbia", siglaA: "pt", siglaB: "co", data: "29/06 • Segunda", hora: "16:00", local: "Atlanta" },
    { id: "K6", timeA: "RD Congo", timeB: "Uzbequistão", siglaA: "cd", siglaB: "uz", data: "29/06 • Segunda", hora: "16:00", local: "Dallas" },
    { id: "L5", timeA: "Inglaterra", timeB: "Panamá", siglaA: "gb-eng", siglaB: "pa", data: "29/06 • Segunda", hora: "20:00", local: "Boston" },
    { id: "L6", timeA: "Croácia", timeB: "Gana", siglaA: "hr", siglaB: "gh", data: "29/06 • Segunda", hora: "20:00", local: "Philadelphia" }
  ]
};

// --- ELEMENTOS DA TELA ---
const userNameDisplay = document.getElementById('user-name-display');
const logoutBtn = document.getElementById('logout-btn');
const feedbackMsg = document.getElementById('feedback-msg');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const saveButtons = document.querySelectorAll('.save-btn');

let currentUser = null;

// Variável global para controlar o estado da trava
let apostasTravadas = false;

// --- AUTENTICAÇÃO ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userNameDisplay.innerText = `Jogador: ${user.displayName || "Sem Nome"}`;
    
// --- NOVAS CHAMADAS AQUI ---
    await carregarSeletorDeBoloes(user.uid); // 🚨 LIGA O ROTEADOR DE VLAN AQUI!
    renderizarJogosAdmin();
    await carregarResultadosOficiais();
    // ----------------------------

    // VERIFICAÇÃO DE ADMIN
    if (user.uid === ADMIN_UID) {
      adminPanel.classList.remove('hidden');
      
      // Lê o status atual do bloqueio no banco de dados
      try {
        const configSnap = await getDoc(doc(db, "configuracoes", "geral"));
        if (configSnap.exists()) {
          apostasTravadas = configSnap.data().bloqueado;
          atualizarVisualBotaoAdmin(); // Ajusta a cor e texto do botão
        }
      } catch (e) {
        console.error("Erro ao ler configurações:", e);
      }
    }
    
    renderizarJogos('rodada1', 'list-rodada1');
    renderizarJogos('rodada2', 'list-rodada2');
    renderizarJogos('rodada3', 'list-rodada3');
    
    await carregarPalpitesExistentes();
    atualizarRanking();
  } else {
    window.location.href = "index.html";
  }
});

// --- LÓGICA DAS ABAS ---
tabButtons.forEach(btn => {
  btn.addEventListener('click', async (e) => { // <-- Tem que ter o async!
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.add('hidden'));

    btn.classList.add('active');
    const targetId = btn.dataset.target;
    document.getElementById(targetId).classList.remove('hidden');
    feedbackMsg.classList.add('hidden');

    // 🚨 GATILHO DO RANKING RESTAURADO!
    if (targetId === 'tab-ranking') {
      const seletorRanking = document.getElementById('filtro-ranking');
      await atualizarRanking(seletorRanking ? seletorRanking.value : 'geral');
    }
  });
});

// --- RENDERIZAR JOGOS (VISUAL GLOBO ESPORTE CORRIGIDO) ---
function renderizarJogos(rodadaKey, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  jogos[rodadaKey].forEach(jogo => {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.style.cssText = "background: #fff; border-radius: 8px; padding: 15px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; flex-direction: column;";
    
    const dataJogo = jogo.data || "Data a definir";
    const horaJogo = jogo.hora || "--:--";
    const localJogo = jogo.local || "Estádio";
    const imgA = jogo.siglaA ? `<img src="https://flagcdn.com/w40/${jogo.siglaA}.png" alt="Bandeira ${jogo.timeA}" style="width: 30px; height: auto; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">` : '🏳️';
    const imgB = jogo.siglaB ? `<img src="https://flagcdn.com/w40/${jogo.siglaB}.png" alt="Bandeira ${jogo.timeB}" style="width: 30px; height: auto; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">` : '🏳️';

    card.innerHTML = `
      <div style="text-align: center; font-size: 0.85em; color: #777; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee; width: 100%;">
        <span>${localJogo}</span> &nbsp;&bull;&nbsp; <strong>${dataJogo} &bull; ${horaJogo}</strong>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        
        <div style="display: flex; align-items: center; gap: 10px; flex: 1; justify-content: flex-end;">
          <span style="font-size: 1.1em; color: #555; text-align: right;">${jogo.timeA}</span>
          ${imgA}
        </div>
        
        <div class="score-area" style="display: flex; align-items: center; gap: 8px; margin: 0 15px;">
          <input type="number" min="0" id="${jogo.id}-A" class="score-input" placeholder="0" style="width: 45px; text-align: center; font-size: 1.2em; font-weight: bold; border-radius: 6px; border: 1px solid #ccc;">
          <span style="color: #999; font-weight: bold; font-size: 1.2em;">X</span>
          <input type="number" min="0" id="${jogo.id}-B" class="score-input" placeholder="0" style="width: 45px; text-align: center; font-size: 1.2em; font-weight: bold; border-radius: 6px; border: 1px solid #ccc;">
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex: 1; justify-content: flex-start;">
          ${imgB}
          <span style="font-size: 1.1em; color: #555; text-align: left;">${jogo.timeB}</span>
        </div>
        
      </div>
    `;
    container.appendChild(card);
  });
}



// --- SALVAR PALPITES (JOGADORES) ---
const botoesSalvar = document.querySelectorAll('.save-btn');

botoesSalvar.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const rodadaKey = e.currentTarget.dataset.rodada; 
    const palpites = {};

    jogos[rodadaKey].forEach(jogo => {
      const inputA = document.getElementById(`${jogo.id}-A`);
      const inputB = document.getElementById(`${jogo.id}-B`);
      
      if (inputA && inputB) {
        const valA = inputA.value;
        const valB = inputB.value;
        
        // Se pelo menos um lado foi digitado, ele salva
        if (valA !== "" || valB !== "") {
          // Transforma a caixa vazia (placeholder) em número 0 de verdade
          const golsA = valA === "" ? 0 : parseInt(valA);
          const golsB = valB === "" ? 0 : parseInt(valB);
          palpites[jogo.id] = { timeA: golsA, timeB: golsB };
        }
      }
    });

    if (Object.keys(palpites).length === 0) {
      alert(`Você não preencheu nenhum palpite na ${rodadaKey}!`);
      return;
    }

    try {
      await setDoc(doc(db, "palpites", currentUser.uid), {
        nome: currentUser.displayName || "Jogador",
        [rodadaKey]: palpites,
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // 🚨 ALERTA FLUTUANTE LIGADO
      feedbackMsg.innerText = `Palpites salvos com sucesso! ⚽`;
      feedbackMsg.style.backgroundColor = "#2e7d32";
      feedbackMsg.style.color = "white";
      
      feedbackMsg.classList.remove('hidden'); // Remove a trava invisível
      setTimeout(() => feedbackMsg.classList.add('hidden'), 3000); // Recoloca após 3s
      
      const seletorRanking = document.getElementById('filtro-ranking');
      await atualizarRanking(seletorRanking ? seletorRanking.value : 'geral'); 
      
    } catch (error) {
      console.error("Erro ao enviar palpite:", error);
    }
  });
});

// --- CARREGAR PALPITES DO BANCO (USUÁRIOS) ---
async function carregarPalpitesExistentes() {
  if (!currentUser) return;
  try {
    const docSnap = await getDoc(doc(db, "palpites", currentUser.uid));
    if (docSnap.exists()) {
      const dados = docSnap.data();
      
      ['rodada1', 'rodada2', 'rodada3'].forEach(rodadaKey => {
        if (dados[rodadaKey]) {
          Object.keys(dados[rodadaKey]).forEach(jogoId => {
            const inputA = document.getElementById(`${jogoId}-A`);
            const inputB = document.getElementById(`${jogoId}-B`);
            if (inputA && inputB) {
              inputA.value = dados[rodadaKey][jogoId].timeA;
              inputB.value = dados[rodadaKey][jogoId].timeB;
            }
          });
        }
      });
    }
  } catch (error) {
    console.error("Erro ao carregar palpites:", error);
  }
}

// --- LÓGICA DO ADMIN (Travar/Destravar Apostas) ---

function atualizarVisualBotaoAdmin() {
  if (apostasTravadas) {
    lockBetsBtn.innerText = "🔓 Destravar Apostas";
    lockBetsBtn.style.backgroundColor = "#1976d2"; // Fica azul quando travado
  } else {
    lockBetsBtn.innerText = "🔒 Travar Apostas";
    lockBetsBtn.style.backgroundColor = "#d32f2f"; // Fica vermelho quando livre
  }
}

if (lockBetsBtn) {
  lockBetsBtn.addEventListener('click', async () => {
    const acao = apostasTravadas ? "DESTRAVAR" : "TRAVAR";
    const confirmar = confirm(`Tem certeza que deseja ${acao} as apostas?`);

    if (confirmar) {
      try {
        const novoEstado = !apostasTravadas; // Inverte o estado atual
        
        await setDoc(doc(db, "configuracoes", "geral"), {
          bloqueado: novoEstado
        }, { merge: true });

        apostasTravadas = novoEstado; // Atualiza a variável local
        atualizarVisualBotaoAdmin(); // Atualiza a cor na tela
        
        feedbackMsg.innerText = apostasTravadas ? "Bolão travado!" : "Apostas liberadas!";
        feedbackMsg.className = "feedback success";
        feedbackMsg.classList.remove('hidden');
        setTimeout(() => feedbackMsg.classList.add('hidden'), 3000);
      } catch (error) {
        console.error("Erro ao alterar trava:", error);
        feedbackMsg.innerText = "Erro ao alterar trava de segurança.";
        feedbackMsg.className = "feedback error";
        feedbackMsg.classList.remove('hidden');
      }
    }
  });
}
// --- RENDERIZAR JOGOS NO PAINEL DE ADMIN ---
function renderizarJogosAdmin() {
  if (!adminMatchesList) return;
  adminMatchesList.innerHTML = "";
  
  ['rodada1', 'rodada2', 'rodada3'].forEach(rodadaKey => {
    jogos[rodadaKey].forEach(jogo => {
      const card = document.createElement('div');
      
      // 🚨 AS DUAS LINHAS NOVAS ESTÃO AQUI:
      card.className = 'match-card admin-match-card'; // Uma classe específica para o filtro achar eles
      card.dataset.rodada = rodadaKey; // Etiqueta invisível dizendo a qual rodada pertence
      
      // Borda laranja pra indicar que é a área restrita do Admin
      card.style.cssText = "background: #fff; border-left: 4px solid #e65100; border-radius: 8px; padding: 15px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; flex-direction: column;";
      
      // ... (O resto do card.innerHTML continua exatemente igual)
      
      const dataJogo = jogo.data || "Data a definir";
      const horaJogo = jogo.hora || "--:--";
      const localJogo = jogo.local || "Estádio";
      const imgA = jogo.siglaA ? `<img src="https://flagcdn.com/w40/${jogo.siglaA}.png" style="width: 30px; border: 1px solid #ddd; border-radius: 4px;">` : '🏳️';
      const imgB = jogo.siglaB ? `<img src="https://flagcdn.com/w40/${jogo.siglaB}.png" style="width: 30px; border: 1px solid #ddd; border-radius: 4px;">` : '🏳️';

      card.innerHTML = `
        <div style="text-align: center; font-size: 0.85em; color: #777; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee; width: 100%;">
          <span>${localJogo}</span> &nbsp;&bull;&nbsp; <strong>${dataJogo} &bull; ${horaJogo}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; justify-content: flex-end;">
            <span style="font-size: 1.1em; color: #555; text-align: right;">${jogo.timeA}</span>
            ${imgA}
          </div>
          
          <div class="score-area" style="display: flex; align-items: center; gap: 8px; margin: 0 15px;">
            <input type="number" min="0" id="admin-${jogo.id}-A" class="score-input" placeholder="0" style="border: 1px solid #e65100; width: 45px; text-align: center; font-size: 1.2em; font-weight: bold; border-radius: 6px;">
            <span style="color: #999; font-weight: bold; font-size: 1.2em;">X</span>
            <input type="number" min="0" id="admin-${jogo.id}-B" class="score-input" placeholder="0" style="border: 1px solid #e65100; width: 45px; text-align: center; font-size: 1.2em; font-weight: bold; border-radius: 6px;">
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex: 1; justify-content: flex-start;">
            ${imgB}
            <span style="font-size: 1.1em; color: #555; text-align: left;">${jogo.timeB}</span>
          </div>
          
        </div>
      `;
      adminMatchesList.appendChild(card);
    });
  });
   aplicarFiltroAdmin();
}

// --- SALVAR PLACARES REAIS NO FIREBASE (ADMIN) ---
if (saveResultsBtn) {
  saveResultsBtn.addEventListener('click', async () => {
    const resultadosOficiais = {};
    
    ['rodada1', 'rodada2', 'rodada3'].forEach(rodadaKey => {
      jogos[rodadaKey].forEach(jogo => {
        const inputA = document.getElementById(`admin-${jogo.id}-A`);
        const inputB = document.getElementById(`admin-${jogo.id}-B`);
        
        if (inputA && inputB) {
          const valA = inputA.value;
          const valB = inputB.value;
          
          if (valA !== "" || valB !== "") {
            const golsA = valA === "" ? 0 : parseInt(valA);
            const golsB = valB === "" ? 0 : parseInt(valB);
            resultadosOficiais[jogo.id] = { timeA: golsA, timeB: golsB };
          }
        }
      });
    });

    if (Object.keys(resultadosOficiais).length === 0) {
      alert("Você precisa preencher pelo menos um placar na caixa laranja antes de Salvar Resultados Reais.");
      return;
    }

    try {
      await setDoc(doc(db, "configuracoes", "resultados"), {
        placarReal: resultadosOficiais,
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

// 🚨 ALERTA FLUTUANTE LIGADO
      feedbackMsg.innerText = "Resultados Oficiais salvos! 🏆";
      feedbackMsg.style.backgroundColor = "#e65100";
      feedbackMsg.style.color = "white";
      
      feedbackMsg.classList.remove('hidden'); // Remove a trava invisível
      setTimeout(() => feedbackMsg.classList.add('hidden'), 3000); // Recoloca após 3s


    } catch (error) {
      console.error("Erro ao salvar como Admin:", error);
    }
  });
}

// --- CARREGAR OS RESULTADOS OFICIAIS JÁ SALVOS (ADMIN) ---
async function carregarResultadosOficiais() {
  try {
    const docSnap = await getDoc(doc(db, "configuracoes", "resultados"));
    if (docSnap.exists() && docSnap.data().placarReal) {
      const placares = docSnap.data().placarReal;
      Object.keys(placares).forEach(jogoId => {
        // Encontra especificamente os inputs do admin (com o prefixo)
        const inputA = document.getElementById(`admin-${jogoId}-A`);
        const inputB = document.getElementById(`admin-${jogoId}-B`);
        if (inputA && inputB) {
          inputA.value = placares[jogoId].timeA;
          inputB.value = placares[jogoId].timeB;
        }
      });
    }
  } catch (error) {
    console.error("Erro ao buscar resultados oficiais:", error);
  }
}

// --- MOTOR DE PONTUAÇÃO (Blueprint) ---
function calcularPontos(palpiteA, palpiteB, realA, realB) {
  // 1. Placar em Cheio (25 pontos)
  if (palpiteA === realA && palpiteB === realB) {
    return 25; 
  }

  // Verifica quem o jogador disse que ia ganhar (ou se ia empatar)
  const acertouVencedor =
    (palpiteA > palpiteB && realA > realB) || // Apostou no Time A e ele ganhou
    (palpiteA < palpiteB && realA < realB) || // Apostou no Time B e ele ganhou
    (palpiteA === palpiteB && realA === realB); // Apostou em empate e deu empate

  // Verifica se ele acertou a quantidade de gols de pelo menos um dos times
  const acertouGolsUmLado = (palpiteA === realA || palpiteB === realB);

  // 2 e 3. Acertou o Vencedor/Empate
  if (acertouVencedor) {
    if (acertouGolsUmLado) {
      return 18; // Vencedor + Gols de 1 Lado
    } else {
      return 10; // Apenas Vencedor / Empate
    }
  } 
  // 4. Errou o Vencedor, mas acertou os gols de alguém
  else {
    if (acertouGolsUmLado) {
      return 5; // Gols de 1 Lado (Erro de Vencedor)
    }
  }

  // Errou absolutamente tudo
  return 0; 
}

// --- GERAR E RENDERIZAR RANKING (COM FILTRO DE REDE) ---
// A função recebe o filtro de rodada ('geral', 'rodada1', etc)
async function atualizarRanking(filtro = 'geral') {
  const rankingList = document.getElementById('ranking-list');
  if (!rankingList) return;
  
  rankingList.innerHTML = "<p style='text-align:center;'>Calculando pontos...</p>";

  try {
    // 1. Descobre qual bolão (VLAN) está selecionado lá no topo da tela
    const seletorBolao = document.getElementById('seletor-bolao-ativo');
    const bolaoAtivo = seletorBolao ? seletorBolao.value : null;

    // 🚨 FIREWALL: Se o usuário não estiver em nenhum bolão, bloqueia o ranking global!
    if (!bolaoAtivo) {
      rankingList.innerHTML = `
        <div style="text-align:center; padding: 20px; background: #fff; border-radius: 8px; border-left: 4px solid #d32f2f; margin-top: 10px;">
          <p style="color: #d32f2f; font-weight: bold; font-size: 1.1em; margin-top: 0;">Você não está em nenhuma rede!</p>
          <p style="color: #555;">Para competir com seus amigos, clique em <b>Sair</b> e faça o login novamente marcando a opção "Entrar em Existente" ou "Criar Novo".</p>
        </div>`;
      return; // Aborta o cálculo de pontos para não vazar a lista
    }

    const docResultados = await getDoc(doc(db, "configuracoes", "resultados"));
    const placaresReais = docResultados.exists() ? docResultados.data().placarReal || {} : {};

    const palpitesSnap = await getDocs(collection(db, "palpites"));
    let tabela = [];

    palpitesSnap.forEach((userDoc) => {
      const dados = userDoc.data();

      // 🚨 A MÁGICA DA VLAN ACONTECE AQUI:
      // Se o jogador não tiver a etiqueta desse bolão no array dele, o sistema ignora e pula!
      if (bolaoAtivo && (!dados.boloesInscritos || !dados.boloesInscritos.includes(bolaoAtivo))) {
        return; // Break silencioso para o próximo jogador
      }

      let pontosTotais = 0;
      const nome = dados.nome || "Jogador sem nome";

      const rodadasParaCalcular = filtro === 'geral' ? ['rodada1', 'rodada2', 'rodada3'] : [filtro];

      rodadasParaCalcular.forEach(rodada => {
        if (dados[rodada]) {
          Object.keys(dados[rodada]).forEach(jogoId => {
            const palpite = dados[rodada][jogoId];
            const real = placaresReais[jogoId];

            if (palpite && real) {
              pontosTotais += calcularPontos(palpite.timeA, palpite.timeB, real.timeA, real.timeB);
            }
          });
        }
      });

      tabela.push({ nome: nome, pontos: pontosTotais });
    });

    // Ordena do maior para o menor
    tabela.sort((a, b) => b.pontos - a.pontos);

    rankingList.innerHTML = "";
    
    // Tratamento de erro se a sala ainda estiver vazia
    if (tabela.length === 0) {
        rankingList.innerHTML = "<p style='text-align:center; color:#555;'>Nenhum jogador pontuou neste bolão ainda.</p>";
        return;
    }

    tabela.forEach((posicao, index) => {
      let medalha = "🏅";
      if (index === 0) medalha = "🥇";
      if (index === 1) medalha = "🥈";
      if (index === 2) medalha = "🥉";

      const card = document.createElement('div');
      card.style.cssText = "display: flex; justify-content: space-between; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 1.1em; margin-bottom: 8px;";
      card.innerHTML = `
        <span><strong>${index + 1}º</strong> ${medalha} ${posicao.nome}</span>
        <span style="color: #2e7d32; font-weight: 900;">${posicao.pontos} pts</span>
      `;
      rankingList.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao montar o ranking:", error);
    rankingList.innerHTML = "<p style='text-align:center; color:red;'>Erro ao carregar ranking.</p>";
  }
}

// --- ESCUTADOR DE CLIQUE DO FILTRO ---
const filtroElemento = document.getElementById('filtro-ranking');
if (filtroElemento) {
  filtroElemento.addEventListener('change', async (e) => {
    await atualizarRanking(e.target.value);
  });
}

// --- SENSOR DO FILTRO DE RODADAS (ADMIN) COM DIAGNÓSTICO ---
function aplicarFiltroAdmin() {
  const adminFiltro = document.getElementById('filtro-admin-rodadas');
  
  if (!adminFiltro) {
    console.error("🔴 [FALHA] Não achei a caixinha <select> no HTML! Verifique o ID.");
    return;
  }

  const rodadaSelecionada = adminFiltro.value;
  const todosOsCardsAdmin = document.querySelectorAll('.admin-match-card');
  
  console.log(`💡 [FILTRO] Você escolheu: ${rodadaSelecionada}`);
  console.log(`💡 [FILTRO] O sistema encontrou ${todosOsCardsAdmin.length} cartões na tela.`);

  todosOsCardsAdmin.forEach(card => {
    if (rodadaSelecionada === 'todas' || card.dataset.rodada === rodadaSelecionada) {
      card.style.display = "flex"; 
    } else {
      card.style.display = "none"; 
    }
  });
}

// Conecta o sensor de clique
const filtroAdminElemento = document.getElementById('filtro-admin-rodadas');
if (filtroAdminElemento) {
  console.log("💡 [SENSOR] Fiação do menu conectada com sucesso!");
  filtroAdminElemento.addEventListener('change', aplicarFiltroAdmin);
} else {
  console.error("🔴 [SENSOR] O JavaScript carregou, mas não encontrou o menu no HTML. O ID está exatamente igual?");
}


// --- LÓGICA DE SAIR ---
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "index.html");
  });
}

// --- CARREGAR OS BOLÕES QUE O USUÁRIO PARTICIPA ---
async function carregarSeletorDeBoloes(uid) {
  const seletorActive = document.getElementById('seletor-bolao-ativo');
  const painelBolaoAtivo = document.getElementById('painel-bolao-ativo');
  
  if (!seletorActive) return;

  try {
    // 1. Puxa o documento do usuário para ver os códigos dos bolões inscritos
    const userDoc = await getDoc(doc(db, "palpites", uid));
    
    if (userDoc.exists() && userDoc.data().boloesInscritos) {
      const codigos = userDoc.data().boloesInscritos;
      seletorActive.innerHTML = ""; // Limpa o seletor

      // 2. Para cada código, busca o nome amigável do bolão no banco
      for (const codigo of codigos) {
        const bolaoDoc = await getDoc(doc(db, "boloes", codigo));
        if (bolaoDoc.exists()) {
          const option = document.createElement('option');
          option.value = codigo; // O valor por trás é o código único (ex: X7B9K)
          option.innerText = `${bolaoDoc.data().nome} (${codigo})`; // O visual é o nome bonito
          seletorActive.appendChild(option);
        }
      }

      // Mostra o painel seletor que estava escondido
      if (painelBolaoAtivo) painelBolaoAtivo.classList.remove('hidden');

      // 3. Deixa um "escutador" para atualizar o ranking quando trocar de bolão no menu!
      seletorActive.addEventListener('change', () => {
        const seletorRanking = document.getElementById('filtro-ranking');
        atualizarRanking(seletorRanking ? seletorRanking.value : 'geral');
      });

    }
  } catch (error) {
    console.error("Erro ao carregar lista de bolões:", error);
  }
}

// --- BOTÃO DE COPIAR CHAVE DE CONVITE ---
const btnCopiar = document.getElementById('btn-copiar-chave');
if (btnCopiar) {
  btnCopiar.addEventListener('click', () => {
    const seletor = document.getElementById('seletor-bolao-ativo');
    const codigoBolao = seletor ? seletor.value : null;

    if (codigoBolao) {
      // Grava na área de transferência usando a API do navegador
      navigator.clipboard.writeText(codigoBolao).then(() => {
        const conteudoOriginal = btnCopiar.innerHTML;
        
        // Efeito visual de sucesso no botão
        btnCopiar.innerHTML = "✅ Copiado!";
        btnCopiar.style.backgroundColor = "#e8f5e9";
        btnCopiar.style.borderColor = "#4caf50";
        btnCopiar.style.color = "#2e7d32";

        // Dá um "reset" no botão depois de 2 segundos
        setTimeout(() => {
          btnCopiar.innerHTML = conteudoOriginal;
          btnCopiar.style.backgroundColor = "#fff";
          btnCopiar.style.borderColor = "#ccc";
          btnCopiar.style.color = "#555";
        }, 2000);
      }).catch(err => {
        console.error("Falha ao copiar: ", err);
        alert("O seu navegador bloqueou a cópia automática.");
      });
    }
  });
}

// --- INTERRUPTOR DA TELA DE REGRAS ---
const btnRegras = document.getElementById('btn-regras');
const btnVoltarRegras = document.getElementById('btn-voltar-regras');
const telaRegras = document.getElementById('tela-regras');

// Elementos que precisam ser escondidos quando as regras aparecem
const areaSeletorBolao = document.getElementById('painel-bolao-ativo');
const areaAbas = document.querySelector('.tabs'); 
const areaConteudoAbas = document.querySelectorAll('.tab-content'); 

if (btnRegras && btnVoltarRegras && telaRegras) {
  btnRegras.addEventListener('click', () => {
    // Esconde a área de jogo
    if(areaSeletorBolao) areaSeletorBolao.style.display = 'none';
    if(areaAbas) areaAbas.style.display = 'none';
    areaConteudoAbas.forEach(c => c.classList.add('hidden'));
    
    // Mostra as regras
    telaRegras.classList.remove('hidden');
  });

  btnVoltarRegras.addEventListener('click', () => {
    // Esconde as regras
    telaRegras.classList.add('hidden');
    
    // Traz a área de jogo de volta
    if(areaSeletorBolao) areaSeletorBolao.style.display = 'flex';
    if(areaAbas) areaAbas.style.display = 'flex';
    
    // Força o clique na aba "Rodada 1" para resetar a visão do jogador
    const abaPadrao = document.querySelector('.tab-btn[data-target="tab-rodada1"]');
    if(abaPadrao) abaPadrao.click();
  });
}

// --- MÓDULO ADMIN: GERENCIAMENTO DE USUÁRIOS E EXCLUSÃO ---
const btnCarregarUsuarios = document.getElementById('btn-carregar-usuarios');
const listaUsuariosAdmin = document.getElementById('lista-admin-usuarios');

if (btnCarregarUsuarios && listaUsuariosAdmin) {
  btnCarregarUsuarios.addEventListener('click', async () => {
    listaUsuariosAdmin.innerHTML = "<p style='text-align:center;'>Buscando no banco de dados...</p>";

    try {
      // Puxa TODOS os documentos da coleção de palpites
      const palpitesSnap = await getDocs(collection(db, "palpites"));
      listaUsuariosAdmin.innerHTML = ""; 
      
      if (palpitesSnap.empty) {
        listaUsuariosAdmin.innerHTML = "<p style='text-align:center; color: #555;'>Nenhum jogador encontrado no banco de dados.</p>";
        return;
      }

      // Varre o banco e cria um "card" para cada jogador
      palpitesSnap.forEach((userDoc) => {
        const uid = userDoc.id;
        const dados = userDoc.data();
        const nome = dados.nome || "Sem nome";
        
        // Pega as redes que ele faz parte ou avisa se ele é um "Lobo Solitário"
        const boloesStr = (dados.boloesInscritos && dados.boloesInscritos.length > 0) 
                          ? dados.boloesInscritos.join(', ') 
                          : "Nenhum bolão";

        const div = document.createElement('div');
        div.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;";
        div.innerHTML = `
          <div style="flex: 1;">
            <strong style="color: #333; font-size: 1.1em;">${nome}</strong><br>
            <span style="font-size: 0.85em; color: #777;">Redes: <b>${boloesStr}</b></span>
          </div>
          <button class="btn-excluir-user" data-uid="${uid}" data-nome="${nome}" style="background: #d32f2f; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-left: 10px;">Excluir</button>
        `;
        listaUsuariosAdmin.appendChild(div);
      });

      // 🚨 GATILHO DE EXCLUSÃO (CUIDADO!)
      document.querySelectorAll('.btn-excluir-user').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const uidParaExcluir = e.target.getAttribute('data-uid');
          const nomeParaExcluir = e.target.getAttribute('data-nome');
          
          // Confirmação dupla para o Admin não apagar ninguém sem querer
          const confirmar = confirm(`🚨 PERIGO: Tem certeza que deseja apagar os palpites e a inscrição de "${nomeParaExcluir}"?\n\nEsta ação não pode ser desfeita.`);
          
          if (confirmar) {
            try {
              // Apaga a "pasta" do usuário no banco de dados
              await deleteDoc(doc(db, "palpites", uidParaExcluir));
              
              alert(`✅ O jogador ${nomeParaExcluir} foi removido do banco de dados com sucesso!`);
              
              // Recarrega a listagem e o ranking global automaticamente
              btnCarregarUsuarios.click(); 
              const seletorRanking = document.getElementById('filtro-ranking');
              await atualizarRanking(seletorRanking ? seletorRanking.value : 'geral'); 
              
            } catch (error) {
              console.error("Erro ao excluir usuário:", error);
              alert("Falha de rede ao tentar excluir o jogador.");
            }
          }
        });
      });

    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      listaUsuariosAdmin.innerHTML = "<p style='text-align:center; color:red;'>Erro de conexão ao buscar jogadores.</p>";
    }
  });
}