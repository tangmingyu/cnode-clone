'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/message.test.js', function() {
  let ctx,
    user,
    user2,
    messageId,
    messageId2;
  before(async function() {
    ctx = app.mockContext();

    const username1 = `username1_${Date.now()}`;
    const email1 = `${username1}@test.com`;
    const pass1 = '123456';

    const username2 = `username2_${Date.now()}`;
    const email2 = `${username2}@test.com`;
    const pass2 = '123456';

    user = await ctx.service.user.internalCreate(username1, pass1, email1);
    user2 = await ctx.service.user.internalCreate(username2, pass2, email2);

    await Promise.all([
      ctx.service.user.activeUser(user._id),
      ctx.service.user.activeUser(user2._id),
    ]);

    const topic_content = `test topic @${username1} @${username2}`;
    const topic = await ctx.service.topic.add(
      user2._id,
      'share',
      'test message 1',
      topic_content
    );
    await ctx.service.message.sendAtMessage(user2._id, topic_content, {
      topicId: topic._id,
    });
    assert(topic.content === topic_content);

    const topic2 = await ctx.service.topic.add(
      user2._id,
      'dev',
      'test message 2',
      topic_content
    );
    await ctx.service.message.sendAtMessage(user2._id, topic_content, {
      topicId: topic2._id,
    });
    assert(topic2.content === topic_content);
  });

  it('get /api/messages/:type', async function() {
    app.mockContext({ user });
    let type = 'at';
    let result = await app
      .httpRequest()
      .get(`/api/messages/${type}`)
      .send()
      .expect(200);

    messageId = result.body.data.data[0]._id;
    messageId2 = result.body.data.data[1]._id;
    assert(result.body.status === 'success');
    assert(result.body.data.total === 2);

    type = 'comment';
    result = await app
      .httpRequest()
      .get(`/api/messages/${type}`)
      .send()
      .expect(200);

    assert(result.body.status === 'success');
    assert(result.body.data.total === 0);
  });

  it('get /api/message/check', async function() {
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .get('/api/message/check')
      .send()
      .expect(200);

    assert(result.body.status === 'success');
    assert(result.body.data.count === 2);
  });

  it('put /api/message/mark', async function() {
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .put('/api/message/mark')
      .send({ messageId })
      .expect(200);

    assert(result.body.status === 'success');

    const message = await ctx.model.Message.findById(messageId);
    assert(message.hasRead);
  });

  it('put /api/message/markall', async function() {
    let message1 = await ctx.model.Message.findById(messageId);
    let message2 = await ctx.model.Message.findById(messageId2);

    assert(message1.hasRead);
    assert(message2.hasRead === false);

    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .put('/api/message/markall')
      .send()
      .expect(200);

    assert(result.body.status === 'success');

    message1 = await ctx.model.Message.findById(messageId);
    message2 = await ctx.model.Message.findById(messageId2);

    assert(message1.hasRead);
    assert(message2.hasRead);
  });

  it('delete /api/message', async function() {
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .delete('/api/message')
      .send({ messageId })
      .expect(200);

    assert(result.body.status === 'success');

    const message = await ctx.model.Message.findById(messageId);
    assert(message === null);
  });
});
