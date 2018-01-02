const agent = require('superagent-promise')(require('superagent'), Promise);
const chai = require('chai');
const { listPublicEventsSchema } = require('./schema/ListPublicEvents.schema.js');

const { expect } = chai;
chai.use(require('chai-json-schema'));

const urlBase = 'https://api.github.com';

describe('Given event Github API resources', () => {
  describe('When wanna verify the List public events', () => {
    let eventList;

    before(() => {
      const listPublicEventsQuery = agent
        .get(`${urlBase}/events`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          eventList = response.body;
        });

      return listPublicEventsQuery;
    });

    it('then the body should have a schema', () => {
      expect(eventList).to.be.jsonSchema(listPublicEventsSchema);
    });
  });
});
