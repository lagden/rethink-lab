# Chat - RethinkDB

[![XO code style][xo-img]][xo]

[xo-img]:        https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:            https://github.com/sindresorhus/xo

Apenas um show!!

## Listar uma conversa

Como cada usuário tem sua tabela de mensagens com todas as mensagens, é utilizado o campo `room` para
relacionar a conversa.

Abaixo temos o exemplo de uma query para listar uma conversa

```javascript
r
  .db('broker_8')
  .table('messages_lagden')
  .filter({room: 'andrebassi_lagden'})
  .union(
    r
      .db('broker_8')
      .table('messages_andrebassi')
      .filter({room: 'andrebassi_lagden'})
  )
  .orderBy('date').limit(10)
```


## License

MIT © [Thiago Lagden](http://lagden.in)
