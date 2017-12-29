const responseTime = require('superagent-response-time');

const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const urlBase = 'https://api.github.com';

describe('Getting all users from github api', () => {
  let queryTime;
  let statusRequest;

  before(() => {
    const usersQuery = agent
      .get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .use(responseTime((request, time) => {
        queryTime = time;
        statusRequest = request.res.statusCode;
      }));

    return usersQuery;
  });

  it('response time should be below 5 secs', () => {
    expect(statusRequest).to.be.equal(statusCode.OK);
    expect(queryTime).to.be.below(5000);
  });

  describe('Get just 10 users', () => {
    it('github answer should have 10 objects', () => {
      agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query({ per_page: 10 })
        .then((response) => {
          expect(response.body.length).to.equal(10);
        });
    });
  });

  describe('Get just 50 users', () => {
    it('github answer should have 50 objects', () => {
      agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query({ per_page: 50 })
        .then((response) => {
          expect(response.body.length).to.equal(50);
        });
    });
  });
});

