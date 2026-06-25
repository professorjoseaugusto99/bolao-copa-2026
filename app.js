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
// --- DADOS REAIS DA COPA DO MUNDO 2026 (100% HORÁRIO DE BRASÍLIA) ---
const jogos = {
  rodada1: [
    { id: "A1", timeA: "México", timeB: "África do Sul", siglaA: "mx", siglaB: "za", data: "11/06 • Quinta", hora: "22:00", local: "Cidade do México" },
    { id: "A2", timeA: "Coreia do Sul", timeB: "Tchéquia", siglaA: "kr", siglaB: "cz", data: "12/06 • Sexta", hora: "01:00", local: "Guadalajara" },
    { id: "B1", timeA: "Canadá", timeB: "Bósnia", siglaA: "ca", siglaB: "ba", data: "12/06 • Sexta", hora: "17:00", local: "Toronto" },
    { id: "B2", timeA: "Suíça", timeB: "Catar", siglaA: "ch", siglaB: "qa", data: "13/06 • Sábado", hora: "16:00", local: "Boston" },
    { id: "C1", timeA: "Brasil", timeB: "Marrocos", siglaA: "br", siglaB: "ma", data: "13/06 • Sábado", hora: "19:00", local: "Nova York/NJ" },
    { id: "C2", timeA: "Haiti", timeB: "Escócia", siglaA: "ht", siglaB: "gb-sct", data: "13/06 • Sábado", hora: "22:00", local: "Boston" },
    { id: "D1", timeA: "EUA", timeB: "Paraguai", siglaA: "us", siglaB: "py", data: "12/06 • Sexta", hora: "23:00", local: "Los Angeles" },
    { id: "D2", timeA: "Austrália", timeB: "Turquia", siglaA: "au", siglaB: "tr", data: "14/06 • Domingo", hora: "01:00", local: "Vancouver" },
    { id: "E1", timeA: "Alemanha", timeB: "Curaçao", siglaA: "de", siglaB: "cw", data: "14/06 • Domingo", hora: "14:00", local: "Houston" },
    { id: "E2", timeA: "Costa do Marfim", timeB: "Equador", siglaA: "ci", siglaB: "ec", data: "14/06 • Domingo", hora: "20:00", local: "Filadélfia" },
    { id: "F1", timeA: "Holanda", timeB: "Japão", siglaA: "nl", siglaB: "jp", data: "14/06 • Domingo", hora: "17:00", local: "Dallas" },
    { id: "F2", timeA: "Suécia", timeB: "Tunísia", siglaA: "se", siglaB: "tn", data: "14/06 • Domingo", hora: "23:00", local: "Monterrey" },
    { id: "G1", timeA: "Bélgica", timeB: "Egito", siglaA: "be", siglaB: "eg", data: "15/06 • Segunda", hora: "16:00", local: "Seattle" },
    { id: "G2", timeA: "Irã", timeB: "Nova Zelândia", siglaA: "ir", siglaB: "nz", data: "15/06 • Segunda", hora: "22:00", local: "Los Angeles" },
    { id: "H1", timeA: "Espanha", timeB: "Cabo Verde", siglaA: "es", siglaB: "cv", data: "15/06 • Segunda", hora: "13:00", local: "Atlanta" },
    { id: "H2", timeA: "Arábia Saudita", timeB: "Uruguai", siglaA: "sa", siglaB: "uy", data: "15/06 • Segunda", hora: "19:00", local: "Miami" },
    { id: "I1", timeA: "França", timeB: "Senegal", siglaA: "fr", siglaB: "sn", data: "16/06 • Terça", hora: "16:00", local: "Nova York/NJ" },
    { id: "I2", timeA: "Iraque", timeB: "Noruega", siglaA: "iq", siglaB: "no", data: "16/06 • Terça", hora: "19:00", local: "Boston" },
    { id: "J1", timeA: "Argentina", timeB: "Argélia", siglaA: "ar", siglaB: "dz", data: "16/06 • Terça", hora: "22:00", local: "Kansas City" },
    { id: "J2", timeA: "Áustria", timeB: "Jordânia", siglaA: "at", siglaB: "jo", data: "17/06 • Quarta", hora: "01:00", local: "San Francisco" },
    { id: "K1", timeA: "Portugal", timeB: "RD Congo", siglaA: "pt", siglaB: "cd", data: "17/06 • Quarta", hora: "14:00", local: "Houston" },
    { id: "K2", timeA: "Uzbequistão", timeB: "Colômbia", siglaA: "uz", siglaB: "co", data: "17/06 • Quarta", hora: "23:00", local: "Cidade do México" },
    { id: "L1", timeA: "Inglaterra", timeB: "Croácia", siglaA: "gb-eng", siglaB: "hr", data: "17/06 • Quarta", hora: "17:00", local: "Dallas" },
    { id: "L2", timeA: "Gana", timeB: "Panamá", siglaA: "gh", siglaB: "pa", data: "17/06 • Quarta", hora: "20:00", local: "Toronto" }
  ],
  rodada2: [
    { id: "A3", timeA: "México", timeB: "Coreia do Sul", siglaA: "mx", siglaB: "kr", data: "18/06 • Quinta", hora: "22:00", local: "Guadalajara" },
    { id: "A4", timeA: "África do Sul", timeB: "Tchéquia", siglaA: "za", siglaB: "cz", data: "18/06 • Quinta", hora: "13:00", local: "Atlanta" },
    { id: "B3", timeA: "Canadá", timeB: "Catar", siglaA: "ca", siglaB: "qa", data: "18/06 • Quinta", hora: "16:00", local: "Vancouver" },
    { id: "B4", timeA: "Suíça", timeB: "Bósnia", siglaA: "ch", siglaB: "ba", data: "18/06 • Quinta", hora: "19:00", local: "Los Angeles" },
    { id: "C3", timeA: "Brasil", timeB: "Haiti", siglaA: "br", siglaB: "ht", data: "19/06 • Sexta", hora: "21:30", local: "Filadélfia" },
    { id: "C4", timeA: "Marrocos", timeB: "Escócia", siglaA: "ma", siglaB: "gb-sct", data: "19/06 • Sexta", hora: "19:00", local: "Boston" },
    { id: "D3", timeA: "EUA", timeB: "Austrália", siglaA: "us", siglaB: "au", data: "19/06 • Sexta", hora: "16:00", local: "Seattle" },
    { id: "D4", timeA: "Paraguai", timeB: "Turquia", siglaA: "py", siglaB: "tr", data: "20/06 • Sábado", hora: "00:00", local: "San Francisco" },
    { id: "E3", timeA: "Alemanha", timeB: "Costa do Marfim", siglaA: "de", siglaB: "ci", data: "20/06 • Sábado", hora: "17:00", local: "Toronto" },
    { id: "E4", timeA: "Curaçao", timeB: "Equador", siglaA: "cw", siglaB: "ec", data: "20/06 • Sábado", hora: "21:00", local: "Kansas City" },
    { id: "F3", timeA: "Holanda", timeB: "Suécia", siglaA: "nl", siglaB: "se", data: "20/06 • Sábado", hora: "14:00", local: "Houston" },
    { id: "F4", timeA: "Japão", timeB: "Tunísia", siglaA: "jp", siglaB: "tn", data: "21/06 • Domingo", hora: "01:00", local: "Monterrey" },
    { id: "G3", timeA: "Bélgica", timeB: "Irã", siglaA: "be", siglaB: "ir", data: "21/06 • Domingo", hora: "16:00", local: "Miami" },
    { id: "G4", timeA: "Egito", timeB: "Nova Zelândia", siglaA: "eg", siglaB: "nz", data: "21/06 • Domingo", hora: "22:00", local: "Atlanta" },
    { id: "H3", timeA: "Espanha", timeB: "Arábia Saudita", siglaA: "es", siglaB: "sa", data: "21/06 • Domingo", hora: "13:00", local: "Atlanta" },
    { id: "H4", timeA: "Cabo Verde", timeB: "Uruguai", siglaA: "cv", siglaB: "uy", data: "21/06 • Domingo", hora: "19:00", local: "Miami" },
    { id: "I3", timeA: "França", timeB: "Iraque", siglaA: "fr", siglaB: "iq", data: "22/06 • Segunda", hora: "18:00", local: "Filadélfia" },
    { id: "I4", timeA: "Senegal", timeB: "Noruega", siglaA: "sn", siglaB: "no", data: "22/06 • Segunda", hora: "21:00", local: "Nova York/NJ" },
    { id: "J3", timeA: "Argentina", timeB: "Áustria", siglaA: "ar", siglaB: "at", data: "22/06 • Segunda", hora: "14:00", local: "Dallas" },
    { id: "J4", timeA: "Argélia", timeB: "Jordânia", siglaA: "dz", siglaB: "jo", data: "23/06 • Terça", hora: "00:00", local: "San Francisco" },
    { id: "K3", timeA: "Portugal", timeB: "Uzbequistão", siglaA: "pt", siglaB: "uz", data: "23/06 • Terça", hora: "14:00", local: "Houston" },
    { id: "K4", timeA: "RD Congo", timeB: "Colômbia", siglaA: "cd", siglaB: "co", data: "23/06 • Terça", hora: "23:00", local: "Guadalajara" },
    { id: "L3", timeA: "Inglaterra", timeB: "Gana", siglaA: "gb-eng", siglaB: "gh", data: "23/06 • Terça", hora: "17:00", local: "Boston" },
    { id: "L4", timeA: "Croácia", timeB: "Panamá", siglaA: "hr", siglaB: "pa", data: "23/06 • Terça", hora: "20:00", local: "Toronto" }
  ],
  rodada3: [
    { id: "A5", timeA: "México", timeB: "Tchéquia", siglaA: "mx", siglaB: "cz", data: "24/06 • Quarta", hora: "22:00", local: "Cidade do México" },
    { id: "A6", timeA: "África do Sul", timeB: "Coreia do Sul", siglaA: "za", siglaB: "kr", data: "24/06 • Quarta", hora: "22:00", local: "Monterrey" },
    { id: "B5", timeA: "Canadá", timeB: "Suíça", siglaA: "ca", siglaB: "ch", data: "24/06 • Quarta", hora: "16:00", local: "San Francisco" },
    { id: "B6", timeA: "Bósnia", timeB: "Catar", siglaA: "ba", siglaB: "qa", data: "24/06 • Quarta", hora: "16:00", local: "Vancouver" },
    { id: "C5", timeA: "Brasil", timeB: "Escócia", siglaA: "br", siglaB: "gb-sct", data: "24/06 • Quarta", hora: "19:00", local: "Miami" },
    { id: "C6", timeA: "Marrocos", timeB: "Haiti", siglaA: "ma", siglaB: "ht", data: "24/06 • Quarta", hora: "19:00", local: "Atlanta" },
    { id: "D5", timeA: "EUA", timeB: "Turquia", siglaA: "us", siglaB: "tr", data: "25/06 • Quinta", hora: "23:00", local: "Los Angeles" },
    { id: "D6", timeA: "Paraguai", timeB: "Austrália", siglaA: "py", siglaB: "au", data: "25/06 • Quinta", hora: "23:00", local: "San Francisco" },
    { id: "E5", timeA: "Alemanha", timeB: "Equador", siglaA: "de", siglaB: "ec", data: "25/06 • Quinta", hora: "17:00", local: "Nova York/NJ" },
    { id: "E6", timeA: "Curaçao", timeB: "Costa do Marfim", siglaA: "cw", siglaB: "ci", data: "25/06 • Quinta", hora: "17:00", local: "Filadélfia" },
    { id: "F5", timeA: "Holanda", timeB: "Tunísia", siglaA: "nl", siglaB: "tn", data: "25/06 • Quinta", hora: "20:00", local: "Kansas City" },
    { id: "F6", timeA: "Japão", timeB: "Suécia", siglaA: "jp", siglaB: "se", data: "25/06 • Quinta", hora: "20:00", local: "Dallas" },
    { id: "G5", timeA: "Bélgica", timeB: "Nova Zelândia", siglaA: "be", siglaB: "nz", data: "27/06 • Sábado", hora: "00:00", local: "Miami" },
    { id: "G6", timeA: "Egito", timeB: "Irã", siglaA: "eg", siglaB: "ir", data: "27/06 • Sábado", hora: "00:00", local: "Atlanta" },
    { id: "H5", timeA: "Espanha", timeB: "Uruguai", siglaA: "es", siglaB: "uy", data: "26/06 • Sexta", hora: "21:00", local: "Guadalajara" },
    { id: "H6", timeA: "Cabo Verde", timeB: "Arábia Saudita", siglaA: "cv", siglaB: "sa", data: "26/06 • Sexta", hora: "21:00", local: "Houston" },
    { id: "I5", timeA: "França", timeB: "Noruega", siglaA: "fr", siglaB: "no", data: "26/06 • Sexta", hora: "16:00", local: "Boston" },
    { id: "I6", timeA: "Senegal", timeB: "Iraque", siglaA: "sn", siglaB: "iq", data: "26/06 • Sexta", hora: "16:00", local: "Toronto" },
    { id: "J5", timeA: "Argentina", timeB: "Jordânia", siglaA: "ar", siglaB: "jo", data: "27/06 • Sábado", hora: "23:00", local: "Dallas" },
    { id: "J6", timeA: "Argélia", timeB: "Áustria", siglaA: "dz", siglaB: "at", data: "27/06 • Sábado", hora: "23:00", local: "Kansas City" },
    { id: "K5", timeA: "Portugal", timeB: "Colômbia", siglaA: "pt", siglaB: "co", data: "27/06 • Sábado", hora: "20:30", local: "Atlanta" },
    { id: "K6", timeA: "RD Congo", timeB: "Uzbequistão", siglaA: "cd", siglaB: "uz", data: "27/06 • Sábado", hora: "20:30", local: "Houston" },
    { id: "L5", timeA: "Inglaterra", timeB: "Panamá", siglaA: "gb-eng", siglaB: "pa", data: "27/06 • Sábado", hora: "18:00", local: "Nova York/NJ" },
    { id: "L6", timeA: "Croácia", timeB: "Gana", siglaA: "hr", siglaB: "gh", data: "27/06 • Sábado", hora: "18:00", local: "Filadélfia" }
  ],
  rodada16avos: [
    { id: "M1", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M2", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M3", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M4", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M5", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M6", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M7", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M8", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M9", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M10", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M11", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M12", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M13", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M14", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M15", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "M16", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" }
  ],
  rodadaOitavas: [
    { id: "O1", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "O2", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "O3", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "O4", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "O5", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "O6", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "O7", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" },
    { id: "O8", timeA: "A Definir", timeB: "A Definir", siglaA: "un", siglaB: "un", data: "Data a definir", hora: "--:--", local: "Estádio" }
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
    await carregarConfrontosMataMata();
    renderizarJogosAdmin();
    await carregarResultadosOficiais();
    // ----------------------------

    // VERIFICAÇÃO DE ADMIN
    if (user.uid === ADMIN_UID) {
      adminPanel.classList.remove('hidden');
      renderizarPainelConfrontosAdmin();
      
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
    renderizarJogos('rodada16avos', 'list-16avos');
    renderizarJogos('rodadaOitavas', 'list-oitavas'); 
    
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

    // 👇 NOVA VERIFICAÇÃO DE TRAVAS 👇
    try {
      const docStatus = await getDoc(doc(db, "configuracoes", "status"));
      const travas = docStatus.exists() ? docStatus.data() : {};

      // Verifica 16-Avos
      if (rodadaKey === 'rodada16avos' && travas.trava_16avos) {
          alert("🔒 Os palpites para os 16-Avos estão encerrados!");
          return;
      }
      
      // Verifica Oitavas
      if (rodadaKey === 'rodadaOitavas' && travas.trava_oitavas) {
          alert("🔒 Os palpites para as Oitavas estão encerrados!");
          return;
      }

      // Verifica Fase de Grupos (Se você usava uma trava com outro nome no banco, troque o 'bloqueio_geral' abaixo)
      if (['rodada1', 'rodada2', 'rodada3'].includes(rodadaKey) && travas.bloqueio_geral) {
          alert("🔒 Os palpites para a Fase de Grupos estão encerrados!");
          return;
      }
    } catch (error) {
      console.error("Erro ao checar travas:", error);
      alert("Falha de conexão ao verificar segurança.");
      return;
    }
    // 👆 FIM DA NOVA VERIFICAÇÃO DE TRAVAS 👆

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
      
      ['rodada1', 'rodada2', 'rodada3', 'rodada16avos', 'rodadaOitavas'].forEach(rodadaKey => {
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
  
  ['rodada1', 'rodada2', 'rodada3', 'rodada16avos', 'rodadaOitavas'].forEach(rodadaKey => {
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
    
    ['rodada1', 'rodada2', 'rodada3', 'rodada16avos', 'rodadaOitavas'].forEach(rodadaKey => {
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

// --- GERAR E RENDERIZAR RANKING (COM FILTRO DE REDE E FASE INDIVIDUAL) ---
async function atualizarRanking() {
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

    // 🚀 O NOVO MOTOR DE FILTRO DE FASES ENTRA AQUI
    const filtroRankingFase = document.getElementById('filtro-ranking-fase');
    // Se o filtro não existir na tela ainda, assume 'grupos' como padrão
    const faseSelecionada = filtroRankingFase ? filtroRankingFase.value : 'grupos';

    // 👇 A LÓGICA QUE FALTAVA ESTÁ AQUI DENTRO 👇
    let rodadasParaSomar = [];
    if (faseSelecionada === 'grupos') {
        rodadasParaSomar = ['rodada1', 'rodada2', 'rodada3'];
    } else if (faseSelecionada === '16avos') {
        rodadasParaSomar = ['rodada16avos'];
    } else if (faseSelecionada === 'oitavas') {
        rodadasParaSomar = ['rodadaOitavas'];
    } else {
        // Se a pessoa escolheu rodada1, rodada2 ou rodada3 isoladamente no menu:
        rodadasParaSomar = [faseSelecionada];
    }
    // 👆 FIM DA LÓGICA NOVA 👆

    const docResultados = await getDoc(doc(db, "configuracoes", "resultados"));
    const placaresReais = docResultados.exists() ? docResultados.data().placarReal || {} : {};

    const palpitesSnap = await getDocs(collection(db, "palpites"));
    let tabela = [];

    palpitesSnap.forEach((userDoc) => {
      const dados = userDoc.data();
      const uid = userDoc.id;

      // 🚨 A MÁGICA DA VLAN ACONTECE AQUI
      if (bolaoAtivo && (!dados.boloesInscritos || !dados.boloesInscritos.includes(bolaoAtivo))) {
        return; // Break silencioso para o próximo jogador
      }

      let pontosTotais = 0;
      const nome = dados.nome || "Jogador sem nome";

      // 🚀 LOOP AGORA RESPEITA APENAS A FASE SELECIONADA
      rodadasParaSomar.forEach(rodada => {
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

      tabela.push({ nome: nome, pontos: pontosTotais, uid: uid }); // UID ADICIONADO AQUI
    });

    // Ordena do maior para o menor
    tabela.sort((a, b) => b.pontos - a.pontos);

    rankingList.innerHTML = "";
    
    // Tratamento de erro se a sala ainda estiver vazia
    if (tabela.length === 0) {
        rankingList.innerHTML = "<p style='text-align:center; color:#555;'>Nenhum jogador pontuou nesta fase ainda.</p>";
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
        <span style="display: flex; align-items: center; gap: 5px;">
          <strong>${index + 1}º</strong> ${medalha} 
          <span class="nome-clicavel" data-uid="${posicao.uid}" style="color: #1976d2; cursor: pointer; text-decoration: underline; font-weight: bold; margin-left: 5px;" title="Ver palpites de ${posicao.nome}">${posicao.nome}</span>
        </span>
        <span style="color: #2e7d32; font-weight: 900;">${posicao.pontos} pts</span>
      `;
      rankingList.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao montar o ranking:", error);
    rankingList.innerHTML = "<p style='text-align:center; color:red;'>Erro ao carregar ranking.</p>";
  }
}

// 🚀 ESCUTADOR DO FILTRO (Faz a tabela atualizar na mesma hora que o usuário clica)
const filtroRankingDropdown = document.getElementById('filtro-ranking-fase');
if (filtroRankingDropdown) {
    filtroRankingDropdown.addEventListener('change', atualizarRanking);
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

// =============================================================================
// 📊 MÓDULO DE EXPORTAÇÃO DE DADOS (CSV COM SUPORTE EXCEL BR)
// =============================================================================

// Função Auxiliar: Transforma o texto em arquivo e força o download no navegador
function baixarArquivoCSV(conteudo, nomeArquivo) {
  // O caractere "\uFEFF" é o BOM (Byte Order Mark). Ele força o Excel a abrir em UTF-8 correto.
  const blob = new Blob(["\uFEFF" + conteudo], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", nomeArquivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 1. COMPROVANTE DO JOGADOR (Exportar palpites da própria conta)
const btnExportarUser = document.getElementById('btn-exportar-meus-palpites');
if (btnExportarUser) {
  btnExportarUser.addEventListener('click', async () => {
    // Importação dinâmica do Auth do Firebase para pegar o usuário logado na hora
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js");
    const auth = getAuth();
    
    if (!auth.currentUser) {
      alert("Erro: Você precisa estar logado para exportar seus palpites.");
      return;
    }

    try {
      // Puxa o documento de palpites fresco direto do UID dele
      const userDoc = await getDoc(doc(db, "palpites", auth.currentUser.uid));
      
      if (!userDoc.exists()) {
        alert("Você ainda não salvou nenhum palpite para exportar.");
        return;
      }

      const dados = userDoc.data();
      const nomeJogador = dados.nome || "Jogador";
      
      // Monta o cabeçalho do arquivo CSV
      let csv = `COMPROVANTE OFICIAL DE PALPITES - COPA 2026\n`;
      csv += `Jogador:;${nomeJogador}\n`;
      csv += `Data de Emissão:;${new Date().toLocaleString('pt-BR')}\n\n`;
      csv += `Rodada;ID do Jogo;Palpite Time A;Palpite Time B\n`;

      // Varre as 3 rodadas estruturadas no banco
      const rodadas = ['rodada1', 'rodada2', 'rodada3', 'rodada16avos', 'rodadaOitavas'];
      rodadas.forEach(rodada => {
        if (dados[rodada]) {
          // Ordena os jogos numericamente para o CSV ficar organizado
          const jogosOrdenados = Object.keys(dados[rodada]).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
          
          jogosOrdenados.forEach(jogoId => {
            const p = dados[rodada][jogoId];
            if (p && p.timeA !== undefined && p.timeB !== undefined) {
              csv += `${rodada.toUpperCase()};${jogoId};${p.timeA};${p.timeB}\n`;
            }
          });
        }
      });

      // Dispara o download do comprovante personalizado
      const nomeArquivo = `Comprovante_Palpites_${nomeJogador.replace(/\s+/g, '_')}.csv`;
      baixarArquivoCSV(csv, nomeArquivo);

    } catch (error) {
      console.error("Erro ao gerar comprovante:", error);
      alert("Falha de comunicação ao tentar gerar o arquivo.");
    }
  });
}

// 2. BACKUP DO ADMINISTRADOR (Gera uma tabela mestre com os palpites de TODO MUNDO)
const btnExportarAdmin = document.getElementById('btn-exportar-geral-csv');
if (btnExportarAdmin) {
  btnExportarAdmin.addEventListener('click', async () => {
    const confirmar = confirm("Deseja gerar o relatório consolidado em CSV com os palpites de todos os usuários do banco de dados?");
    if (!confirmar) return;

    try {
      const palpitesSnap = await getDocs(collection(db, "palpites"));
      
      if (palpitesSnap.empty) {
        alert("Nenhum palpite cadastrado no sistema ainda.");
        return;
      }

      // Cabeçalho da planilha mestre
      let csv = `RELATÓRIO MESTRE AUDITADO - PALPITES DOS JOGADORES\n`;
      csv += `Gerado em:;${new Date().toLocaleString('pt-BR')}\n\n`;
      csv += `Jogador;Redes Inscritas;Rodada;ID do Jogo;Palpite Time A;Palpite Time B\n`;

      // Varre cada usuário cadastrado na coleção
      palpitesSnap.forEach(userDoc => {
        const dados = userDoc.data();
        const nome = dados.nome || "Jogador Sem Nome";
        const redes = (dados.boloesInscritos && dados.boloesInscritos.length > 0) ? dados.boloesInscritos.join(" | ") : "Nenhum";
        
        const rodadas = ['rodada1', 'rodada2', 'rodada3', 'rodada16avos', 'rodadaOitavas'];
        rodadas.forEach(rodada => {
          if (dados[rodada]) {
            const jogosOrdenados = Object.keys(dados[rodada]).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
            
            jogosOrdenados.forEach(jogoId => {
              const p = dados[rodada][jogoId];
              if (p && p.timeA !== undefined && p.timeB !== undefined) {
                csv += `${nome};${redes};${rodada.toUpperCase()};${jogoId};${p.timeA};${p.timeB}\n`;
              }
            });
          }
        });
      });

      // Baixa o dump geral de segurança
      baixarArquivoCSV(csv, `Backup_Mestre_Palpites_Copa2026.csv`);

    } catch (error) {
      console.error("Erro ao exportar relatório geral:", error);
      alert("Erro na rede ao tentar consolidar os dados.");
    }
  });
}

// =============================================================================
// 🔍 MÓDULO: ESPIAR PALPITES DO ADVERSÁRIO NO RANKING (VERSÃO 3.0 COM CORES)
// =============================================================================

const modalPalpites = document.getElementById('modal-palpites');
const fecharModalBtn = document.getElementById('fechar-modal-btn');
const listaModal = document.getElementById('modal-lista-palpites');
const tituloModal = document.getElementById('modal-nome-jogador');
const filtroModal = document.getElementById('filtro-modal-rodadas'); 

let dadosModalAtual = null; 
let placaresReaisModal = {}; // 🚀 Nova memória para guardar os resultados oficiais

// 1. Fechar o Modal
if (fecharModalBtn && modalPalpites) {
  fecharModalBtn.addEventListener('click', () => { modalPalpites.style.display = 'none'; });
  modalPalpites.addEventListener('click', (e) => {
      if(e.target === modalPalpites) modalPalpites.style.display = 'none';
  });
}

// 2. Função inteligente que desenha os cards com nomes, filtro e CORES
function renderizarPalpitesModal(filtro) {
  if (!dadosModalAtual) return;
  
  let htmlPalpites = "";
  const rodadas = filtro === 'todas' ? ['rodada1', 'rodada2', 'rodada3', 'rodada16avos', 'rodadaOitavas'] : [filtro];
  
  rodadas.forEach(rodada => {
    if (dadosModalAtual[rodada]) {
      const jogosOrdenados = Object.keys(dadosModalAtual[rodada]).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
      
      let rodadaTemPalpite = false;
      let nomeBonito = rodada.replace('rodada', 'Rodada ');
      let htmlRodada = `<h4 style="margin: 15px 0 5px 0; color: #1976d2; font-size: 0.95em; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px;">${nomeBonito}</h4>`;
      
      jogosOrdenados.forEach(jogoId => {
        const p = dadosModalAtual[rodada][jogoId];
        
        if (p.timeA !== undefined && p.timeB !== undefined) {
          rodadaTemPalpite = true;
          
          const jogoInfo = jogos[rodada].find(j => j.id === jogoId);
          const nomeA = jogoInfo ? jogoInfo.timeA : "Time A";
          const nomeB = jogoInfo ? jogoInfo.timeB : "Time B";

          // 🚀 LÓGICA DAS CORES (Semáforo)
          let corFundo = "#f4f6f8"; // Padrão: Cinza claro (Jogo ainda não aconteceu)
          let corBorda = "#e0e0e0";
          let corPlacar = "#333";
          let opacidade = "1";

          const real = placaresReaisModal[jogoId];
          if (real !== undefined) {
             // O jogo já tem placar oficial, vamos calcular os pontos!
             const pts = calcularPontos(p.timeA, p.timeB, real.timeA, real.timeB);
             
             if (pts === 25 || pts === 18) {
                 corFundo = "#e8f5e9"; // Verde (Acertou muito)
                 corBorda = "#81c784";
                 corPlacar = "#2e7d32";
             } else if (pts === 10 || pts === 5) {
                 corFundo = "#fffde7"; // Amarelo (Acertou algo)
                 corBorda = "#fff176";
                 corPlacar = "#f57f17";
             } else {
                 corFundo = "#ffebee"; // Vermelho (Errou tudo)
                 corBorda = "#e57373";
                 corPlacar = "#c62828";
                 opacidade = "0.7"; // Deixa o cartão dos erros um pouco mais apagado
             }
          }

          htmlRodada += `
            <div style="background: ${corFundo}; padding: 10px 12px; border-radius: 8px; border: 1px solid ${corBorda}; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; opacity: ${opacidade}; transition: all 0.3s ease;">
              <span style="font-size: 0.85em; color: #555; font-weight: bold; max-width: 65%; line-height: 1.2;">
                ${nomeA} <br><span style="font-size: 0.8em; color: #999;">x</span> ${nomeB}
              </span>
              <span style="font-size: 1.2em; font-weight: bold; color: ${corPlacar}; text-align: right; min-width: 60px;">
                ${p.timeA} <span style="color: #e65100; margin: 0 5px;">X</span> ${p.timeB}
              </span>
            </div>
          `;
        }
      });
      
      if(rodadaTemPalpite) htmlPalpites += htmlRodada;
    }
  });
  
  listaModal.innerHTML = htmlPalpites === "" ? "<p style='text-align:center;'>Nenhum palpite nesta rodada.</p>" : htmlPalpites;
}

// 3. Escutador do filtro
if (filtroModal) {
  filtroModal.addEventListener('change', (e) => {
    renderizarPalpitesModal(e.target.value);
  });
}

// 4. Interceptador de cliques no Ranking
const containerRanking = document.getElementById('ranking-list'); 

if (containerRanking) {
  containerRanking.addEventListener('click', async (e) => {
    if (e.target.classList.contains('nome-clicavel')) {
      const uidAlvo = e.target.getAttribute('data-uid');
      const nomeAlvo = e.target.innerText;

      tituloModal.innerText = `Palpites de ${nomeAlvo}`;
      listaModal.innerHTML = "<p style='text-align:center; color: #555;'>Buscando no banco de dados...</p>";
      modalPalpites.style.display = 'flex';
      
      if (filtroModal) filtroModal.value = 'todas';

      try {
        // 🚀 Busca o documento do jogador E os resultados reais ao mesmo tempo
        const [docRef, docResultados] = await Promise.all([
            getDoc(doc(db, "palpites", uidAlvo)),
            getDoc(doc(db, "configuracoes", "resultados"))
        ]);
        
        placaresReaisModal = docResultados.exists() ? docResultados.data().placarReal || {} : {};

        if (docRef.exists()) {
          dadosModalAtual = docRef.data(); 
          renderizarPalpitesModal('todas'); 
        } else {
          dadosModalAtual = null;
          listaModal.innerHTML = "<p style='text-align:center; color: #d32f2f;'>Documento do jogador não encontrado.</p>";
        }
      } catch (error) {
        console.error("Erro ao buscar palpites:", error);
        listaModal.innerHTML = "<p style='text-align:center; color: #d32f2f;'>Falha de conexão.</p>";
      }
    }
  });
}

// =============================================================================
// 🏆 MÓDULO MATA-MATA: INJEÇÃO DINÂMICA DE CONFRONTOS
// =============================================================================

// 1. Motor que lê os dados do Admin e injeta na matriz ANTES de desenhar o ecrã
async function carregarConfrontosMataMata() {
  try {
    const docSnap = await getDoc(doc(db, "configuracoes", "confrontos"));
    if (docSnap.exists()) {
      const confrontos = docSnap.data();
      ['rodada16avos', 'rodadaOitavas'].forEach(rodada => {
        jogos[rodada].forEach(jogo => {
          if (confrontos[jogo.id]) {
            jogo.timeA = confrontos[jogo.id].timeA || jogo.timeA;
            jogo.timeB = confrontos[jogo.id].timeB || jogo.timeB;
            jogo.siglaA = confrontos[jogo.id].siglaA || jogo.siglaA;
            jogo.siglaB = confrontos[jogo.id].siglaB || jogo.siglaB;
            jogo.data = confrontos[jogo.id].data || jogo.data;
            jogo.hora = confrontos[jogo.id].hora || jogo.hora;
          }
        });
      });
    }
  } catch (error) {
    console.error("Erro ao puxar confrontos dinâmicos:", error);
  }
}

// 2. Construtor do painel de Admin (onde vais digitar as equipas classificadas)
function renderizarPainelConfrontosAdmin() {
  const container = document.getElementById('admin-definir-confrontos-list');
  if (!container) return;
  container.innerHTML = "";

  ['rodada16avos', 'rodadaOitavas'].forEach(rodada => {
    const titulo = document.createElement('h4');
    titulo.innerText = rodada === 'rodada16avos' ? 'Fase: 16-Avos' : 'Fase: Oitavas';
    titulo.style.color = "#1976d2";
    container.appendChild(titulo);

    jogos[rodada].forEach(jogo => {
      const div = document.createElement('div');
      div.style.cssText = "display: flex; gap: 5px; align-items: center; background: #fff; padding: 10px; border: 1px solid #ccc; border-radius: 4px; overflow-x: auto;";
      div.innerHTML = `
        <span style="font-weight: bold; width: 35px; color: #555;">${jogo.id}</span>
        <input type="text" id="cfg-timeA-${jogo.id}" value="${jogo.timeA}" placeholder="Time A" style="width: 110px; padding: 5px;">
        <input type="text" id="cfg-siglaA-${jogo.id}" value="${jogo.siglaA}" placeholder="Sigla (br)" style="width: 55px; padding: 5px;">
        <span style="font-weight: bold; color: #e65100;"> X </span>
        <input type="text" id="cfg-timeB-${jogo.id}" value="${jogo.timeB}" placeholder="Time B" style="width: 110px; padding: 5px;">
        <input type="text" id="cfg-siglaB-${jogo.id}" value="${jogo.siglaB}" placeholder="Sigla (pt)" style="width: 55px; padding: 5px;">
        <input type="text" id="cfg-data-${jogo.id}" value="${jogo.data}" placeholder="15/06" style="width: 70px; padding: 5px;">
        <input type="text" id="cfg-hora-${jogo.id}" value="${jogo.hora}" placeholder="16:00" style="width: 60px; padding: 5px;">
      `;
      container.appendChild(div);
    });
  });
}

// 3. Gatilho que guarda as tuas configurações no banco de dados
const btnSalvarConfrontos = document.getElementById('btn-salvar-confrontos');
if (btnSalvarConfrontos) {
  btnSalvarConfrontos.addEventListener('click', async () => {
    const novosConfrontos = {};
    ['rodada16avos', 'rodadaOitavas'].forEach(rodada => {
      jogos[rodada].forEach(jogo => {
        const tA = document.getElementById(`cfg-timeA-${jogo.id}`).value;
        const sA = document.getElementById(`cfg-siglaA-${jogo.id}`).value;
        const tB = document.getElementById(`cfg-timeB-${jogo.id}`).value;
        const sB = document.getElementById(`cfg-siglaB-${jogo.id}`).value;
        const data = document.getElementById(`cfg-data-${jogo.id}`).value;
        const hora = document.getElementById(`cfg-hora-${jogo.id}`).value;
        
        if(tA !== "A Definir" || tB !== "A Definir") {
          novosConfrontos[jogo.id] = { timeA: tA, siglaA: sA, timeB: tB, siglaB: sB, data: data, hora: hora };
        }
      });
    });

    try {
      await setDoc(doc(db, "configuracoes", "confrontos"), novosConfrontos, { merge: true });
      alert("✅ Confrontos oficiais definidos com sucesso!.");
    } catch (error) {
      console.error("Erro ao guardar confrontos:", error);
      alert("Falha de ligação ao tentar guardar os confrontos.");
    }
  });
}

// 🚀 Lógica de Travar/Destravar Fases Específicas
['16avos', 'oitavas'].forEach(fase => {
    const btnTrava = document.getElementById(`btn-toggle-trava-${fase}`);
    if (btnTrava) {
        btnTrava.addEventListener('click', async () => {
            try {
                // Puxa o status atual
                const docSnap = await getDoc(doc(db, "configuracoes", "status"));
                let statusAtual = false; // Padrão destravado
                if (docSnap.exists() && docSnap.data()[`trava_${fase}`] !== undefined) {
                    statusAtual = docSnap.data()[`trava_${fase}`];
                }

                // Inverte o status e salva
                const novoStatus = !statusAtual;
                await setDoc(doc(db, "configuracoes", "status"), {
                    [`trava_${fase}`]: novoStatus
                }, { merge: true });

                alert(`✅ Fase ${fase.toUpperCase()} agora está ${novoStatus ? "TRAVADA 🔒" : "DESTRAVADA 🔓"}!`);
                window.location.reload();
            } catch (error) {
                console.error("Erro ao alterar trava:", error);
                alert("Falha de conexão.");
            }
        });
    }
});
