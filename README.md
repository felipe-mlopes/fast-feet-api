# Fast Feet Api

## Descrição

Inspirado no último desafio da trilha Node do curso da Rocketseat, é uma API que gerencia uma transportadora fictícia. Fiz alguns incrementos para deixar mais funcional na parte voltada para os entregadores e criei uma versão admin voltada para o gerenciamento da transportadora.

O entregador consegue criar um cadastro, fazer o login, se autenticar, retirar entregas disponíveis de acordo com a sua localização e efetivar a entrega coletada mediante ao envio do pacote entregue.

Já o administrador consegue criar um registro para destinatários, criar pedidos e acessar um painel (dashboard) que gerar os resultados diários das coletas/entregas. 

### Tecnologias utilizadas:
- NodeJS
- PostgreSQL
- Docker
- Vitest (testes automatizados)

### Conceitos aplicados:
- Domain-Driven Design (DDD), Domain Events, Clean Architecture e Solid;
- Autenticação e Autorização (RBAC);
- Testes unitários e e2e;
- Integração com serviços externos (R2 Storage e Gmail via Nodemailer)

## Instalação

### Pré-requisitos:
- NodeJS
- Docker
 
### Etapas:
1) Faça o clone do repositório e no terminal navegue até a pasta;
2) Instale as dependências do projeto com ``npm install``;
3) Rode o docker compose com ``docker compose up -d ``
4) Rode o servidor de desenvolvimento com ``npm run start:dev``


## Instrução de Uso

A API está documentada através do Swagger através da rota:
localhost:3333/api

## Contribuição

Pull requests são bem-vindos. Para maiores alterações, favor abrir uma issue primeiro para argumentar o que gostaria de implementar no projeto.


## Licença

[MIT](https://choosealicense.com/licenses/mit/)
