# Rancho Tucunaré

Site institucional e sistema de reservas para o **Rancho Tucunaré**, com página pública responsiva, formulário de reservas, galeria de imagens, integração com Firebase Firestore e painel administrativo para gerenciamento das solicitações.

## Visão geral

O projeto foi desenvolvido para apresentar o Rancho Tucunaré de forma profissional e permitir que visitantes consultem informações do espaço, vejam imagens, acessem localização, tirem dúvidas frequentes, entrem em contato e solicitem reservas diretamente pelo site.

Além da página pública, o sistema possui uma área administrativa para acompanhar reservas, filtrar solicitações, visualizar detalhes, alterar status e exportar dados em CSV.

## Funcionalidades

### Site público

- Página inicial institucional com apresentação do Rancho Tucunaré.
- Seção **Sobre Nós** com descrição do espaço.
- Galeria de imagens com visualização ampliada em lightbox/carrossel.
- Seção de acomodações.
- FAQ interativo com perguntas frequentes.
- Localização com mapa incorporado do Google Maps.
- Depoimentos integrados via widget externo.
- Formulário de contato integrado ao Formspree.
- Formulário de reserva integrado à API própria do projeto.
- Botão flutuante do WhatsApp.
- Botão de voltar ao topo.
- Layout responsivo para desktop, tablet e celular.
- Estilo visual com efeito glassmorphism/liquid glass.

### Sistema de reservas

- Cadastro de reserva com nome, telefone, e-mail, cidade, data de nascimento, data de entrada, data de saída e mensagem opcional.
- Validação de campos obrigatórios no backend.
- Armazenamento das reservas no Firebase Firestore.
- Status padrão da reserva como `pendente`.
- Registro automático da data de criação.

### Painel administrativo

- Login administrativo.
- Dashboard com total de reservas, pendentes, confirmadas e canceladas.
- Listagem de reservas em tabela.
- Busca por dados da reserva.
- Filtro por status.
- Visualização detalhada de cada reserva.
- Alteração de status para `pendente`, `confirmada` ou `cancelada`.
- Exclusão de reservas.
- Exportação das reservas em CSV.
- Feedback visual com loading e mensagens do tipo toast.

## Tecnologias utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript Vanilla
- Google Fonts
- Google Maps Embed
- Formspree
- Elfsight Reviews Widget

### Backend

- Node.js
- Express.js
- Firebase Admin SDK
- Firebase Firestore

### Ferramentas de desenvolvimento

- npm
- Nodemon
- Concurrently
- LocalTunnel
- ESLint
- EditorConfig

## Estrutura do projeto

```text
Rancho/
├── public/
│   ├── index.html          # Página pública principal
│   ├── style.css           # Estilos do site público
│   ├── script.js           # Interações do site público
│   ├── admin.html          # Página do painel administrativo
│   ├── admin.css           # Estilos do painel administrativo
│   ├── admin.js            # Lógica do painel administrativo
│   └── img/                # Imagens, logos e ícones do site
│
├── routes/
│   └── api.js              # Rotas da API de reservas e admin
│
├── firebase.js             # Inicialização do Firebase Admin
├── server.js               # Servidor Express
├── package.json            # Dependências e scripts npm
├── package-lock.json       # Lockfile das dependências
├── .gitignore              # Arquivos ignorados pelo Git
├── .editorconfig           # Padronização do editor
├── .eslintrc.json          # Configuração do ESLint
└── README.md               # Documentação do projeto
```

## Pré-requisitos

Antes de iniciar, instale:

- Node.js 14 ou superior
- npm
- Conta no Firebase com Firestore habilitado

## Instalação

Clone o repositório:

```bash
git clone https://github.com/JoaocamargooaDev/Rancho_Tucunare.git
```

Acesse a pasta do projeto:

```bash
cd Rancho_Tucunare
```

Instale as dependências:

```bash
npm install
```

## Configuração do Firebase

O projeto usa o Firebase Admin SDK no backend para salvar e consultar reservas no Firestore.

### 1. Criar ou acessar projeto Firebase

Acesse o Console do Firebase e crie um novo projeto ou selecione um projeto existente.

### 2. Ativar Firestore

No menu lateral do Firebase:

1. Acesse **Firestore Database**.
2. Clique em **Criar banco de dados**.
3. Escolha o modo adequado para seu ambiente.
4. Finalize a criação do banco.

### 3. Gerar chave de serviço

1. Acesse **Configurações do projeto**.
2. Vá até **Contas de serviço**.
3. Clique em **Gerar nova chave privada**.
4. Baixe o arquivo JSON.
5. Renomeie o arquivo para:

```text
serviceAccountKey.json
```

6. Coloque o arquivo na raiz do projeto, no mesmo nível de `server.js` e `package.json`.

> Importante: nunca envie `serviceAccountKey.json` para o GitHub. Esse arquivo contém credenciais sensíveis do Firebase.

## Como executar o projeto

Para iniciar o servidor:

```bash
npm start
```

Ou:

```bash
npm run dev
```

Por padrão, o servidor usa a porta definida em `process.env.PORT` ou a porta `3003`.

Acesse no navegador:

```text
http://localhost:3003
```

Painel administrativo:

```text
http://localhost:3003/admin.html
```

Caso a porta esteja ocupada, o servidor tenta subir automaticamente na próxima porta disponível.

## Scripts disponíveis

```bash
npm start
```

Inicia o servidor com Node.js.

```bash
npm run dev
```

Inicia o servidor em modo de desenvolvimento.

```bash
npm run tunnel
```

Cria um túnel público com LocalTunnel na porta 3001.

```bash
npm run dev:tunnel
```

Executa o servidor e o túnel simultaneamente usando Concurrently.

## Rotas da aplicação

### Páginas

| Rota | Descrição |
|---|---|
| `/` | Página pública principal |
| `/admin.html` | Painel administrativo |

### API de reservas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/reserva` | Cria uma nova reserva |
| `GET` | `/api/reservas` | Lista todas as reservas |
| `GET` | `/api/reserva/:id` | Retorna os detalhes de uma reserva |
| `PUT` | `/api/reserva/:id` | Atualiza o status de uma reserva |
| `DELETE` | `/api/reserva/:id` | Remove uma reserva |

### API administrativa

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/admin/login` | Realiza login administrativo |
| `GET` | `/api/admin/verify` | Verifica token de autenticação |
| `GET` | `/api/admin/logout` | Encerra sessão administrativa |

## Exemplo de criação de reserva

Endpoint:

```http
POST /api/reserva
```

Body:

```json
{
  "nome": "João Silva",
  "telefone": "(61) 99999-9999",
  "email": "joao@email.com",
  "cidade": "Brasília",
  "data_nascimento": "1995-05-10",
  "data_entrada": "2026-07-20",
  "data_saida": "2026-07-22",
  "mensagem": "Gostaria de confirmar disponibilidade para o fim de semana."
}
```

Resposta esperada:

```json
{
  "message": "Reserva cadastrada com sucesso no Firebase!",
  "id": "id_gerado_pelo_firestore"
}
```

## Modelo de dados no Firestore

### Coleção `reservas`

| Campo | Descrição |
|---|---|
| `nome` | Nome completo do solicitante |
| `telefone` | Telefone de contato |
| `email` | E-mail do solicitante |
| `cidade` | Cidade informada no formulário |
| `data_nascimento` | Data de nascimento |
| `data_entrada` | Data de entrada/check-in |
| `data_saida` | Data de saída/check-out |
| `mensagem` | Observações adicionais |
| `status` | Status da reserva: `pendente`, `confirmada` ou `cancelada` |
| `data_criacao` | Data de criação do registro |

### Coleção `admins`

A coleção `admins` pode ser usada para armazenar usuários administrativos com os seguintes campos:

| Campo | Descrição |
|---|---|
| `usuario` | Nome de usuário usado no login |
| `senha` | Senha do administrador |
| `nome` | Nome exibido no painel administrativo |

## Segurança

Antes de publicar em produção, recomenda-se:

- Remover qualquer credencial hardcoded do backend.
- Implementar autenticação com JWT seguro.
- Armazenar senhas com hash usando bcrypt.
- Usar variáveis de ambiente para credenciais e configurações sensíveis.
- Restringir CORS apenas aos domínios permitidos.
- Configurar regras adequadas no Firebase.
- Não versionar `serviceAccountKey.json`.
- Não versionar `node_modules`.
- Usar HTTPS em produção.

Sugestão de `.gitignore`:

```gitignore
node_modules/
.env
serviceAccountKey.json
.expo/
npm-debug.log*
.DS_Store
```

## Boas práticas de deploy

Para publicar o projeto, você pode usar serviços compatíveis com Node.js, como:

- Render
- Railway
- Vercel com serverless adaptations
- Heroku
- VPS própria

Em produção, configure:

- Variável `PORT`, se necessário.
- Credenciais do Firebase via variável de ambiente ou Secret Manager.
- Domínio personalizado.
- HTTPS.
- Logs de erro.
- Backup/monitoramento do Firestore.

## Possíveis melhorias futuras

- Envio automático de e-mail ao receber nova reserva.
- Confirmação automática por WhatsApp.
- Calendário visual de disponibilidade.
- Bloqueio de datas já reservadas.
- Upload de fotos pelo painel administrativo.
- Autenticação com Firebase Auth.
- Recuperação de senha do administrador.
- Dashboard financeiro.
- Relatórios mensais de reservas.
- Deploy automatizado com GitHub Actions.

## Troubleshooting

### Firebase não inicializado

Verifique se o arquivo `serviceAccountKey.json` está na raiz do projeto e se o Firestore está habilitado no Firebase.

### Porta ocupada

O servidor tenta automaticamente usar a próxima porta disponível. Verifique no terminal qual porta foi iniciada.

### Formulário de reserva não salva

Confira:

- Se o servidor está rodando.
- Se o formulário está apontando para `/api/reserva`.
- Se o Firebase foi inicializado corretamente.
- Se os campos obrigatórios foram preenchidos.

### Painel administrativo não carrega reservas

Confira:

- Se existem reservas no Firestore.
- Se a API `/api/reservas` está respondendo.
- Se o login administrativo foi realizado corretamente.
- Se o console do navegador mostra erros de JavaScript.

## Licença

Este projeto está licenciado sob a licença MIT.

## Autor

Projeto desenvolvido para **Rancho Tucunaré**.

Repositório: `Rancho_Tucunare`
