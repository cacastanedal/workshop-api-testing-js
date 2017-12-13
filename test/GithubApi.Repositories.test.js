const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com/';
const userName = 'aperdomob';

describe(`Checking out information from user ${userName}`, () => {

  describe('Getting his general information', () => {
    let user;
    let status;

    before(() => {
      const userQuery = agent.get(`${urlBase}/users/${userName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          user = response.body;
          status = response.status; 
        });

      return userQuery;
    });

    it('The user should be loaded', () => {
      expect(status).to.equal(statusCode.OK);
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.company).to.equal('PSL');
      expect(user.location).to.equal('Colombia');
    });

    describe('Getting his repositories', () => {
      let repositories;
      let repository;
      const targetRepository = 'jasmine-awesome-report';

      before(() => {
        const repositiesQuery = agent.get(user.repos_url)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            repositories = response.body;
            repository = repositories
              .find(repository => repository.name === targetRepository);
          });
      })

      it(`The repository ${targetRepository} has this characteristics`, () => {
        expect(repository.private).to.equal(false);
        expect(repository.full_name)
          .to.equal('aperdomob/jasmine-awesome-report');
        expect(repository.description)
          .to.equal("An awesome html report for Jasmine");
      })
    })
  })
})