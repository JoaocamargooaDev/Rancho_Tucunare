const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// ==================== RESERVAS ====================

// ROTA POST PARA CRIAR RESERVA
router.post("/reserva", async (req, res) => {
  const {
    nome,
    telefone,
    email,
    cidade,
    data_nascimento,
    data_entrada,
    data_saida,
    mensagem
  } = req.body;

  // Validações
  if (!nome || !telefone || !email || !data_entrada || !data_saida) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  console.log("Reserva recebida para Firebase:", req.body);

  if (!db) {
    return res.status(500).json({ error: "Firebase não inicializado. Verifique o arquivo serviceAccountKey.json" });
  }

  try {
    const docRef = await db.collection('reservas').add({
      nome,
      telefone,
      email,
      cidade,
      data_nascimento,
      data_entrada,
      data_saida,
      mensagem,
      status: 'pendente',
      data_criacao: new Date().toISOString()
    });

    return res.status(201).json({ 
      message: "Reserva cadastrada com sucesso no Firebase!",
      id: docRef.id 
    });
  } catch (error) {
    console.error("Erro ao inserir reserva no Firebase:", error);
    return res.status(500).json({ 
      error: "Erro ao inserir reserva", 
      details: error.message 
    });
  }
});

// ROTA GET PARA LISTAR RESERVAS (ADMIN)
router.get("/reservas", async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: "Firebase não inicializado" });
  }

  try {
    const snapshot = await db.collection('reservas').orderBy('data_criacao', 'desc').get();
    const reservas = [];
    snapshot.forEach(doc => {
      reservas.push({ id: doc.id, ...doc.data() });
    });
    return res.json(reservas);
  } catch (error) {
    console.error("Erro ao buscar reservas no Firebase:", error);
    return res.status(500).json({ error: "Erro ao buscar reservas" });
  }
});

// ROTA GET PARA VER DETALHES DE UMA RESERVA
router.get("/reserva/:id", async (req, res) => {
  const { id } = req.params;

  if (!db) {
    return res.status(500).json({ error: "Firebase não inicializado" });
  }

  try {
    const doc = await db.collection('reservas').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }
    return res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao buscar reserva no Firebase:", error);
    return res.status(500).json({ error: "Erro ao buscar reserva" });
  }
});


// ROTA DELETE PARA APAGAR RESERVA
router.delete("/reserva/:id", async (req, res) => {
  const { id } = req.params;

  if (!db) {
    return res.status(500).json({ error: "Firebase não inicializado" });
  }

  try {
    await db.collection('reservas').doc(id).delete();
    return res.json({ message: "Reserva apagada com sucesso!" });
  } catch (error) {
    console.error("Erro ao apagar reserva no Firebase:", error);
    return res.status(500).json({ error: "Erro ao apagar reserva" });
  }
});

router.put("/reserva/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ['pendente', 'confirmada', 'cancelada'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  if (!db) {
    return res.status(500).json({ error: "Firebase não inicializado" });
  }

  try {
    await db.collection('reservas').doc(id).update({ status });
    return res.json({ message: "Reserva atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar reserva no Firebase:", error);
    return res.status(500).json({ error: "Erro ao atualizar reserva" });
  }
});

// ==================== AUTENTICAÇÃO ADMIN ====================

// ROTA POST PARA LOGIN ADMIN
router.post("/admin/login", async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ error: "Usuário e senha obrigatórios" });
  }

  // Hardcoded Admin (Mantido como fallback rápido)
  if (usuario.toLowerCase() === 'admin' && senha === 'Admin1234') {
    const token = Buffer.from(`admin_hardcoded:admin:${Date.now()}`).toString('base64');
    return res.json({
      message: "Login realizado com sucesso!",
      token: token,
      admin: {
        id: 'admin_hardcoded',
        usuario: 'admin',
        nome: 'Administrador'
      }
    });
  }

  if (!db) {
    return res.status(500).json({ error: "Firebase não inicializado" });
  }

  try {
    const snapshot = await db.collection('admins')
      .where('usuario', '==', usuario)
      .where('senha', '==', senha)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    const adminDoc = snapshot.docs[0];
    const adminData = adminDoc.data();
    
    // Simular token
    const token = Buffer.from(`${adminDoc.id}:${adminData.usuario}:${Date.now()}`).toString('base64');

    return res.json({
      message: "Login realizado com sucesso!",
      token: token,
      admin: {
        id: adminDoc.id,
        usuario: adminData.usuario,
        nome: adminData.nome
      }
    });
  } catch (error) {
    console.error("Erro na autenticação Firebase:", error);
    return res.status(500).json({ error: "Erro na autenticação" });
  }
});

// ROTA GET PARA VERIFICAR AUTENTICAÇÃO
router.get("/admin/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const adminId = decoded[0];

    // Hardcoded Admin verify
    if (adminId === 'admin_hardcoded') {
      return res.json({
        admin: {
          id: 'admin_hardcoded',
          usuario: 'admin',
          nome: 'Administrador'
        }
      });
    }

    if (!db) {
      return res.status(500).json({ error: "Firebase não inicializado" });
    }

    const doc = await db.collection('admins').doc(adminId).get();
    if (!doc.exists) {
      return res.status(401).json({ error: "Token inválido" });
    }
    
    return res.json({ admin: { id: doc.id, ...doc.data() } });
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
});

// ROTA GET PARA LOGOUT
router.get("/admin/logout", (req, res) => {
  return res.json({ message: "Logout realizado com sucesso!" });
});

module.exports = router;
