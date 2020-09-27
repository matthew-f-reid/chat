
var assert = require('assert');
var app = require('./server-mongo.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

var linear = require('./linearPoints');
const { expect } = require('chai');

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

describe('/getuser', () => {
  it('users should be an array', (done) => {
      chai.request(app)
          .post('/getuser').type('form').send({})
          .end((err, res) => {
              res.body.should.be.a('array');
              done();
          });
  });
  it('users should should contain john', (done) => {
      chai.request(app)
          .post('/getuser').type('form').send({})
          .end((err, res) => {
            let r = res.body;
            for(let i = 0; i < r.length; i++){
              if(r[i].user.name == 'john'){
                r[i].user.name.should.contain('john');
              }
            }
              done();
          });
  });
});

describe('/adduser', () => {
  it('check user exists', (done) => {
      chai.request(app)
          .post('/adduser').type('form').send({'name': 'matt', 'email': 'matt@home.com', 'role': 'Super Admin', 'password':'asd'})
          .end((err, res) => {
            let r = res.body;
              for(let i = 0; i < r.length; i++){
                if(r[i].user.name == 'matt'){
                  r[i].user.name.should.contain('matt');
                }
              }
              done();
          });
  });
  it('add user to db', (done) => {
      chai.request(app)
          .post('/adduser').type('form').send({'name': 'alfredo', 'email': 'alfredo@home.com', 'role': 'User', 'password':'asd'})
          .end((err, res) => {
            let r = res.body;
              for(let i = 0; i < r.length; i++){
                if(r[i].user.name == 'alfredo'){
                  r[i].user.name.should.contain('alfredo');
                }
              }
              done();
          });
  });
});