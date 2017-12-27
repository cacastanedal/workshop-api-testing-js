const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect, assert } = require('chai');
const statusCode = require('http-status-codes');

const chaiSubset = require('chai-subset');
const chai = require('chai');

const urlBase = 'https://api.github.com';

chai.use(chaiSubset);

describe('Creating a gist', () => {
  let gist;
  let responseStatus;
  let gistUrl;

  const postParams = {
    description: 'This is a description example for a gists',
    public: true,
    files: {
      'file1.txt': {
        content: 'String file contents'
      }
    }
  };

  before(() => {
    const gistQuery = agent.post(`${urlBase}/gists`, postParams)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        gist = response.body;
        responseStatus = response.status;
        gistUrl = response.body.url;
      });

    return gistQuery;
  });

  it('gist should have description, content and be public', () => {
    expect(responseStatus).to.equal(statusCode.CREATED);
    expect(gist.files['file1.txt'].content).to.equal(postParams.files['file1.txt'].content);
    expect(gist).to.containSubset({
      description: postParams.description,
      public: true
    });
  });

  describe('Consulting gist through hipermedia', () => {
    let gistMirror;
    before(() => {
      const gistGetQuery = agent.get(gistUrl)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          gistMirror = response.body;
        });
      return gistGetQuery;
    });

    it('the gist consulted exist', () => {
      assert.exists(gistMirror);
    });

    describe('Deleting gist', () => {
      let gistDeleted;
      let deleteResponse;

      before(() => {
        const gistDelQuery = agent.del(gistUrl)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            gistDeleted = response.body;
            deleteResponse = response.status;
          });
        return gistDelQuery;
      });
      it('the gist should be errased', () => {
        expect(deleteResponse).to.equal(statusCode.NO_CONTENT);
        expect(gistDeleted).to.be.empty;
      });

      describe('Trying to get the deleted gist', () => {
        it('gist not found', () => {
          agent.get(gistUrl)
            .auth('token', process.env.ACCESS_TOKEN)
            .catch((response) => {
              expect(response.status).to.equal(statusCode.NOT_FOUND);
            });
        });
      });
    });
  });
});
