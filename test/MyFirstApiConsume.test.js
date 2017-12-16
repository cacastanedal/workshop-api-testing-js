const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');

const { expect } = require('chai');

describe('First Api Tests', () => {
  it('Consume GET Service', () => {
    agent.get('https://httpbin.org/ip')
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.have.property('origin');
      });
  });

  it('Consume GET Service with query parameters', () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    return agent.get('https://httpbin.org/get')
      .query(query)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.args).to.eql(query);
      });
  });

  it('Consume POST Service', () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    return agent
      .post('https://httpbin.org/post')
      .send(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(body);
      });
  });

  it('Consume HEAD Service', () => agent
    .head('https://httpbin.org/')
    .then((response) => {
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.be.empty;
      expect(response.headers).to.not.be.empty;
    }));

  it('Consume PATCH Service', () => {
    const body = {
      half_cup: 'vanilla extract',
      two_eggs: 'beaten',
      one_thid_cup: 'all-pupose flour'
    };

    return agent
      .patch('https://httpbin.org/patch')
      .send(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(body);
      });
  });

  it('Consume PUT Service', () => {
    const body = {
      four_cups: 'sweet potato, cubed',
      half_cup: 'white sugar',
      half_tablespoon: 'chopped pecans'
    };

    return agent
      .put('https://httpbin.org/put')
      .send(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(body);
      });
  });

  it('Consume DELETE Service', () => {
    const body = {
      half_teaspoon: 'salt',
      four_teaspoon: 'butter, softened',
      half_cup: 'milk'
    };

    return agent
      .del('https://httpbin.org/delete')
      .send(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(body);
      });
  });
});

