'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/comment.test.js', async function() {
  let userId,
    userId2,
    topicId,
    commentId,
    comment_content;
  before(async function() {
    const ctx = app.mockContext();

    const username = `username_${Date.now()}`;
    const email = `${username}@test.com`;
    const pass = '123456';
    const user1 = await ctx.service.user.internalCreate(username, pass, email);
    assert(!user1.active);
    assert(username === user1.username);
    userId = user1._id;
    await ctx.service.user.activeUser(userId);

    const username2 = `username2_${Date.now()}`;
    const email2 = `${username2}@test.com`;
    const pass2 = '123456';
    const user2 = await ctx.service.user.internalCreate(
      username2,
      pass2,
      email2
    );
    assert(!user2.active);
    assert(username2 === user2.username);
    userId2 = user2._id;
    await ctx.service.user.activeUser(user2);

    const tab = 'share';
    const title = 'test title';
    const content = 'test content';
    const topic = await ctx.service.topic.add(userId, tab, title, content);
    assert(topic.title === title);
    assert(topic.author.equals(userId));
    topicId = topic._id;

    comment_content = 'test comment 1';
    const comment = await ctx.service.comment.add(
      userId2,
      topicId,
      comment_content
    );
    assert(comment.content === comment_content);
    commentId = comment._id;
  });
  //
  it('findById should ok', async function() {
    const ctx = app.mockContext();

    const comment = await ctx.service.comment.findById(commentId);
    assert(comment._id.equals(commentId));
    assert(comment.content === comment_content);
  });
  it('add should ok', async function() {
    const ctx = app.mockContext();
    const content = 'test comment 2';
    const comment = await ctx.service.comment.add(userId2, topicId, content);
    assert(comment.author.equals(userId2));
    assert(comment.content === content);

    const [ user, topic ] = await Promise.all([
      ctx.service.user.findById(userId2),
      ctx.service.topic.findOne(topicId),
    ]);
    assert(user.score === 10);
    assert(user.participateCount === 2);
    assert(topic.participateCount === 2);
  });
  it('update should ok', async function() {
    const ctx = app.mockContext();
    const content = 'test comment 1 [update]';
    await ctx.service.comment.update(userId2, commentId, content);

    const comment = await ctx.service.comment.findById(commentId);

    assert(comment._id.equals(commentId));
    assert(comment.author.equals(userId2));
    assert(comment.content !== comment_content);
    assert(comment.content === content);
  });
  it('thumbUp should ok', async function() {
    const ctx = app.mockContext();

    // 1.点赞
    await ctx.service.comment.thumbUp(userId, commentId);
    let comment = await ctx.service.comment.findById(commentId);

    assert(comment._id.equals(commentId));
    assert(comment.thumbUps.length === 1);
    assert(comment.thumbUps[0].equals(userId));
    // 2.取消点赞
    await ctx.service.comment.thumbUp(userId, commentId);
    comment = await ctx.service.comment.findById(commentId);

    assert(comment._id.equals(commentId));
    assert(comment.thumbUps.length === 0);
  });
  it('findCommentsByTopicId should ok', async function() {
    const ctx = app.mockContext();

    const { total, data } = await ctx.service.comment.findCommentsByTopicId(
      topicId,
      1,
      5
    );

    assert(total > 0);
    assert(data.length > 0 && data.length <= 5);
    assert(data[0].topic.equals(topicId));
  });
  it('del should ok', async function() {
    const ctx = app.mockContext();

    await ctx.service.comment.del(userId2, topicId, commentId);

    const comment = await ctx.service.comment.findById(commentId);
    assert(comment === null);

    const [ user, topic ] = await Promise.all([
      ctx.service.user.findById(userId2),
      ctx.service.topic.findOne(topicId),
    ]);
    assert(user.score === 5);
    assert(user.participateCount === 1);
    assert(topic.participateCount === 1);
  });
});
