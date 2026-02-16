# FinanceBot - Seu Assistente Financeiro no Discord

O FinanceBot é um bot completo para Discord, desenvolvido em Node.js com `discord.js v14`, projetado para ajudar você e sua comunidade a gerenciar finanças pessoais de forma eficiente e divertida. Ele permite registrar receitas e despesas, acompanhar metas financeiras, calcular um score financeiro e muito mais, tudo isso permanecendo online 24/7 gratuitamente.

## ✨ Funcionalidades

*   **Registro de Transações**: Comandos `/receita` e `/despesa` para registrar seus movimentos financeiros.
*   **Consulta de Saldo**: Comando `/saldo` para verificar seu balanço atual.
*   **Resumos Financeiros**: Comandos `/resumo semanal` e `/resumo mensal` para ter uma visão clara de seus gastos e receitas.
*   **Metas Financeiras**: Crie, acompanhe e adicione fundos às suas metas com o comando `/meta`.
*   **Score Financeiro**: Obtenha uma pontuação de 0 a 100 com o comando `/score`, baseada em seu controle de gastos, progresso de metas e regularidade de registros.
*   **Persistência de Dados**: Utiliza MongoDB Atlas para garantir que seus dados estejam sempre seguros e acessíveis.
*   **Deploy Gratuito e 24/7**: Configurado para deploy no Render com um sistema de keep-alive para máxima disponibilidade.

## 🚀 Como Usar

Para começar a usar o FinanceBot no seu servidor Discord, siga as instruções de deploy e configuração detalhadas nos arquivos `docs/`.

## 🛠️ Instalação e Configuração (Desenvolvimento Local)

1.  **Clone o repositório**:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd finance-bot
    ```
2.  **Instale as dependências**:
    ```bash
    npm install
    ```
3.  **Configure as variáveis de ambiente**:
    Crie um arquivo `.env` na raiz do projeto e preencha com suas credenciais (veja `.env.example`):
    ```env
    DISCORD_TOKEN=SEU_TOKEN_DO_BOT
    CLIENT_ID=SEU_CLIENT_ID_DO_BOT
    MONGODB_URI=SUA_URI_DO_MONGODB_ATLAS
    PORT=3000
    APP_URL=http://localhost:3000 # Ou a URL do seu deploy
    ```
4.  **Registre os comandos Slash**:
    ```bash
    npm run deploy
    ```
5.  **Inicie o bot**:
    ```bash
    npm start
    ```

## ☁️ Deploy Gratuito no Render (24/7)

Para instruções detalhadas sobre como fazer o deploy do FinanceBot no Render e mantê-lo online 24/7, consulte o arquivo `docs/DEPLOY_RENDER.md`.

## 🗄️ Configuração do MongoDB Atlas

Para configurar seu banco de dados MongoDB Atlas, consulte o arquivo `docs/MONGODB_ATLAS_SETUP.md`.

## 💡 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está licenciado sob a licença ISC.
