# Projeto Landing Page - RG Pulse & Brutal Gazette

Bem-vindo ao projeto de landing pages da RG Pulse! Este repositório contém o código-fonte para as landing pages desenvolvidas, incluindo "AIPersonV2" e a temática "The Brutal Gazette".

## Visão Geral do Projeto

Este projeto tem como objetivo criar landing pages de alta conversão, com foco em uma experiência de usuário imersiva e design impactante. Utilizamos tecnologias modernas de front-end para garantir performance e manutenibilidade.

## Como Editar e Desenvolver Localmente

Para trabalhar no projeto localmente utilizando seu ambiente de desenvolvimento preferido (IDE), siga os passos abaixo.

**Pré-requisitos:**
*   Node.js (versão 18.x ou superior recomendada)
*   npm (geralmente vem com Node.js) ou Yarn

**Passos para Configuração:**

1.  **Clone o Repositório:**
    ```sh
    git clone <URL_DO_SEU_REPOSITORIO_GIT_AQUI>
    ```

2.  **Navegue até o Diretório do Projeto:**
    ```sh
    cd <NOME_DA_PASTA_DO_SEU_PROJETO>
    ```

3.  **Instale as Dependências:**
    Utilize o gerenciador de pacotes de sua preferência.
    ```sh
    npm install
    # ou
    yarn install
    ```

4.  **Inicie o Servidor de Desenvolvimento:**
    Este comando iniciará o servidor Vite com hot-reloading (atualização automática no navegador) e uma prévia instantânea da aplicação.
    ```sh
    npm run dev
    # ou
    yarn dev
    ```
    Acesse o endereço fornecido no terminal (geralmente `http://localhost:5173` ou similar) no seu navegador.

**Estrutura de Arquivos Sugerida (Exemplo):**
*   `src/pages/`: Contém os componentes de página principais (ex: `Index.tsx`, `AIPersonV2.tsx`).
*   `src/components/`: Contém componentes reutilizáveis.
    *   `src/components/ui/`: Para componentes de UI básicos (ex: `Button.tsx`, `Input.tsx` - possivelmente de ShadCN).
    *   `src/components/Layouts/`: Para componentes de layout (ex: `NewspaperLayout.tsx`, `SimpleLayout.tsx`).
    *   `src/components/Shared/`: Para componentes menores compartilhados.
*   `src/styles/`: Arquivos CSS globais (ex: `tailwind.css`).
*   `src/lib/`: Funções utilitárias, configurações (ex: `fonts.ts`, `utils.ts`).
*   `src/integrations/`: Módulos para integração com serviços externos (ex: `supabase/client.ts`).
*   `public/`: Arquivos estáticos.

## Tecnologias Utilizadas

Este projeto é construído com um stack moderno de front-end:

*   **Vite:** Build tool e servidor de desenvolvimento rápido.
*   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
*   **React:** Biblioteca para construção de interfaces de usuário.
*   **React Router DOM:** Para roteamento no lado do cliente.
*   **Tailwind CSS:** Framework CSS utility-first para estilização rápida.
*   **Shadcn/ui:** Coleção de componentes de UI reutilizáveis, construídos sobre Tailwind CSS e Radix UI (se aplicável ao seu uso de `Button`, `Input`, etc.).
*   **Lucide React:** Biblioteca de ícones SVG.
*   **Supabase (Cliente):** Para interações com backend Supabase (se aplicável, baseado no `LeadCaptureForm`).
*   **React Hook Form:** Para gerenciamento de formulários.
*   **@tanstack/react-query:** Para data fetching, caching e state management assíncrono.
*   **`canvas-confetti`**: Para efeitos visuais (como no `LeadCaptureForm`).

## Boas Práticas de Desenvolvimento

*   **Commits Atômicos:** Faça commits pequenos e focados, com mensagens claras.
*   **Branches:** Utilize branches para novas features ou correções (`feature/nome-da-feature`, `fix/descricao-do-bug`).
*   **Pull Requests:** Para mesclar código na branch principal (ex: `main` ou `develop`), utilize Pull Requests para revisão.
*   **Linting e Formatação:** Configure e utilize ferramentas como ESLint e Prettier para manter a consistência do código.
*   **Variáveis de Ambiente:** Para chaves de API e outras informações sensíveis, utilize variáveis de ambiente (`.env` arquivos). **Nunca commite chaves secretas diretamente no código.**

## Deploy (Hospedagem)

O deploy desta aplicação Vite/React pode ser feito em diversas plataformas modernas de hospedagem que suportam aplicações Node.js ou build estático. Algumas opções populares incluem:

*   **Vercel:** Excelente integração com frameworks front-end como Next.js e Vite. Oferece deploys automáticos a partir de commits no Git.
*   **Netlify:** Similar ao Vercel, com ótimo suporte para builds estáticos e functions serverless.
*   **GitHub Pages:** Para sites estáticos, se seu build for puramente front-end.
*   **AWS Amplify, Google Firebase Hosting, Azure Static Web Apps:** Opções de cloud providers.
*   **Servidor Próprio / VPS:** Requer mais configuração manual (ex: Nginx, Docker).

**Processo de Build para Produção:**
Geralmente, o comando para gerar os arquivos otimizados para produção é:
```sh
npm run build
# ou
yarn build
