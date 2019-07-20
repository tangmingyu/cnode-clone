'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/collect.test.js', function() {
  let ctx,
    user,
    user2,
    topic,
    topic2;

  before(async function() {
    ctx = app.mockContext();

    const username = `username_${Date.now()}`;
    const email = `${username}@test.com`;
    user = await ctx.service.user.internalCreate(username, '123456', email);
    assert(!user.active);
    assert(username === user.username);

    const username2 = `username2_${Date.now()}`;
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
      'dev',
      'test title 1',
      'test content 1'
    );
    assert(topic.title === 'test title 1');
    assert(topic.author.equals(user2._id));
    topic2 = await ctx.service.topic.add(
      user2._id,
      'dev',
      'test title 2',
      'test content 2'
    );
    assert(topic2.title === 'test title 2');
    assert(topic2.author.equals(user2._id));

    await ctx.service.collect.add(user._id, topic._id);
  });
  it('post /api/collect should ok', async function() {
    const topicId = topic2._id;
    let result = await app
      .httpRequest()
      .post('/api/collect')
      .send({ topicId })
      .expect(401);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '请先登录！');

    app.mockContext({ user });
    result = await app
      .httpRequest()
      .post('/api/collect')
      .send({ topicId })
      .expect(200);
    console.log(topicId);
    assert(result.body.status === 'success');

    const collected = await ctx.service.collect.findOne(user._id, topicId);

    assert(collected !== null);
    assert(topicId.equals(collected.topic));
  });

  it('delete /api/collect should ok', async function() {
    const topicId = topic._id;
    let result = await app
      .httpRequest()
      .delete('/api/collect')
      .send({ topicId })
      .expect(401);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '请先登录！');

    app.mockContext({ user });
    result = await app
      .httpRequest()
      .delete('/api/collect')
      .send({ topicId })
      .expect(200);
    assert(result.body.status === 'success');

    const collected = await ctx.service.collect.findOne(user._id, topicId);
    assert(collected === null);
  });
});
