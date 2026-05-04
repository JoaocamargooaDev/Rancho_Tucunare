# Rancho Tucunaré - Sistema de Reservas

Sistema completo de reservas para hospedagem com interface responsiva, painel administrativo e API REST.

## Visão Geral

**Rancho Tucunaré** é um sistema de gerenciamento de reservas com:
- Site público para fazer reservas
- Painel administrativo para gerenciar reservas
- API REST completa
- Banco de dados **Firebase Firestore**
- Interface responsiva para todos os dispositivos

## Requisitos

- **Node.js** v14 ou superior
- **Conta no Firebase** (Firestore habilitado)
- **npm** ou **yarn**

## Instalação Rápida (5 minutos)

### 1. Instalar Dependências
```bash
cd "Teste 2.0"
npm install
```

### 2. Configurar Firebase

1. Vá ao [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente.
3. No menu lateral, vá em **Firestore Database** e clique em **Criar banco de dados**.
4. Vá em **Configurações do Projeto** > **Contas de Serviço**.
5. Clique em **Gerar nova chave privada**.
6. Salve o arquivo JSON baixado como `serviceAccountKey.json` na raiz deste projeto.
7. O sistema detectará automaticamente o arquivo e inicializará a conexão.

### 3. Configurar Frontend (Firebase Client)

Para que o login e cadastro funcionem na página inicial:
1. No Console do Firebase, vá em **Configurações do Projeto** > **Geral**.
2. Em "Seus aplicativos", clique no ícone de código (`</>`) para adicionar um Web App.
3. Copie o objeto `firebaseConfig` gerado.
4. Abra o arquivo `public/script.js` e cole os valores no topo do arquivo, substituindo o placeholder.

### 4. Iniciar Servidor
```bash
npm start
```

**Saída esperada:**
```
Carregando rotas /api ...
Firebase Admin inicializado com sucesso
Servidor funcionando em http://localhost:3000
```

### 4. Acessar a Aplicação
- **Site público:** http://localhost:3000
- **Painel admin:** http://localhost:3000/admin.html

## Estrutura do Projeto

```
Teste 2.0/
├── package.json          # Dependências e scripts
├── server.js             # Servidor Express principal
├── firebase.js           # Configuração do Firebase
│
├── routes/
│   └── api.js            # Endpoints da API REST
│
├── public/
│   ├── index.html        # Página principal
│   ├── script.js         # JavaScript da página principal
│   ├── style.css         # Estilos da página
│   ├── admin.html        # Painel administrativo
│   ├── admin.js          # Lógica do painel admin
│   ├── admin.css         # Estilos do painel admin
│   └── img/              # Imagens do site
│
├── .gitignore            # Arquivos ignorados pelo Git
├── .eslintrc.json        # Configuração ESLint
└── README.md             # Este arquivo
```

## Configuração

### Configuração do Firebase (firebase.js)
O arquivo `firebase.js` gerencia a inicialização do SDK. Certifique-se de que o arquivo `serviceAccountKey.json` está presente na raiz.

### Porta do Servidor (server.js)
```javascript
const port = 3000;  // Mudar se necessário
```

## Banco de Dados

### Tabelas

#### `reserva` (11 colunas)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (PK) |
| `nome` | VARCHAR(255) | Nome do hóspede |
| `telefone` | VARCHAR(20) | Telefone para contato |
| `email` | VARCHAR(255) | Email do hóspede |
| `cidade` | VARCHAR(255) | Cidade de origem |
| `data_nascimento` | DATE | Data de nascimento |
| `data_entrada` | DATE | Data de check-in |
| `data_saida` | DATE | Data de check-out |
| `mensagem` | TEXT | Observações/pedidos especiais |
| `status` | ENUM | 'pendente', 'confirmada', 'cancelada' |
| `data_criacao` | TIMESTAMP | Data de criação do registro |

#### `admin` (6 colunas)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (PK) |
| `usuario` | VARCHAR(100) | Usuário de login (UNIQUE) |
| `senha` | VARCHAR(255) | Senha de acesso |
| `nome` | VARCHAR(255) | Nome completo |
| `email` | VARCHAR(255) | Email do admin |
| `data_criacao` | TIMESTAMP | Data de criação |
| `ultimo_acesso` | TIMESTAMP | Último login |

## API REST

### Endpoints Disponíveis

#### POST `/api/reserva` (Pública)
Criar nova reserva

**Request:**
```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "email": "joao@email.com",
  "cidade": "São Paulo",
  "data_nascimento": "1990-05-15",
  "data_entrada": "2024-03-01",
  "data_saida": "2024-03-05",
  "mensagem": "Gostaria de um quarto com vista"
}
```

**Response (201):**
```json
{ "message": "Reserva cadastrada com sucesso!" }
```

#### GET `/api/reservas` (Autenticada)
Listar todas as reservas

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "status": "pendente",
    ...
  }
]
```

#### GET `/api/reserva/:id` (Autenticada)
Obter detalhes de uma reserva específica

#### PUT `/api/reserva/:id` (Autenticada)
Atualizar status da reserva

**Request:**
```json
{ "status": "confirmada" }
```

#### POST `/api/admin/login` (Pública)
Fazer login no painel administrativo

**Request:**
```json
{
  "usuario": "admin",
  "senha": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "base64_encoded_token"
}
```

#### GET `/api/admin/verify` (Autenticada)
Verificar se token é válido

#### GET `/api/admin/logout` (Autenticada)
Logout (limpa token localmente)

## Como Usar

### Para Clientes: Fazer uma Reserva

1. Acesse http://localhost:3000
2. Navegue até "Reserve já!" ou scroll até a seção de reservas
3. Preencha o formulário:
   - Nome (obrigatório)
   - Telefone (obrigatório)
   - Email (obrigatório)
   - Cidade
   - Data de Nascimento
   - Data de Entrada (obrigatório)
   - Data de Saída (obrigatório)
   - Mensagem/Observações
4. Clique em "Confirmar Reserva"
5. Aguarde confirmação (mensagem de sucesso)

### Para Administrador: Gerenciar Reservas

#### Acessar o Painel
1. Acesse http://localhost:3000/admin.html
2. Faça login com as credenciais padrão

#### Funcionalidades
- **Dashboard:** Visualiza estatísticas (Total, Pendentes, Confirmadas, Canceladas)
- **Filtros:** Filtrar por status ou buscar por nome/email/telefone
- **Ações:**
  - Ver detalhes completos da reserva
  - Confirmar reserva
  - Cancelar reserva
  - Reativar reserva cancelada
- **Exportar:** Baixar todas as reservas em CSV para Excel
- **Logout:** Sair do painel

## Credenciais de Teste

| Sistema | Usuário | Senha |
|---------|---------|-------|
| Painel Admin | admin | admin123 |
| MySQL | rancho_user | 123456 |
| MySQL Host | localhost | 3306 |

**⚠️ IMPORTANTE:** Altere as credenciais em produção!

## Segurança

### Melhorias Necessárias Antes de Produção

Este é um sistema de demonstração. Antes de colocar em produção:

1. **Senhas:** Implementar hash com bcrypt
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Autenticação:** Usar JWT ao invés de Base64
   ```javascript
   const jwt = require('jsonwebtoken');
   const token = jwt.sign(payload, secret, { expiresIn: '1h' });
   ```

3. **Proteção:** 
   - HTTPS em produção (obrigatório)
   - CORS configurado corretamente
   - Validação de campos no backend
   - Rate limiting para APIs

4. **Dados:**
   - Variáveis de ambiente (.env) para credenciais
   - SQL injection prevention (já implementado com prepared statements)
   - Criptografia de dados sensíveis

### Exemplo com .env
```bash
# .env
DB_HOST=localhost
DB_USER=rancho_user
DB_PASSWORD=sua_senha_segura
DB_NAME=rancho
JWT_SECRET=sua_chave_secreta_aqui
```

## Troubleshooting

### Erro: "Conexão ao banco de dados recusada"
**Causa:** MySQL não está rodando  
**Solução:**
```bash
# Verificar se MySQL está ativo
mysql -h localhost -u root -p

# Verificar credenciais em db.js
# Confirmar que banco 'rancho' existe
```

### Erro: "Tabelas não encontram"
**Solução:** Execute novamente os comandos SQL do passo 2 da instalação

### Erro: "Porta 3000 já está em uso"
**Solução:** Altere a porta em `server.js` ou mate o processo
```bash
# Encontrar processo na porta
netstat -ano | findstr :3000

# Matar processo (Windows)
taskkill /PID <PID> /F
```

### Admin não consegue fazer login
**Solução:** Verifique se o usuário existe no banco
```sql
SELECT * FROM admin WHERE usuario='admin';
```

### Formulário não submete
**Solução:** Abra F12 (DevTools) e verifique o console para erros

## Performance e Features

### CSS Animations
- fade-in-move
- glow-pulse
- scale-pop
- slide-in-left/right
- neon-glow
- cascata
- slideDown

### Responsividade
- Breakpoint 480px (móvel)
- Breakpoint 768px (tablet)
- Breakpoint 1200px+ (desktop)
- Funciona perfeitamente em 320px a 4K

### Features Implementadas
- Validação de campos obrigatórios
- Mensagens de feedback ao usuário
- Toast notifications
- Loading overlay
- Modal de detalhes
- Exportar CSV
- Dashboard com estatísticas
- Filtros em tempo real
- Design Glass morphism

## Scripts NPM

```bash
npm start    # Inicia o servidor em modo produção
npm run dev  # Inicia o servidor em modo desenvolvimento (mesma coisa por enquanto)
```

## Logs

Todos os eventos importantes geram logs:
- **Terminal:** Logs do servidor (Express e MySQL)
- **Console do navegador:** Logs JavaScript (F12 > Console)
- **Admin:** Toast notifications para feedback visual

## Suporte e Bugs

Se encontrar problemas:
1. Verifique os logs no terminal
2. Abra Developer Tools (F12) e veja o console
3. Teste a API com Postman ou cURL
4. Confirme que MySQL está conectado
5. Verifique as credenciais de banco de dados

## Licença

MIT - Libre para uso pessoal e comercial

## Desenvolvido para

**Rancho Tucunaré** - Sistema de Hospedagem  
Criado com Node.js, Express e MySQL
