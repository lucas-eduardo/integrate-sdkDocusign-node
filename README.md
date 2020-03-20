# Contratação Digital Docusign

### Índice

- **[Configuraçãos](#configurando)**

- **[Executar projeto localmente](#rodando-o-projeto-localmente)**

- **[Buildar o projeto para produção](#buildando-o-projeto-para-produção)**

- **[Rodar o projeto em produção](#rodando-o-projeto-em-produção)**

- **[Obtendo a chave de integração Docusign](#obtendo-a-chave-de-integração-docusign)**

- **[Obtendo a chave privada](#obtendo-a-chave-privada)**

- **[Obtendo o consentimento para geração de token](#obtendo-o-consentimento-para-geração-de-token)**

- **[Solicitando revisão de integração](#solicitando-revisão-de-integração)**


### Configurando

Para configurar as variaveis de ambiente, basta criar na raiz do projeto, um arquivo chamado **.env** e passar as seguintes configurações.

```
TOKEN = ''
INTEGRATION_KEY = ''
SCOPE = ''
BASE_URL = ''
AUTH_SERVER = ''
USER_ID = ''
ACCOUNT_ID = ''
USERNAME = ''
PASSWORD = ''
```

- **TOKEN**: é um token gerado pela própria docusign, é possível estar gerando no seguinte link: <a href="https://developers.docusign.com/oauth-token-generator">TOKEN DOCUSIGN</a>. Esse token é valido apenas por aproximadamente 8 horas e serve apenas para desenvolvimento.

- **INTEGRATION_KEY**: é a chave de integração do seu aplicativo, gerado no painel administrativo da docusign. *([Clique aqui para ver a sessão sobre a chave de integração](#obtendo-a-chave-de-integração-docusign))*

- **SCOPE**: o escopo de representação é implícito devido ao uso da concessão JWT.

- **BASE_URL**: é a url base da docusign, a url de homol será `https://demo.docusign.net/restapi`, já para produção `https://na2.docusign.net/restapi`.

- **AUTH_SERVER**: é definido o servidor de autorização a ser usado. Para o ambiente sandbox do desenvolvedor, use `account-d.docusign.com`. Para produção, use `account.docusign.com`.

- **USER_ID**: é o ID do usuário (também chamado de nome de usuário da API) em cujo nome seu aplicativo fará chamadas para a API da DocuSign. Esse ID é possível obter através do painel administrativo da docusign.

- **ACCOUNT_ID**: é o id da conta do **sandbox** ou da conta final de produção. Para localizar, basta [clicar aqui](https://support.docusign.com/articles/Where-do-I-find-my-DocuSign-account-number) e seguir as orientações.

- **USERNAME**: é o e-mail da conta.

- **PASSWORD**: é a senha da conta.

### Rodando o projeto localmente

- É necessário fazer a configuração do sistema para declarar as variáveis do projeto, conforme é explicado [nessa sessão](#configurando).

- `yarn install`

- `yarn dev`

Seguindo esses passos, o seu projeto estará rodando no http://localhost:3333

### Buildando o projeto para produção

- `yarn build`

Será criado uma pasta chamada **dist**, dentro dessa pasta estará todo o projeto em javascript puro.

### Rodando o projeto em produção

- Configurar o sistema conforme explicado [nessa sessão](#configurando).

- Basta colocar os arquivos que estão na pasta `dist` no servidor. *(Para gerar a pasta `dist`, basta verificar [essa sessão](#buildando-o-projeto-para-produção))*

- `yarn install --production` ou `npm install --production`

- `yarn start` ou `npm start`

**Lembrando que você precisa estar definindo suas variáveis no arquivo `.env`**

### Obtendo a chave de integração Docusign


Para obter a chave de integração, basta estar acessando a conta sandbox, entrar na área administrativa e selecione a opção **API e chaves**. Na tela será exibido um botão **ADICIONAR APLICATIVO / CÓDIGO DE INTEGRAÇÃO**, ao clicar no mesmo, basta estar definindo o nome do aplicativo e o mesmo vai gerar um código de integração.

*Exemplo*: **a7879568-xxxx-xxxx-xxxx-482731558eac**.

### Obtendo a chave privada

Para obter a chave privada, é necessário ter a chave de integração antes, conforme foi abordado [nesta sessão](#obtendo-a-chave-de-integração-docusign).

Com a chave de integração gerado, basta clicar em editar. Você será redirecionado para uma tela de configuração da aplicação, basta ir em **Integração de serviços** e clicar em **ADICIONAR PAR DE CHAVES RSA**, com isso será mostrado a chave publica e a privada, salve as duas, pois será exibido apenas uma vez.

### Obtendo o consentimento para geração de token

Com a chave de integração e a chave privada em mãos, você será capaz de obter o consentimento para a geração do token **JWT** da Docusign. Na edição da chave de integração, adicione uma url para redirecionamento, por exemplo: `https://lucaseduardo.netlify.com/`. Após usar a seguinte url:

`${SERVER}/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${CLIENT_ID}&redirect_uri=${URL}`.

- **${SERVER}**: é `https://account.docusign.com` para produção ou `https://account-d.docusign.com` para desenvolvimento (sandbox);

- **${CLIENT_ID}**: é a chave de integração.

- **${URL}**: deve ser exatamente o mesmo que foi configurado na edição da chave de integração.

#### Exemplos finais:

**Produção**: `https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=a7879568-xxxx-xxxx-xxxx-482731558eac&redirect_uri=https://lucaseduardo.netlify.com/`.

**Desenvolvimento**: `https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=a7879568-xxxx-xxxx-xxxx-482731558eac&redirect_uri=https://lucaseduardo.netlify.com/`.

Após acessar a url, será pedido a autenticação para a conta da docusign e depois que foi autorizado a geração do token, será redirecionado para o site configurado.

### Solicitando revisão de integração

Após a conclusão da aplicação, é necessário pedir a revisão da chave de integração, para isso basta acessar o painel administrativo, **API e chaves** e clique no botão **AÇÕES** da chave de integração, então basta clicar em **Enviar revisão** e escolher uma data. Dentro de alguns minutos será retornado uma resposta se foi aprovado ou não.

Para a aprovação, é necessário ter no minimo 20 requests com a chave de integração ao qual esta sendo pedido a revisão, e possuir um intervalo de tempo de pelo menos 20 segundos.
