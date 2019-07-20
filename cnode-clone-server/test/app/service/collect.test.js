'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/collect.test.js', () => {
  let userId,
    topicId;
  before(async function() {
    const ctx = app.mockContext();
    const username = `username_${Date.now()}`;
    const email = `${username}@test.com`;
    const pass = '123456';

    const result = await ctx.service.user.internalCreate(username, pass, email);
    assert(!result.active);
    assert(username === result.username);
    userId = result._id;

    await ctx.service.user.activeUser(userId);

    const tab = 'share';
    const title = '[collect] test title';
    const content = '[collect] test content';
    const topic = await ctx.service.topic.add(userId, tab, title, content);
    assert(topic.title === title);
    topicId = topic._id;
  });
  it('add should ok', async function() {
    const ctx = app.mockContext();
    await ctx.service.collect.add(userId, topicId);

    const [ user, topic, collected ] = await Promise.all([
      ctx.service.user.findById(userId),
      ctx.service.topic.findOne(topicId),
      ctx.service.collect.findOne(userId, topicId),
    ]);
    assert(collected !== null);

    assert(user.collectCount === 1);
    assert(topic.collectCount === 1);
  });
  it('del should ok', async function() {
    const ctx = app.mockContext();
    await ctx.service.collect.del(userId, topicId);

    const [ user, topic, collected ] = await Promise.all([
      ctx.service.user.findById(userId),
      ctx.service.topic.findOne(topicId),
      ctx.service.collect.findOne(userId, topicId),
    ]);
    assert(collected === null);

    assert(user.collectCount === 0);
    assert(topic.collectCount === 0);
  });
  it('findOne should ok', async function() {
    const ctx = app.mockContext();
    const tab = 'share';
    const title = '[collect] test title';
    const content = '[collect] test content';
    const topic = await ctx.service.topic.add(userId, tab, title, content);
    topicId = topic._id;

    await ctx.service.collect.add(userId, topic._id);
    const collected = await ctx.service.collect.findOne(userId, topic._id);

    assert(collected.user.equals(userId));
    assert(collected.topic.equals(topic._id));
  });
  it('findCollectTopics should ok', async function() {
    const ctx = app.mockContext();

    const { total, data } = await ctx.service.topic.findCollectTopics(
      userId,
      1,
      5
    );

    assert(total >= 1);
    assert(data.length <= 5);
    assert(data[0]._id.equals(topicId));
  });
});
