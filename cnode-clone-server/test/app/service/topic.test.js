'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/topic.test.js', async function() {
  let username,
    email,
    pass,
    userId,
    tab,
    topicId;
  before(async function() {
    const ctx = app.mockContext();
    username = `username_${Date.now()}`;
    email = `${username}@test.com`;
    pass = '123456';

    const result = await ctx.service.user.internalCreate(username, pass, email);
    assert(!result.active);
    userId = result._id;

    await ctx.service.user.activeUser(userId);

    assert(username === result.username);
  });

  it('add should ok', async function() {
    const ctx = app.mockContext();
    tab = 'share';
    const title = 'test title';
    const content = 'test content';

    const topic = await ctx.service.topic.add(userId, tab, title, content);
    topicId = topic._id;
    assert(topic !== null);
    assert(topic.tab === tab);
    assert(topic.title === title);
    assert(topic.content === content);

    const user = await ctx.service.user.findById(userId);
    assert(user.score === 5);
    assert(user.topicCount === 1);
  });

  it('update & findOne should ok', async function() {
    const ctx = app.mockContext();
    tab = 'ask';
    const title = '[ask]test title';
    const content = '[ask]test content';
    await ctx.service.topic.update(userId, topicId, tab, title, content);

    const topic = await ctx.service.topic.findOne(topicId);
    assert(topic !== null);
    assert(topic.tab === tab);
    assert(topic.title === title);
    assert(topic.content === content);
  });
  it('incVisitCount should ok', async function() {
    const ctx = app.mockContext();

    await Promise.all([
      ctx.service.topic.incVisitCount(topicId),
      ctx.service.topic.incVisitCount(topicId),
      ctx.service.topic.incVisitCount(topicId),
    ]);

    const topic = await ctx.service.topic.findOne(topicId);
    assert(topic !== null);
    assert(topic.visitCount === 3);
  });
  it('lock should ok', async function() {
    const ctx = app.mockContext();
    const lock = true;
    await ctx.service.topic.lock(topicId, lock);
    const topic = await ctx.service.topic.findOne(topicId);
    assert(topic !== null);
    assert(topic.lock === lock);
  });
  it('top should ok', async function() {
    const ctx = app.mockContext();
    const top = true;
    await ctx.service.topic.top(topicId, top);
    const topic = await ctx.service.topic.findOne(topicId);
    assert(topic !== null);
    assert(topic.top === top);
  });
  it('good should ok', async function() {
    const ctx = app.mockContext();
    const good = true;
    await ctx.service.topic.good(topicId, good);
    const topic = await ctx.service.topic.findOne(topicId);
    assert(topic !== null);
    assert(topic.good === good);
  });
  it('del should ok', async function() {
    const ctx = app.mockContext();
    tab = 'share';
    const title = 'delete test title';
    const content = 'delete test content';
    let topic = await ctx.service.topic.add(userId, tab, title, content);
    assert(topic !== null);
    assert(topic.tab === tab);
    assert(topic.title === title);
    assert(topic.content === content);

    let user = await ctx.service.user.findById(userId);
    assert(user.score === 10);
    assert(user.topicCount === 2);

    await ctx.service.topic.del(userId, topic._id);

    topic = await ctx.service.topic.findOne(topic._id);
    assert(topic === null);

    user = await ctx.service.user.findById(userId);
    assert(user.score === 5);
    assert(user.topicCount === 1);
  });
  it('findTopicsByTab should ok', async function() {
    const ctx = app.mockContext();
    const { total, data } = await ctx.service.topic.findTopicsByTab(
      'ask',
      1,
      5
    );

    assert(total !== 0);
    assert(data.length <= 5);
    assert(data[0].tab === 'ask');
  });
  it('findUserTopics should ok', async function() {
    const ctx = app.mockContext();
    const { total, data } = await ctx.service.topic.findUserTopics(
      userId,
      1,
      5
    );

    assert(total >= 1);
    assert(data.length <= 5);
    assert(data[0].author.equals(userId));
  });
});
