const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect, assert } = require('chai');
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

  it('Watch if following aperdomob user', () => {
    agent.get(`${urlBase}/user/following`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        assert.exists(response.body.find(user => user.login === 'aperdomob'));
      });
  });

  it('Checking put idenpotency', () => {
    agent.put(`${urlBase}/user/following/${userTest}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((firstResponse) => {
        agent.put(`${urlBase}/user/following/${userTest}`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((secondResponse) => {
            expect(firstResponse.status).to.equal(secondResponse.status);
            expect(firstResponse.body).to.eql(secondResponse.body);
          });
      });
  });
});

