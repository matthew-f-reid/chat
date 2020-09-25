
var assert = require('assert');
var linear = require('./linearPoints');
var addGroup = require('./addgroup');
var addUser = require('./adduser');
var delUser = require('./deluser');
var getUser = require('./getuser');
var updateUser = require('./updateuser');
var getGroup = require('./getgroup');

describe("linear points", ()=>{
  it("should return 6", ()=>{
    assert.equal(linear(2,1,4), 6);
  });
  it("should return 8", ()=>{
    assert.equal(linear(2,2,4), 8);
  });
  it("should return 4", ()=>{
    assert.equal(linear(2,0,4), 4);
  });
});

describe("routes testing", ()=>{
  it("should add user", ()=>{
    assert.equal();
  });
});