'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/user.test.js', async function() {
  //
  let username,
    email,
    pass,
    userId,
    token;
  before(async function() {
    const ctx = app.mockContext();
    username = `username_${Date.now()}`;
    email = `${username}@test.com`;
    pass = '123456';

    const result = await ctx.service.user.internalCreate(username, pass, email);
    assert(!result.active);
    token = result.accessToken;
    userId = result._id;

    await ctx.service.user.activeUser(userId);

    assert(username === result.username);
  });

  it('findByAccessToken should ok', async function() {
    const ctx = app.mockContext();
    const user = await ctx.service.user.findByAccessToken(token);

    assert(user.username === username);
  });
  it('findByUsername should ok', async function() {
    const ctx = app.mockContext();
    const user = await ctx.service.user.findByUsername(username);

    assert(user.username === username);
  });
  it('findByEmail should ok', async function() {
    const ctx = app.mockContext();
    const user = await ctx.service.user.findByEmail(email);

    assert(user.email === email);
  });
  it('findById should ok', async function() {
    const ctx = app.mockContext();
    let user = await ctx.service.user.findById(userId);
    assert(user.email === email);

    user = await ctx.service.user.findById('5b2ce85857137f22415c4e16');
    assert(user === null);
  });
  it('getUsersByNames should ok', async function() {
    const ctx = app.mockContext();
    let users = await ctx.service.user.getUsersByNames([ username ]);
    assert(users.length === 1);
    assert(users[0].username === username);

    users = await ctx.service.user.getUsersByNames([ '000' ]);
    assert(users.length === 0);
  });
  it('userExists should ok', async function() {
    const ctx = app.mockContext();
    let exists = await ctx.service.user.userExists(username, email);
    assert(exists);

    exists = await ctx.service.user.userExists('username', 'email');
    assert(!exists);
  });
  it('updateProfile should ok', async function() {
    const ctx = app.mockContext();
    const profile = { url: 'www.test.com', location: 'test' };
    await ctx.service.user.updateProfile(userId, profile);

    const user = await ctx.service.user.findById(userId);
    assert(user.url === profile.url);
    assert(user.location === profile.location);
  });
  it('updatePass & checkIn should ok', async function() {
    const ctx = app.mockContext();
    let password = 'asdfgh';

    await ctx.service.user.updatePass(userId, password);

    let result = await ctx.service.user.checkIn(username, password);
    assert(result.username === username);

    password = 'wrongpass';
    result = await ctx.service.user.checkIn(username, password);
    assert(result === undefined);
  });
  it('refreshToken should ok', async function() {
    const ctx = app.mockContext();

    const { accessToken } = await ctx.service.user.refreshToken(userId);
    assert(token !== accessToken);

    const user = await ctx.service.user.findByAccessToken(accessToken);
    assert(user.username === username);
    assert(user.accessToken === accessToken);
  });
  it('block should ok', async function() {
    const ctx = app.mockContext();

    await ctx.service.user.block(userId, true);

    const user = await ctx.service.user.findById(userId);
    assert(user.isBlock);
  });
  it('star should ok', async function() {
    const ctx = app.mockContext();

    await ctx.service.user.star(userId, true);

    const user = await ctx.service.user.findById(userId);
    assert(user.isStar);
  });
});
