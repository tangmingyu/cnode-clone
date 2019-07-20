'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/comment.test.js', function() {
  let ctx,
    user,
    user2,
    topic,
    commentId;
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
  });

  it('post /api/comment should ok', async function() {
    const userId = user._id;
    const topicId = topic._id;
    const content = 'test comment content [post /api/comment]';
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .post('/api/comment')
      .send({ topicId, content })
      .expect(200);
    assert(result.body.status === 'success');

    commentId = result.body.data.commentId;
    const comment = await ctx.service.comment.findById(commentId);

    assert(comment !== null);
    assert(comment.author.equals(userId));
    assert(comment.topic.equals(topicId));
    assert(comment.content === content);
  });

  it('put /api/comment should ok', async function() {
    const userId = user._id;
    const topicId = topic._id;
    const content = 'test comment content [put /api/comment]';
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .put('/api/comment')
      .send({ topicId, commentId, content })
      .expect(200);
    assert(result.body.status === 'success');

    const comment = await ctx.service.comment.findById(commentId);

    assert(comment !== null);
    assert(comment._id.equals(commentId));
    assert(comment.author.equals(userId));
    assert(comment.topic.equals(topicId));
    assert(comment.content === content);
  });
  it('put /api/comment/up should ok', async function() {
    const topicId = topic._id;
    app.mockContext({ user });
    let result = await app
      .httpRequest()
      .put('/api/comment/up')
      .send({ topicId, commentId })
      .expect(200);
    assert(result.body.status === 'failed');
    assert(result.body.msg === '不能给自己点赞');

    app.mockContext({ user: user2 });
    // 点赞
    result = await app
      .httpRequest()
      .put('/api/comment/up')
      .send({ topicId, commentId })
      .expect(200);
    assert(result.body.status === 'success');

    let comment = await ctx.service.comment.findById(commentId);

    assert(comment !== null);
    assert(comment._id.equals(commentId));
    assert(comment.thumbUps[0].equals(user2._id));

    app.mockContext({ user: user2 });
    // 取消点赞
    result = await app
      .httpRequest()
      .put('/api/comment/up')
      .send({ topicId, commentId })
      .expect(200);
    assert(result.body.status === 'success');

    comment = await ctx.service.comment.findById(commentId);

    assert(comment !== null);
    assert(comment._id.equals(commentId));
    assert(comment.thumbUps.length === 0);
  });
  it('delete /api/comment should ok', async function() {
    const topicId = topic._id;
    app.mockContext({ user });
    const result = await app
      .httpRequest()
      .delete('/api/comment')
      .send({ topicId, commentId })
      .expect(200);
    assert(result.body.status === 'success');

    const comment = await ctx.service.comment.findById(commentId);
    assert(comment === null);
  });
});
