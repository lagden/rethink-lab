# Chat - RethinkDB

[![XO code style][xo-img]][xo]

[xo-img]:        https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:            https://github.com/sindresorhus/xo

Apenas um show!!

## Estrutura

Cada corretora tem seu banco de dados (`broker_{id}`) e uma tabela (`messages`)

# Listar uma conversa

Todas as mensagens são gravadas na tabela (`messages`), 
e o campo sala (`room`) é utilizado agrupá-las.

Abaixo temos o exemplo de uma query para listar as 10 últimas mensagens de uma sala (`room`)

```javascript
r
  .db('broker_8')
  .table('messages')
  .filter({room: 'ana_lucas'})
  .orderBy('date')
  .limit(10)
```


## License

MIT © [Thiago Lagden](http://lagden.in)
