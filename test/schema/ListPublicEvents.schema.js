const listPublicEventsSchema = {
  type: 'array',
  items: {
    properties: {
      id: {
        type: 'string'
      },
      type: {
        type: 'string'
      },
      actor: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          },
          login: {
            type: 'string'
          },
          display_login: {
            type: 'string'
          },
          gravatar_id: {
            type: 'string'
          },
          url: {
            type: 'string'
          },
          avatar_url: {
            type: 'string'
          }
        }
      },
      created_at: {
        type: 'string'
      },
      payload: {
        type: 'object'
      },
      public: {
        type: 'boolean'
      },
      repo: {
        type: 'object'
      }
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
