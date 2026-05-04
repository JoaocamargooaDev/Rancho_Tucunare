const admin = require("firebase-admin");

/**
 * CONFIGURAÇÃO DO FIREBASE
 * 
 * Para concluir a integração:
 * 1. Vá ao Console do Firebase (https://console.firebase.google.com/)
 * 2. Configurações do Projeto > Contas de Serviço
 * 3. Clique em "Gerar nova chave privada"
 * 4. Salve o arquivo JSON como "serviceAccountKey.json" na raiz deste projeto
 */

try {
  const serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("Firebase Admin inicializado com sucesso");
} catch (error) {
  console.error("Erro ao inicializar Firebase Admin:", error.message);
  console.log("AVISO: O arquivo 'serviceAccountKey.json' não foi encontrado.");
  console.log("O servidor continuará rodando, mas funcionalidades do Firebase falharão.");
}

let db = null;
try {
  if (admin.apps.length > 0) {
    db = admin.firestore();
  }
} catch (e) {
  console.error("Erro ao inicializar Firestore:", e.message);
}

module.exports = { admin, db };
