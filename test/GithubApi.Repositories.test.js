const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect, assert } = require('chai');
const md5 = require('md5');

const chaiSubset = require('chai-subset');
const chai = require('chai');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';

describe('Get request to github API with the user aperdomob', () => {
  let user;

  before(() => {
    const userQuery = agent.get(`${urlBase}/users/aperdomob`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        user = response.body;
      });

    return userQuery;
  });

  it('the user is fetched', () => {
    expect(user.name).to.equal('Alejandro Perdomo');
    expect(user.company).to.equal('PSL');
    expect(user.location).to.equal('Colombia');
  });

  const repositoryName = 'jasmine-awesome-report';

  describe(`Looking for repo ${repositoryName}`, () => {
    let repository;

    before(() => {
      const repoQuery = agent.get(user.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          repository = response.body.find(repo => repo.name === repositoryName);
        });

      return repoQuery;
    });

    it('the repository is fetched', () => {
      expect(repository.full_name).to.equal('aperdomob/jasmine-awesome-report');
      expect(repository.private).to.equal(false);
      expect(repository.description).to.equal('An awesome html report for Jasmine');
    });

    describe('Downloading repository in zip file', () => {
      let zipRepository;
      const randomMd5Hash = 'adcdbd79a8d84175c229b192aadc02f2';

      before(() => {
        const downloadRepoQuery = agent
          .get(`${repository.svn_url}/archive/${repository.default_branch}.zip`)
          .auth('token', process.env.ACCESS_TOKEN)
          .buffer(true)
          .then((response) => {
            zipRepository = response.text;
          });

        return downloadRepoQuery;
      });

      it('the repo should be downloaded', () => {
        assert.exists(zipRepository);
        expect(md5(zipRepository)).to.not.equal(randomMd5Hash);
      });
    });

    describe('Getting file list of repository', () => {
      let fileReadme;

      const fileName = 'README.md';
      const filePath = 'README.md';
      const fileSha = '9bcf2527fd5cd12ce18e457581319a349f9a56f3';

      before(() => {
        const fileQuery = agent.get(`${repository.url}/contents`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            fileReadme = response.body.find(file => file.name === fileName);
          });

        return fileQuery;
      });

      it((`looking for file ${fileName}`), () => {
        assert.exists(fileReadme);
        expect(fileReadme).containSubset({
          name: fileName,
          path: filePath,
          sha: fileSha
        });
      });

      describe(`Donwloading file ${fileName} in zip format`, () => {
        const expectedMd5 = '8a406064ca4738447ec522e639f828bf';
        let zipFile;

        before(() => {
          const downloadFileQuery = agent.get(fileReadme.download_url)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              zipFile = response.text;
            });

          return downloadFileQuery;
        });

        it('checking zip from file', () => {
          expect(md5(zipFile)).to.equal(expectedMd5);
        });
      });
    });
  });
});

