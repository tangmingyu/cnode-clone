'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/message.test.js', async function() {
  let userId1,
    userId2,
    topicId,
    topic_content,
    messageId;
  before(async function() {
    const ctx = app.mockContext();
    // sender
    const username1 = `username1_${Date.now()}`;
    const email1 = `${username1}@test.com`;
    const pass1 = '123456';
    // receiver
    const username2 = `username2_${Date.now()}`;
    const email2 = `${username2}@test.com`;
    const pass2 = '123456';

    const [ user1, user2 ] = await Promise.all([
      ctx.service.user.internalCreate(username1, pass1, email1),
      ctx.service.user.internalCreate(username2, pass2, email2),
    ]);
    userId1 = user1._id;
    userId2 = user2._id;
    assert(user1.username === username1);
    assert(user2.username === username2);
    //
    await Promise.all([
      ctx.service.user.activeUser(userId1),
      ctx.service.user.activeUser(userId2),
    ]);
    topic_content = `test topic @${username1} @${username2}`;
    const topic = await ctx.service.topic.add(
      userId1,
      'share',
      'test',
      topic_content
    );
    topicId = topic._id;
    assert(topic.content === topic_content);
  });
  it('sendAtMessage should ok', async function() {
    const ctx = app.mockContext();
    const messages = await ctx.service.message.sendAtMessage(
      userId1,
      topic_content,
      { topicId }
    );

    assert(messages.length === 1);
    assert(messages[0].sender.equals(userId1));
    assert(messages[0].receiver.equals(userId2));
  });
  it('sendMessage should ok', async function() {
    const ctx = app.mockContext();
    const comment = await ctx.service.comment.add(
      userId2,
      topicId,
      'very good'
    );
    const commentId = comment._id;
    const type = 'comment';
    const msg = await ctx.service.message.sendMessage(userId2, userId1, {
      type,
      topicId,
      commentId,
    });
    messageId = msg._id;
    assert(msg !== null);
    assert(msg.sender.equals(userId2));
    assert(msg.receiver.equals(userId1));
  });
  it('unreadCount should ok', async function() {
    const ctx = app.mockContext();

    const [ count1, count2 ] = await Promise.all([
      ctx.service.message.unreadCount(userId1),
      ctx.service.message.unreadCount(userId2),
    ]);

    assert(count1 === 1);
    assert(count2 === 1);
  });
  it('findByType should ok', async function() {
    const ctx = app.mockContext();
    const { data: msg1 } = await ctx.service.message.findByType(
      userId1,
      'comment',
      1,
      5
    );
    assert(msg1.length === 1);
    assert(msg1[0].type === 'comment');
    assert(msg1[0].sender.equals(userId2));
    assert(msg1[0].receiver.equals(userId1));
    assert(msg1[0].hasRead === false);

    const { data: msg2 } = await ctx.service.message.findByType(
      userId2,
      'at',
      1,
      5
    );
    assert(msg2.length === 1);
    assert(msg2[0].type === 'at');
    assert(msg2[0].sender.equals(userId1));
    assert(msg2[0].receiver.equals(userId2));
    assert(msg2[0].hasRead === false);
  });
  it('markOneReaded should ok', async function() {
    const ctx = app.mockContext();

    await ctx.service.message.markOneReaded(userId1, messageId);

    const { data: msg1 } = await ctx.service.message.findByType(
      userId1,
      'comment',
      1,
      5
    );
    assert(msg1.length === 1);
    assert(msg1[0].type === 'comment');
    assert(msg1[0].sender.equals(userId2));
    assert(msg1[0].receiver.equals(userId1));
    assert(msg1[0].hasRead === true);
  });
  it('markAllReaded should ok', async function() {
    const ctx = app.mockContext();

    await ctx.service.message.markAllReaded(userId2);

    const { data: msg1 } = await ctx.service.message.findByType(
      userId2,
      'at',
      1,
      5
    );
    assert(msg1.length === 1);
    assert(msg1[0].type === 'at');
    assert(msg1[0].sender.equals(userId1));
    assert(msg1[0].receiver.equals(userId2));
    assert(msg1[0].hasRead === true);
  });
  it('delete should ok', async function() {
    const ctx = app.mockContext();

    await ctx.service.message.delete(userId1, messageId);

    const { total, data } = await ctx.service.message.findByType(
      userId1,
      'comment',
      1,
      5
    );

    assert(total === 0);
    assert(data.length === 0);
  });
});
