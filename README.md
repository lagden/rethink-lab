# Chat - RethinkDB

[![XO code style][xo-img]][xo]

[xo-img]:        https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:            https://github.com/sindresorhus/xo

Apenas um show!!


## Listar uma conversa

Todas as mensagens são gravadas na tabela `messages` dentro de um banco de dado `broker_{id}`,
e é utilizado o campo `room` para para agrupar elas.

Abaixo temos o exemplo de uma query para listar as 10 últimas mensagens de uma sala `room`

```javascript
r
  .db('broker_8')
  .table('messages')
  .filter({room: 'xxx_zzz'})
  .orderBy('date')
  .limit(10)
```


## License

MIT © [Thiago Lagden](http://lagden.in)
