Sistema de Controle Financeiro SOP

Este projeto é um sistema de controle financeiro para a SOP (Superintendência de Obras Públicas) que gerencia três principais entidades empresariais: Despesas, Compromissos e Pagamentos.

Estrutura do Projeto
O projeto é dividido em dois componentes principais:   

frontend: aplicativo Next.js com Redux para gerenciamento de estado
backend: aplicativo SpringBoot com JPA para acesso ao banco de dados
Entidades de Negócio

Despesa
Número do protocolo (único)
Tipo de despesa
Data do protocolo
Data de vencimento
Credor da despesa
Descrição da despesa
Valor da despesa
Status (opcional)
Compromisso
Número do compromisso (único)
Data do compromisso
Valor do compromisso
Observação
Associado a uma despesa
Pagamento
Número do pagamento (único)
Data do pagamento
Valor do pagamento
Observação
Associado a um compromisso
Regras de Negócio

A soma dos valores de compromisso para uma despesa não deve exceder o valor da despesa
A soma dos valores de pagamento para um compromisso não deve exceder o valor do compromisso
A exclusão de um compromisso com pagamentos associados não é permitida
A exclusão de uma despesa com compromissos associados não é permitida
Informações Técnicas Stack
Frontend
Next.js
Redux
Axios
Backend
SpringBoot
JPA
DTOs
Banco de Dados
PostgreSQL
Instruções de Configuração
Consulte os arquivos README nos diretórios frontend e backend para obter instruções específicas de configuração.
