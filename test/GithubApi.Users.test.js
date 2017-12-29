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

  [10, 50].forEach((number) => {
    describe(`Get just ${number} users`, () => {
      it(`github answer should have ${number} objects`, () => {
        agent
          .get(`${urlBase}/users`)
          .auth('token', process.env.ACCESS_TOKEN)
          .query({ per_page: number })
          .then((response) => {
            expect(response.body.length).to.equal(number);
          });
      });
    });
  });
});

