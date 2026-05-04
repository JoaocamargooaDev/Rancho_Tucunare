const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

// Conexão com o banco (Firebase)
require('./firebase');

// Permitir JSON e dados de formulário 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API 
console.log('Carregando rotas /api ...');
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota admin
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 404 genérico
app.use((req, res) => {
  console.log('404 atingido em:', req.method, req.url);
  res.status(404).send('Rota não encontrada');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor funcionando em http://localhost:${port}`);
});
