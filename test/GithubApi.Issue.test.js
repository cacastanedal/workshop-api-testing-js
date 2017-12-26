const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect, assert } = require('chai');

const urlBase = 'https://api.github.com';

describe('Getting user info', () => {
  let user;

  before(() => {
    const userQuery = agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        user = response.body;
      });

    return userQuery;
  });

  it('user has public repositories', () => {
    expect(user.public_repos).to.be.above(0);
  });

  describe('Listing user repositories', () => {
    let repository;

    const repoName = 'workshop-api-testing-js';

    before(() => {
      const repoQuery = agent.get(user.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          repository = response.body.find(repo => repo.name === repoName);
        });

      return repoQuery;
    });

    it(`the repository ${repoName} exist`, () => {
      assert.exists(repository);
    });

    describe('Creating an issue for repo with user', () => {
      let issue;

      const issueTitle = 'Title for issue through api post';
      const paramPost = { title: issueTitle };
      before(() => {
        const issueQuery = agent.post(`${urlBase}/repos/${user.login}/${repoName}/issues`, paramPost)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            issue = response.body;
          });
        return issueQuery;
      });

      it('the issue has title and but no body', () => {
        expect(issue.title).to.equal(issueTitle);
        expect(issue.body).to.be.null;
      });
    });
  });
});
