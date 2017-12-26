const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const urlBase = 'https://api.github.com';
const userTest = 'aperdomob';

describe('Trying to follow someone through github API', () => {
  it('Following user aperdomob', () => {
    agent.put(`${urlBase}/user/following/${userTest}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
        expect(response.body).to.be.empty;
      });
  });
});

