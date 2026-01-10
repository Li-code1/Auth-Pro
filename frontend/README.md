# 🛡️ AuthPro: Sistema de Autenticação Full-Stack

O **AuthPro** é uma solução robusta de autenticação desenvolvida para servir como porta de entrada segura para aplicações corporativas. Este projeto implementa o fluxo completo de gerenciamento de usuários, desde o cadastro com validação rigorosa até a persistência de sessão.

## 🛠️ Tecnologias e Ferramentas

### **Frontend (Interface)**

* **React + TypeScript:** Base para uma interface reativa e tipagem estática, reduzindo bugs em tempo de desenvolvimento.
* **Tailwind CSS:** Estilização utilitária para um design moderno, responsivo e com alta performance visual.
* **Lucide React:** Conjunto de ícones vetoriais para uma experiência de usuário (UX) intuitiva.

### **Formulários e Validação**

* **React Hook Form:** Gerenciamento de formulários focado em performance (uncontrolled components), evitando re-renderizações desnecessárias.
* **Zod:** Biblioteca de declaração e validação de esquemas. Utilizada para garantir que os dados de login e cadastro sigam regras estritas antes mesmo de chegarem ao servidor.

### **Backend (Servidor)**

* **FastAPI (Python):** Framework de alta performance para a construção da API.
* **Pydantic:** Validação de dados no lado do servidor, garantindo a integridade do banco de dados.
* **JSON Persistence:** Armazenamento estruturado de usuários em arquivo, permitindo persistência de dados sem a complexidade inicial de um banco SQL.

## 🚀 Funcionalidades Principais

* **Alternância de Modos:** Troca fluida entre as telas de Login e Cadastro em uma única interface.
* **Validação em Tempo Real:** Erros de preenchimento (e-mail inválido, senhas que não coincidem, nome curto) são exibidos instantaneamente.
* **Persistência de Sessão:** Uso de `localStorage` para manter o usuário conectado mesmo após atualizar a página.
* **Feedback de Carregamento:** Botões inteligentes que mostram o estado de "Processando" para evitar múltiplos disparos.

## 📂 Estrutura do Projeto

```text
auth-pro/
├── auth-backend/
│   ├── main.py          # Servidor FastAPI
│   └── users.json       # Base de dados de usuários
└── auth-frontend/
    ├── src/
    │   ├── components/  # AuthForm e Dashboard
    │   ├── App.tsx      # Gerenciador de rotas e sessão
    │   └── main.tsx     # Entrada do React
    └── tailwind.config.js

```

## ⚙️ Como Executar

1. **Backend:**
```bash
cd auth-backend
python main.py

```


*O servidor iniciará em `http://127.0.0.1:8000*`
2. **Frontend:**
```bash
cd auth-frontend
npm install
npm run dev

```



---

**Projeto desenvolvido por Liliane Lima como demonstração de habilidades em Segurança, Frontend Moderno e Integração de APIs.**

---

