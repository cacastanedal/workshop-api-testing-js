const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

describe('Trying to get url with Head request', () => {
  let headRequestStatus;
  let redirectionUrl;

  const redirectUrl = 'https://github.com/aperdomob/redirect-test';
  const newURL = 'https://github.com/aperdomob/new-redirect-test';

  before(() => {
    const urlQuery = agent.head(redirectUrl)
      .auth('token', process.env.ACCESS_TOKEN)
      .catch((error) => {
        headRequestStatus = error.status;
        redirectionUrl = error.response.headers.location;
      });
    return urlQuery;
  });

  it('expecting we get redirect', () => {
    expect(headRequestStatus).to.equal(statusCode.MOVED_PERMANENTLY);
    expect(redirectionUrl).to.equal(newURL);
  });

  describe('Going to the redirect url', () => {
    it('should get the redirected', () => {
      agent.get(redirectUrl)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.redirects.length).to.be.above(0);
        });
    });
  });
});
