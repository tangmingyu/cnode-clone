'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/reply.test.js', async function() {
  let userId,
    userId2,
    topicId,
    commentId,
    replyId,
    reply_content;
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

    const comment_content = 'test comment 1';
    const comment = await ctx.service.comment.add(
      userId,
      topicId,
      comment_content
    );
    assert(comment.content === comment_content);
    commentId = comment._id;

    reply_content = 'test reply 1';
    const reply = await ctx.service.reply.add(
      userId2,
      topicId,
      commentId,
      reply_content
    );
    assert(reply.content === reply_content);
    replyId = reply._id;
  });
  //
  it('findById should ok', async function() {
    const ctx = app.mockContext();
    const reply = await ctx.service.reply.findById(replyId);
    assert(reply._id.equals(replyId));
    assert(reply.content === reply_content);
  });
  it('add should ok', async function() {
    const ctx = app.mockContext();
    const content2 = 'test reply 2';
    const reply2 = await ctx.service.reply.add(
      userId2,
      topicId,
      commentId,
      content2
    );
    assert(reply2.author.equals(userId2));
    assert(reply2.content === content2);

    const [ user, topic ] = await Promise.all([
      ctx.service.user.findById(userId2),
      ctx.service.topic.findOne(topicId),
    ]);
    assert(user.score === 10);
    assert(user.participateCount === 2); // replyx2
    assert(topic.participateCount === 3); // commentx1,replyx2
  });
  it('add with replyId should ok', async function() {
    const ctx = app.mockContext();
    const content3 = 'test reply 3';
    const reply3 = await ctx.service.reply.add(
      userId2,
      topicId,
      commentId,
      content3,
      replyId
    );
    assert(reply3.author.equals(userId2));
    assert(reply3.content === content3);

    const [ user, topic ] = await Promise.all([
      ctx.service.user.findById(userId2),
      ctx.service.topic.findOne(topicId),
    ]);
    assert(user.score === 15);
    assert(user.participateCount === 3); // replyx3
    assert(topic.participateCount === 4); // commentx1,replyx3
  });
  it('update should ok', async function() {
    const ctx = app.mockContext();
    const content = 'test reply 1[update]';
    await ctx.service.reply.update(userId2, replyId, content);

    const reply = await ctx.service.reply.findById(replyId);
    assert(reply._id.equals(replyId));
    assert(reply.content === content);
  });
  it('thumbUp should ok', async function() {
    const ctx = app.mockContext();

    // 1.点赞
    await ctx.service.reply.thumbUp(userId, replyId);
    let reply = await ctx.service.reply.findById(replyId);

    assert(reply._id.equals(replyId));
    assert(reply.thumbUps.length === 1);
    assert(reply.thumbUps[0].equals(userId));
    // 2.取消点赞
    await ctx.service.reply.thumbUp(userId, replyId);
    reply = await ctx.service.reply.findById(replyId);

    assert(reply._id.equals(replyId));
    assert(reply.thumbUps.length === 0);
  });
  it('findReplysByCommentId should ok', async function() {
    const ctx = app.mockContext();

    const { total, data } = await ctx.service.reply.findReplysByCommentId(
      commentId,
      1,
      5
    );

    assert(total > 0);
    assert(data.length > 0 && data.length <= 5);
    assert(data[0].topic.equals(topicId));
    assert(data[0].comment.equals(commentId));
  });
  it('del should ok', async function() {
    const ctx = app.mockContext();

    await ctx.service.reply.del(userId2, topicId, replyId);

    const reply = await ctx.service.reply.findById(replyId);
    assert(reply === null);

    const [ user, topic ] = await Promise.all([
      ctx.service.user.findById(userId2),
      ctx.service.topic.findOne(topicId),
    ]);
    assert(user.score === 10);
    assert(user.participateCount === 2); // replyx2
    assert(topic.participateCount === 3); // commentx1,replyx2
  });
});
