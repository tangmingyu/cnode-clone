'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/reply.test.js', function() {
  let ctx,
    user,
    user2,
    topic,
    commentId,
    replyId;
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

    const comment = await ctx.service.comment.add(
      user._id,
      topic._id,
      'test comment 1'
    );
    commentId = comment._id;
    assert(comment.content === 'test comment 1');
  });

  it('post /api/reply should ok', async function() {
    const userId = user._id;
    const topicId = topic._id;
    const content = 'test reply content [post /api/reply]';
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .post('/api/reply')
      .send({ topicId, commentId, content })
      .expect(200);
    assert(result.body.status === 'success');

    replyId = result.body.data.replyId;
    const reply = await ctx.service.reply.findById(replyId);

    assert(reply !== null);
    assert(reply.author.equals(userId));
    assert(reply.topic.equals(topicId));
    assert(reply.content === content);
  });

  it('put /api/reply should ok', async function() {
    const userId = user._id;
    const topicId = topic._id;
    const content = 'test reply content [put /api/reply]';
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .put('/api/reply')
      .send({ topicId, commentId, replyId, content })
      .expect(200);
    assert(result.body.status === 'success');

    const reply = await ctx.service.reply.findById(replyId);

    assert(reply !== null);
    assert(reply._id.equals(replyId));
    assert(reply.author.equals(userId));
    assert(reply.topic.equals(topicId));
    assert(reply.content === content);
  });

  it('put /api/reply/up should ok', async function() {
    const topicId = topic._id;
    app.mockContext({ user });
    let result = await app
      .httpRequest()
      .put('/api/reply/up')
      .send({ topicId, replyId })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '不能给自己点赞');

    app.mockContext({ user: user2 });
    // 点赞
    result = await app
      .httpRequest()
      .put('/api/reply/up')
      .send({ topicId, replyId })
      .expect(200);
    assert(result.body.status === 'success');

    let reply = await ctx.service.reply.findById(replyId);

    assert(reply !== null);
    assert(reply._id.equals(replyId));
    assert(reply.thumbUps[0].equals(user2._id));

    app.mockContext({ user: user2 });
    // 取消点赞
    result = await app
      .httpRequest()
      .put('/api/reply/up')
      .send({ topicId, replyId })
      .expect(200);
    assert(result.body.status === 'success');

    reply = await ctx.service.reply.findById(replyId);

    assert(reply !== null);
    assert(reply._id.equals(replyId));
    assert(reply.thumbUps.length === 0);
  });

  it('delete /api/reply should ok', async function() {
    const topicId = topic._id;
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .delete('/api/reply')
      .send({ topicId, replyId })
      .expect(200);
    assert(result.body.status === 'success');

    const reply = await ctx.service.reply.findById(replyId);
    assert(reply === null);
  });
});
