<h3 align="center">
  <br>
  <img src="https://api.nimble.com.br/consulta-placa/v1/logo.svg" alt="Auth JWT" width="300">
  <br>
  <br>
  <br>
</h3>


# Consulta Placa - Microservices

[![XO code style][xo-img]][xo]

[xo-img]:        https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:            https://github.com/sindresorhus/xo

API de consulta de placa ou chassi

## Endpoint

https://api.nimble.com.br/consulta-placa/v1/graphql


## Assinatura

Todas as chamadas da API precisa de uma assinatura que deverá ser passado via **header** através da chave **x-auth-signature**

A assinatura é gerada a partir dos **dados** e do **segredo** utilizando o método de criptografia **HMAC (keyed-hash message authentication code)** no formato hexadecimal

### Example

O exemplo abaixo mostra a criação de um **hash** via **Node.js**

```javascript
const hash = crypto.createHmac('sha1', 'nosso_segredo').update('query').digest('hex')

// hash = fa3e707b58251aab935c4c53a8b0497c99f6bf04
```

O valor da chave **x-auth-signature** é `algoritimo=hash`

```
sha1=fa3e707b58251aab935c4c53a8b0497c99f6bf04
```


## Schema

```graphQL
type Vehicle {
  placa: String
  chassi: String
  segmento: String
  potencia: String
  capcarga: String
  cilindradas: String
  nrMotor: String
  especieVeiculo: String
  cor: String
  tipo: String
  qtdePassageiros: String
  nacionalidade: String
  municipio: String
  uf: String
  anoFabricacao: String
  anoModelo: String
  marcaModelo: String
  combustivel: String
  descricaoFipe: String
  valorFipe: String
  codigoFipe: String
  historicoFipeAC: String
}

type Query {
  consulta(empresa: Int!, placa: String, chassi: String): Vehicle
}

schema {
  query: Query
}
```

### Usage

#### consulta

Retorna os dados do veículo

##### query
```graphQL
query Consulta($empresa: Int!, $placa: String, $chassi: String) {
  consulta(empresa: $empresa, placa: $placa) {
    marcaModelo
    chassi
    cor
    anoFabricacao
  }
}
```

##### variables
```json
{
  "empresa": 8,
  "placa": "DYG0924"
}
```


## Example

```shell
curl 'https://api.nimble.com.br/consulta-placa/v1/graphql' \
-H 'content-type: application/json' \
-H 'x-auth-signature: sha1=85f30a2395e3c168bb12c3f63c69a55ad7d5188c' \
-d '
{
  "query": "query Consulta($empresa: Int!, $placa: String) { consulta(empresa: $empresa, placa: $placa) { marcaModelo, chassi, cor, anoFabricacao } }",
  "variables": {
    "empresa": 8,
    "placa": "DYG0924"
  },
  "operationName": "Consulta"
}' --compressed
```

##### Response

```json
{
  "data": {
    "consulta": {
      "marcaModelo": "HONDA/CIVIC LXS FLEX",
      "chassi": "93HFA65407Z207613",
      "cor": "Cinza",
      "anoFabricacao": "2007"
    }
  }
}
```


## Team

[<img src="https://avatars.githubusercontent.com/u/130963?s=390" alt="Thiago Lagden" width="100">](http://lagden.in)
[<img src="https://avatars.githubusercontent.com/u/11431536?s=390" alt="Felipe O. Silva" width="100">](https://github.com/thefelpes)


## Copyright

[TEx Tecnologia](https://www.textecnologia.com.br/)
