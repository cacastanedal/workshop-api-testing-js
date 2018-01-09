const fetch = require('isomorphic-fetch');
const { expect, assert } = require('chai');
const statusCode = require('http-status-codes');

const chaiSubset = require('chai-subset');
const chai = require('chai');

const urlBase = 'https://api.github.com';

chai.use(chaiSubset);

describe('Creating a gist through Isomorphic-fetch', () => {
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
    const gistQuery = fetch(`${urlBase}/gists`, {
      method: 'Post',
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      },
      body: JSON.stringify(postParams)
    }).then((response) => {
      responseStatus = response.status;
      return response.json();
    }).then((jsonResponse) => {
      gist = jsonResponse;
      gistUrl = jsonResponse.url;
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
      const gistGetQuery = fetch(gistUrl, {
        method: 'Get',
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      }).then(response => response.json()).then((jsonResponse) => {
        gistMirror = jsonResponse;
      });
      return gistGetQuery;
    });

    it('the gist consulted exist', () => {
      assert.exists(gistMirror);
    });

    describe('Deleting gist', () => {
      let deleteResponse;

      before(() => {
        const gistDelQuery = fetch(gistUrl, {
          method: 'DELETE',
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        }).then((response) => {
          deleteResponse = response.status;
        });
        return gistDelQuery;
      });
      it('the gist should be errased', () => {
        expect(deleteResponse).to.equal(statusCode.NO_CONTENT);
      });

      describe('Trying to get the deleted gist', () => {
        it('gist not found', () => {
          fetch(gistUrl, {
            method: 'Get',
            headers: {
              Authorization: `token ${process.env.ACCESS_TOKEN}`
            }
          }).then((response) => {
            expect(response.status).to.equal(statusCode.NOT_FOUND);
          });
        });
      });
    });
  });
});
