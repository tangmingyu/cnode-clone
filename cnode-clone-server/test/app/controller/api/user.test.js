'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/user.test.js', function() {
  let ctx,
    username,
    username2,
    user,
    user2,
    topic;

  before(async function() {
    ctx = app.mockContext();

    username = `username_${Date.now()}`;
    const email = `${username}@test.com`;
    user = await ctx.service.user.internalCreate(username, '123456', email);
    assert(!user.active);
    assert(username === user.username);

    username2 = `username2_${Date.now()}`;
    const email2 = `${username2}@test.com`;
    user2 = await ctx.service.user.internalCreate(username2, '123456', email2);
    assert(!user2.active);
    assert(username2 === user2.username);
    await Promise.all([
      ctx.service.user.activeUser(user._id),
      ctx.service.user.activeUser(user2._id),
    ]);

    topic = await ctx.service.topic.add(
      user2._id,
      'share',
      'test title',
      'test content'
    );
    assert(topic.title === 'test title');
    assert(topic.author.equals(user2._id));

    const comment = await ctx.service.comment.add(
      user._id,
      topic._id,
      'test comment 1'
    );
    assert(comment.content === 'test comment 1');

    await ctx.service.collect.add(user._id, topic._id);
  });
  it('get /api/user/:username should ok', async function() {
    let result = await app
      .httpRequest()
      .get('/api/user/not-exists')
      .send()
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '该用户不存在');

    result = await app
      .httpRequest()
      .get(`/api/user/${username}`)
      .send()
      .expect(200);
    assert(result.body.status === 'success');
  });

  it('get /api/user/:username/topics should ok', async function() {
    const result = await app
      .httpRequest()
      .get(`/api/user/${username2}/topics`)
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.data.total === 1);
    assert(topic._id.equals(result.body.data.data[0]._id));
  });
  it('get /api/user/:username/participates should ok', async function() {
    const result = await app
      .httpRequest()
      .get(`/api/user/${username}/participates`)
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.data.total === 1);
    assert(topic._id.equals(result.body.data.data[0]._id));
  });
  it('get /api/user/:username/collects should ok', async function() {
    const result = await app
      .httpRequest()
      .get(`/api/user/${username}/collects`)
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.data.total === 1);
    assert(topic._id.equals(result.body.data.data[0]._id));
  });
  it('put /api/user should ok', async function() {
    const url = 'test.com';
    const weibo = 'weibo.com/test';
    let result = await app
      .httpRequest()
      .put('/api/user')
      .send({
        url,
        weibo,
      })
      .expect(401);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '请先登录！');
    app.mockContext({ user });
    result = await app
      .httpRequest()
      .put('/api/user')
      .send({
        url,
        weibo,
      })
      .expect(200);
    assert(result.body.status === 'success');

    const userinfo = await ctx.service.user.findByUsername(username);
    assert(userinfo.url === url);
    assert(userinfo.weibo === weibo);
  });
  it('put /api/user/pass should ok', async function() {
    app.mockContext({ user });
    let result = await app
      .httpRequest()
      .put('/api/user/pass')
      .send({
        old_password: 'wrongpass',
        new_password: '654321',
      })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '当前密码不正确。');
    result = await app
      .httpRequest()
      .put('/api/user/pass')
      .send({
        old_password: '123456',
        new_password: '654321',
      })
      .expect(200);
    assert(result.body.status === 'success');
  });
  it('put /api/user/token/refresh should ok', async function() {
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .put('/api/user/token/refresh')
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.data.accessToken !== user.accessToken);
  });
});
