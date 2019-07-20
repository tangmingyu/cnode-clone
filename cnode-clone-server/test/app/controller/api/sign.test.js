'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/sign.test.js', function() {
  const username = `username_${Date.now()}`;
  const email = `${username}@test.com`;
  const password = '123456';
  let ctx,
    user;
  before(async function() {
    ctx = app.mockContext();
  });

  it('post /api/signup should ok', async function() {
    let result = await app
      .httpRequest()
      .post('/api/signup')
      .send({ username, password, email })
      .expect(200);

    assert(result.body.status === 'success');

    user = await ctx.model.User.findOne({ username }).exec();
    assert(user.active === false);

    result = await app
      .httpRequest()
      .post('/api/signup')
      .send({ username, password, email })
      .expect(200);

    assert(result.body.status === 'failed');
    assert(result.body.msg === '用户名或邮箱已被使用。');
  });

  it('get /api/active should ok', async function() {
    let key = 'wrong key';
    let result = await app
      .httpRequest()
      .put('/api/active')
      .send({ name: username, key })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '错误的激活链接!');

    key = user.retrieveKey;

    result = await app
      .httpRequest()
      .put('/api/active')
      .send({ name: username, key })
      .expect(200);
    assert(result.body.status === 'success');
  });

  it('post /api/signin should ok', async function() {
    let result = await app
      .httpRequest()
      .post('/api/signin')
      .send({ username, password: 'wrong password' })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '用户名或密码错误。');

    result = await app
      .httpRequest()
      .post('/api/signin')
      .send({ username, password })
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.data.username === username);
  });

  it('get /api/signinfo should ok', async function() {
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .get('/api/signinfo')
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.data.username === username);
  });

  it('all /api/signout should ok', async function() {
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .post('/api/signout')
      .send()
      .expect(200);
    assert(result.body.status === 'success');
  });

  it('post /api/reset/request should ok', async function() {
    let result = await app
      .httpRequest()
      .post('/api/reset/request')
      .send({ username: 'wrong username', email })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '用户名或邮箱不正确！');

    result = await app
      .httpRequest()
      .post('/api/reset/request')
      .send({ username, email: 'wrong email' })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '用户名或邮箱不正确！');

    result = await app
      .httpRequest()
      .post('/api/reset/request')
      .send({ username, email })
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.msg === '邮件已经发送');
  });

  it('put /api/reset/verify should ok', async function() {
    let result = await app
      .httpRequest()
      .put('/api/reset/verify')
      .send({ username, key: 'wrong key' })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '错误的重置链接!');

    user = await ctx.model.User.findOne({ username }).exec();
    const key = user.retrieveKey;

    result = await app
      .httpRequest()
      .put('/api/reset/verify')
      .send({ username, key })
      .expect(200);
    assert(result.body.status === 'success');
  });

  it('put /api/reset should ok', async function() {
    const new_password = '654321';
    let result = await app
      .httpRequest()
      .put('/api/reset')
      .send({ username, key: 'wrong key', new_password })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '错误的重置链接!');

    user = await ctx.model.User.findOne({ username }).exec();
    const key = user.retrieveKey;

    result = await app
      .httpRequest()
      .put('/api/reset')
      .send({ username, key, new_password })
      .expect(200);
    assert(result.body.status === 'success');

    result = await app
      .httpRequest()
      .post('/api/signin')
      .send({ username, password: new_password })
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.data.username === username);
  });
});
