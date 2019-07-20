'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/topic.test.js', function() {
  let ctx,
    user,
    user2,
    topic,
    topicId2,
    comment,
    reply;
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
    // topic2 = await ctx.service.topic.add(
    //   user2._id,
    //   'dev',
    //   'test title 2',
    //   'test content 2'
    // );
    // assert(topic2.title === 'test title 2');
    // assert(topic2.author.equals(user2._id));

    comment = await ctx.service.comment.add(
      user._id,
      topic._id,
      'test comment 1'
    );
    assert(comment.content === 'test comment 1');

    reply = await ctx.service.reply.add(
      user2._id,
      topic._id,
      comment._id,
      'test reply 1'
    );
    assert(reply.content === 'test reply 1');

    await ctx.service.collect.add(user._id, topic._id);
  });

  it('get /api/topics should ok', async function() {
    const result = await app
      .httpRequest()
      .get('/api/topics')
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(result.body.data.total >= 0);
    assert(result.body.data.data.length >= 0);
  });

  it('get /api/topic/:topicId should ok', async function() {
    const topicId = topic._id;
    const result = await app
      .httpRequest()
      .get(`/api/topic/${topicId}`)
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(topic._id.equals(result.body.data._id));
  });

  it('get /api/topic/:topicId/comments should ok', async function() {
    const topicId = topic._id;
    const commentId = comment._id;
    const result = await app
      .httpRequest()
      .get(`/api/topic/${topicId}/comments`)
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(commentId.equals(result.body.data.data[0]._id));
  });

  it('get /api/topic/:topicId/comment/:commentId/replys should ok', async function() {
    const topicId = topic._id;
    const commentId = comment._id;
    const replyId = reply._id;
    const result = await app
      .httpRequest()
      .get(`/api/topic/${topicId}/comment/${commentId}/replys`)
      .send()
      .expect(200);
    assert(result.body.status === 'success');
    assert(replyId.equals(result.body.data.data[0]._id));
  });

  it('post /api/topic should ok', async function() {
    const tab = 'dev';
    const title = 'test title 2';
    const content = 'test content 2';
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .post('/api/topic')
      .send({ tab, title, content })
      .expect(200);
    assert(result.body.status === 'success');

    topicId2 = result.body.data.topicId;
    const new_topic = await ctx.service.topic.findOne(topicId2);

    assert(new_topic.tab === tab);
    assert(new_topic.title === title);
    assert(new_topic.content === content);
  });
  it('put /api/topic should ok', async function() {
    const topicId = topicId2;
    const tab = 'dev';
    const title = 'test title 2 [put /api/topic]';
    const content = 'test content 2 [put /api/topic]';
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .put('/api/topic')
      .send({ topicId, tab, title, content })
      .expect(200);
    assert(result.body.status === 'success');

    const new_topic = await ctx.service.topic.findOne(topicId);
    assert(new_topic._id.equals(topicId));
    assert(new_topic.title === title);
    assert(new_topic.content === content);
  });
  it('delete /api/topic should ok', async function() {
    const topicId = topicId2;
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .delete('/api/topic')
      .send({ topicId })
      .expect(200);
    assert(result.body.status === 'success');

    const new_topic = await ctx.service.topic.findOne(topicId);

    assert(new_topic === null);
  });
});
