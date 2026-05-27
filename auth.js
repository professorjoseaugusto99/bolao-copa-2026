// Importações modulares do Firebase (SDK V10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// COLOQUE SUAS CREDENCIAIS AQUI
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
const db = getFirestore(app); // 🚨 É ESTE CABO QUE ESTÁ FALTANDO!

// --- GERADOR DE CÓDIGO ÚNICO PARA BOLÕES ---
function gerarCodigoBolao() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 5; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

// --- ROTEAMENTO DO JOGADOR PARA O BOLÃO CORRETO (VERSÃO BLINDADA) ---
async function gerenciarBolaoDoUsuario(uid, nomeUsuarioLogado) {
    // 🚨 Captura os elementos com os IDs reais do seu HTML
    const inputBolaoEl = document.getElementById('auth-bolao-nome');
    const inputNomeCompletoEl = document.getElementById('nome'); // Ajustado para 'nome' igual ao seu HTML
    const tipoBolaoEl = document.querySelector('input[name="tipo_bolao"]:checked');

    // Travas de segurança: se o elemento não existir na tela, assume o valor vazio em vez de crashar
    const inputBolao = inputBolaoEl ? inputBolaoEl.value.trim().toUpperCase() : "";
    const inputNomeCompleto = inputNomeCompletoEl ? inputNomeCompletoEl.value.trim() : "";
    const tipoBolao = tipoBolaoEl ? tipoBolaoEl.value : "entrar";

    const nomeFinal = inputNomeCompleto !== "" ? inputNomeCompleto : (nomeUsuarioLogado || "Jogador");

    // Se a caixa de bolão estiver vazia, é só um login comum. Passa direto sem mexer em grupo.
    if (inputBolao === "") {
        return true; 
    }

    try {
        if (tipoBolao === 'criar') {
            const novoCodigo = gerarCodigoBolao();
            
            await setDoc(doc(db, "boloes", novoCodigo), {
                nome: inputBolao,
                criadoPor: uid,
                criadoEm: new Date().toISOString()
            });

            await setDoc(doc(db, "palpites", uid), {
                nome: nomeFinal,
                boloesInscritos: arrayUnion(novoCodigo)
            }, { merge: true });

            alert(`✅ Bolão criado com sucesso!\n\nNome: "${inputBolao}"\nCódigo de convite: ${novoCodigo}\n\nPasse esse código para seus amigos.`);
            return true;

        } else if (tipoBolao === 'entrar') {
            const bolaoRef = await getDoc(doc(db, "boloes", inputBolao));
            
            if (bolaoRef.exists()) {
                await setDoc(doc(db, "palpites", uid), {
                    nome: nomeFinal,
                    boloesInscritos: arrayUnion(inputBolao)
                }, { merge: true });
                
                alert(`✅ Você entrou no bolão: ${bolaoRef.data().nome}!`);
                return true;
            } else {
                alert(`❌ Erro: O código "${inputBolao}" não existe.`);
                return false; 
            }
        }
    } catch (error) {
        console.error("Erro real dentro do gerenciarBolao:", error);
        alert("Erro ao processar os dados do bolão.");
        return false;
    }
}


// Mapeamento de elementos do DOM
const formTitle = document.getElementById('form-title');
const authForm = document.getElementById('auth-form');
const nameGroup = document.getElementById('name-group');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const submitBtn = document.getElementById('submit-btn');
const toggleText = document.getElementById('toggle-text');
const errorMsg = document.getElementById('error-msg');

let isLogin = true;

// Função para alternar a interface entre Login e Cadastro
function toggleMode(e) {
  if (e) e.preventDefault();
  isLogin = !isLogin;
  errorMsg.classList.add('hidden');
  
  if (isLogin) {
    formTitle.innerText = 'Entrar no Bolão';
    nameGroup.classList.add('hidden');
    nomeInput.required = false;
    submitBtn.innerText = 'Entrar';
    toggleText.innerHTML = 'Ainda não tem conta? <a href="#" id="toggle-link">Cadastre-se</a>';
  } else {
    formTitle.innerText = 'Criar Conta';
    nameGroup.classList.remove('hidden');
    nomeInput.required = true;
    submitBtn.innerText = 'Cadastrar';
    toggleText.innerHTML = 'Já tem conta? <a href="#" id="toggle-link">Faça Login</a>';
  }
  
  // Reatribui o evento ao novo link gerado no HTML
  document.getElementById('toggle-link').addEventListener('click', toggleMode);
}

// Escuta inicial do link de alternar
document.getElementById('toggle-link').addEventListener('click', toggleMode);

// Evento de disparo do Formulário
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMsg.classList.add('hidden');
  
  const email = emailInput.value;
  const senha = senhaInput.value;

// Lógica de Login
if (isLogin) {
  signInWithEmailAndPassword(auth, email, senha)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Dispara o gerenciador puxando o nome que já está salvo no perfil dele
      const sucessoBolao = await gerenciarBolaoDoUsuario(user.uid, user.displayName);
      
      if (!sucessoBolao) return;

      console.log("Logado com sucesso!", user);
      window.location.href = "app.html";
    })
    .catch((error) => {
      errorMsg.innerText = "Erro: E-mail ou senha incorretos.";
      errorMsg.classList.remove('hidden');
    });
}
// Lógica de Cadastro
else {
  // 1. 🚨 VALIDAÇÃO DE PACOTE: Verifica o nome antes de chamar o Firebase
  const nomeInput = document.getElementById('nome');
  const nomeDigitado = nomeInput ? nomeInput.value.trim() : "";

  if (nomeDigitado === "") {
    errorMsg.innerText = "Erro: O campo 'Nome ou Apelido' é obrigatório para criar uma conta.";
    errorMsg.classList.remove('hidden');
    return; // Aborta a execução aqui mesmo e não deixa criar a conta vazia!
  }

  createUserWithEmailAndPassword(auth, email, senha)
    .then(async (userCredential) => {
      const user = userCredential.user;
      
      // 2. 🚨 GRAVAÇÃO NO PERFIL: Atualiza o displayName no Firebase Auth
      await updateProfile(user, { displayName: nomeDigitado });
      
      // Passa o nome digitado direto para o gerenciador de bolões salvar no banco
      const sucessoBolao = await gerenciarBolaoDoUsuario(user.uid, nomeDigitado);
      
      if (!sucessoBolao) return;

      console.log("Conta criada com sucesso!", user);
      window.location.href = "app.html";
    })
    .catch((error) => {
      errorMsg.innerText = "Erro ao criar conta: " + error.message;
      errorMsg.classList.remove('hidden');
    });
}

});

// --- INTERRUPTOR DA GAVETA DE BOLÃO ---
document.addEventListener('DOMContentLoaded', () => {
  const btnMostrarBolao = document.getElementById('btn-mostrar-bolao');
  const caixaRedeBolao = document.getElementById('caixa-rede-bolao');
  const inputBolaoNomeReal = document.getElementById('auth-bolao-nome');

  if (btnMostrarBolao && caixaRedeBolao) {
    btnMostrarBolao.addEventListener('click', (e) => {
      e.preventDefault(); // Impede qualquer comportamento padrão que possa piscar a tela
      
      // Liga ou desliga a classe que esconde a gaveta
      caixaRedeBolao.classList.toggle('hidden');
      
      // Se a gaveta acabou de ser escondida...
      if (caixaRedeBolao.classList.contains('hidden')) {
        btnMostrarBolao.innerText = "Entrar ou Criar um Bolão (Opcional)";
        // Trava de segurança: Limpa o texto para o login comum passar liso!
        if (inputBolaoNomeReal) inputBolaoNomeReal.value = ""; 
      } 
      // Se a gaveta foi aberta...
      else {
        btnMostrarBolao.innerText = "Fechar opções de Bolão";
      }
    });
  }
});

// 🚨 GATILHO INICIAL: Roda a função sozinho assim que a página carrega!
atualizarPlaceholder();