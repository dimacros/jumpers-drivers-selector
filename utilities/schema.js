const branchSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      faker: 'company.companyName'
    },
    online: {
      type: 'boolean',
      default: true
    },
    location: {
      $ref: '#/definitions/geoLocation'
    }
  }
};

const orderSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    },
    branch: branchSchema,
    status: {
      type: 'integer',
      minimum: 3,
      maximum: 4
    },
    time: {
      type: 'integer'
    }
  }
};

const driverSchema = {
  type: 'object',
  properties: {
    connection: {
      type: 'object',
      properties: {
        time: {
          type: 'integer'
        },
        online: {
          type: 'boolean',
          default: true
        }
      }
    },
    currentLocation: {
      $ref: '#/definitions/geoLocation'
    },
    name: {
      type: 'string',
      faker: 'name.findName'
    },
    order: {
      type: 'object',
      default: null,
      properties: {
        active_order: {
          $ref: '#/properties/orders/items'
        },
        order_request: {
          $ref: '#/properties/orders/items'
        }
      }
    }
  }
};

const schema = {
  type: 'object',
  properties: {
    orders: {
      type: 'array',
      minItems: 5,
      items: orderSchema
    },
    drivers: {
      type: 'array',
      minItems: 10,
      items: driverSchema
    }
  },
  definitions: {
    geoLocation: {
      title: "Longitude and Latitude",
      description: "A geographical coordinate on a planet (most commonly Earth).",
      required: [ "latitude", "longitude" ],
      type: "object",
      properties: {
        latitude: {
          type: "number",
          minimum: -90,
          maximum: 90,
          faker: 'address.latitude'
        },
        longitude: {
          type: "number",
          minimum: -180,
          maximum: 180,
          faker: 'address.longitude'
        }
      }
    }
  }
};

module.exports = schema;
