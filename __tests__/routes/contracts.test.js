const request = require('supertest')
const app = require('../../src/app')
const { Profile, Contract } = require('../../src/model')

describe('CONTRACT ROUTE', () => {
  describe('GET /:id', () => {
    let client;
    let contractor;
    let contract;

    // Prepare the test environment
    beforeEach(async () => {
      client = await Profile.create({ firstName: 'John', lastName: 'Doe', profession: 'Soccer Player', balance: 0, type: 'client', });
      contractor = await Profile.create({ firstName: 'Jane', lastName: 'Doe', profession: 'Developer', balance: 0, type: 'contractor', });
      contract = await Contract.create({ terms: 'Contract terms', status: 'terminated', ClientId: client.id, ContractorId: contractor.id });
    });

    afterEach(async () => {
      await Promise.all([
        Contract.destroy({ where: { id: contract.id } }),
        Profile.destroy({ where: { id: [client.id, contractor.id] } }),
      ]);
    });

    it('returns the contract if it is found', async () => {
      const response = await request(app)
        .get(`/contracts/${contract.id}`)
        .set('profile_id', client.id)

      expect(response.statusCode).toBe(200)
      expect(response.body.ClientId).toEqual(contract.ClientId)
      expect(response.body.ContractorId).toEqual(contract.ContractorId)
    })

    it('returns a 404 error if the contract is not found', async () => {
      const response = await request(app)
        .get('/123')
        .set('profile_id', client.id)

      expect(response.statusCode).toBe(404)
    })
  })
})
