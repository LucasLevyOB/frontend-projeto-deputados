# 🤖 Guia de Orientação para Agentes de IA (AGENTS.md)

Este documento estabelece o contexto, arquitetura, convenções e diretrizes técnicas para agentes de IA operando no repositório **frontend-projeto-depudados**.

---

## 📌 1. Visão Geral do Projeto

- **Nome:** Depudados - Frontend
- **Contexto:** Plataforma web para exploração, visualização e transparência de dados abertos da Câmara dos Deputados do Brasil (projeto acadêmico da disciplina de Programação para Internet e Web - PIW / UFC).
- **Ambiente de Produção:** [Firebase Hosting](https://depudados.web.app/)

### 🛠️ Stack Tecnológica Principal
- **Linguagem:** TypeScript
- **Framework / UI:** React 19 + React Router (modo framework com SSR/Node adapter)
- **Estilização & Componentes:** Material UI (MUI v6+), `@emotion/react`, `@emotion/styled`, `@mui/x-charts`
- **Requisições HTTP:** Axios
- **Virtualização de Listas:** `@tanstack/react-virtual`
- **Build & Dev:** Vite + React Router CLI

---

## ⚡ 2. Comandos Essenciais

Todos os comandos devem ser executados a partir da raiz do projeto:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento (`react-router dev`) |
| `npm run typecheck` | Gera tipos das rotas (`react-router typegen`) e valida tipagem TypeScript (`tsc -b`) |
| `npm run lint` | Executa a verificação estática de código com ESLint (`eslint .`) |
| `npm run build` | Executa o build de produção (inclui geração automática de sitemap) |
| `npm start` | Inicia a aplicação construída via Node.js |
| `npm run sitemap` | Gera o sitemap do projeto manualmente |

> **Nota:** Sempre valide as alterações executando `npm run typecheck` e `npm run lint` antes de concluir uma tarefa complexa.

---

## 📁 3. Estrutura do Projeto

```
frontend-projeto-depudados/
├── public/                 # Ativos estáticos públicos
├── scripts/                # Scripts utilitários de build (ex.: sitemap)
├── src/
│   ├── assets/             # Imagens, ícones e fontes locais
│   ├── components/         # Componentes React reutilizáveis e modulares
│   ├── config/             # Configurações de API e variáveis de ambiente
│   ├── constants/          # Constantes estáticas e enums
│   ├── hooks/              # Custom React Hooks
│   ├── layouts/            # Layouts estruturais (RootLayout, Header, Footer)
│   ├── pages/              # Páginas da aplicação organizadas por funcionalidade
│   ├── services/           # Classes/serviços de integração com APIs externas
│   ├── theme/              # Configuração do tema MUI (paleta, tipografia, componentes)
│   ├── types/              # Definições de tipos e interfaces TypeScript
│   ├── utils/              # Funções utilitárias puras e helpers
│   ├── entry.client.tsx    # Ponto de entrada do cliente
│   ├── root.tsx            # Documento raiz da aplicação React Router
│   └── routes.ts           # Definição declarativa das rotas da aplicação
├── eslint.config.js        # Configuração do ESLint
├── package.json            # Metadados e dependências
├── react-router.config.ts  # Configuração do React Router
├── tsconfig.json           # Configurações de TypeScript
└── vite.config.ts          # Configuração do Vite
```

---

## 📐 4. Convenções e Padrões de Código

### 4.1. Filosofia de Código
- **Simplicidade (KISS):** Mantenha as soluções simples, legíveis e diretas. Evite overengineering ou abstrações desnecessárias.
- **SOLID:** Respeite o princípio de responsabilidade única (SRP) e separação de interesses (componentes visuais não devem concentrar regras pesadas de negócio ou montagem complexa de requisições).
- **Sem Code Smells:** Evite duplicação de lógica, funções excessivamente longas e mutações diretas de estado.

### 4.2. Estilo e JavaScript/TypeScript
- **Preferência Declarativa:** Prefira métodos funcionais/declarativos (`map`, `filter`, `reduce`, `find`) em vez de laços imperativos (`for`, `while`).
- **Imutabilidade e Variáveis:**
  - Utilize `const` por padrão. Evite `let` a menos que estritamente necessário. Nunca utilize `var`.
- **Funções:**
  - Prefira Arrow Functions (`const minhaFuncao = () => { ... };`).
  - Priorize **funções puras** (sem efeitos colaterais), especialmente no diretório `src/utils/`.
- **Tipagem Estrita:**
  - Tipar explicitamente retornos de funções de serviços e props de componentes.
  - Evite o uso de `any`; aproveite ou estenda as definições em `src/types`.
- **Imports:**
  - Utilize o path alias `@/` configurado para apontar para a pasta `src/` (ex.: `import { Deputado } from '@/types';`).

### 4.3. Interface e Estilização (MUI)
- Utilize os componentes do Material UI (`@mui/material`) e ícones do `@mui/icons-material`.
- Para estilos específicos, utilize a prop `sx` integrada ao tema da aplicação, ou estilize através do tema centralizado em `src/theme/`.
- Respeite as cores e tipografia globais configuradas no tema.

---

## 🤖 5. Diretrizes Específicas para Agentes de IA

1. **Idioma das Respostas e Comunicação:** Sempre responda em **Português**.
2. **Escopo Estrito:** Mantenha as modificações estritamente restritas ao que foi solicitado.
3. **Preservação:** Conserve comentários e docstrings existentes que não estejam relacionados à alteração em andamento.
4. **Verificação de Qualidade:** Ao criar ou modificar código TypeScript/React, certifique-se de que a tipagem está coerente e sem erros de compilação ou linter.
5. **Tratamento de Erros:** Requisições a APIs externas em `src/services/` devem conter tratamento defensivo (ex.: blocos `try/catch` com logs claros e fallbacks previsíveis).
