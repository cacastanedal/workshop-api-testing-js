const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const chaiSubset = require('chai-subset');
const chai = require('chai');

const urlBase = 'https://api.github.com';

chai.use(chaiSubset);

describe('Creating a gist', () => {
  let gist;
  let responseStatus;

  const gistDescription = 'This is a description example for a gists';
  const isPublic = true;
  const gistfiles = {
    'file1.txt': {
      content: 'String file contents'
    }
  };

  const postParams = {
    description: gistDescription,
    public: isPublic,
    files: gistfiles
  };

  before(() => {
    const gistQuery = agent.post(`${urlBase}/gists`, postParams)
      .then((response) => {
        gist = response.body;
        responseStatus = response.status;
      });

    return gistQuery;
  });

  it('gist should have description, content and be public', () => {
    expect(responseStatus).to.equal(statusCode.CREATED);
    expect(gist.files['file1.txt'].content).to.equal(gistfiles['file1.txt'].content);
    expect(gist).to.containSubset({
      description: gistDescription,
      public: isPublic
    });
  });
});
