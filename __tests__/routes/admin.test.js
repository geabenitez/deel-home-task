const request = require('supertest');
const app = require('../../src/app');
const { Profile, Job, Contract } = require('../../src/model');

describe('ADMIN ROUTE', () => {
  let clients;
  let contractors;
  let contracts;
  let jobs;

  // Prepare the test environment
  beforeEach(async () => {
    // Create a clients anc contractors profile
    clients = await Promise.all([
      Profile.create({ firstName: 'John', lastName: 'Doe', profession: 'Soccer Player', balance: 0, type: 'client', }),
      Profile.create({ firstName: 'Rita', lastName: 'Doe', profession: 'Dancer', balance: 0, type: 'client', }),
      Profile.create({ firstName: 'Martha', lastName: 'Doe', profession: 'Singer', balance: 0, type: 'client', }),
    ])
    contractors = await Promise.all([
      Profile.create({ firstName: 'Jane', lastName: 'Doe', profession: 'Developer', balance: 0, type: 'contractor', }),
      Profile.create({ firstName: 'Jack', lastName: 'Doe', profession: 'Writer', balance: 0, type: 'contractor', }),
      Profile.create({ firstName: 'Jill', lastName: 'Doe', profession: 'Coach', balance: 0, type: 'contractor', }),
    ]);

    // Create a contract
    contracts = await Promise.all([
      Contract.create({ terms: 'Contract terms', status: 'terminated', ClientId: clients[0].id, ContractorId: contractors[0].id }),
      Contract.create({ terms: 'Contract terms', status: 'terminated', ClientId: clients[1].id, ContractorId: contractors[1].id }),
      Contract.create({ terms: 'Contract terms', status: 'terminated', ClientId: clients[2].id, ContractorId: contractors[2].id }),
    ]);

    // Create some jobs and contracts for the client
    jobs = await Promise.all([
      Job.create({ description: 'Job description 189', price: 189, paid: 1, paymentDate: new Date(), ContractId: contracts[0].id }),
      Job.create({ description: 'Job description 230', price: 230, paid: 1, paymentDate: new Date(), ContractId: contracts[1].id }),
      Job.create({ description: 'Job description 456', price: 456, paid: 1, paymentDate: new Date(), ContractId: contracts[2].id }),
      Job.create({ description: 'Job description 324', price: 324, paid: 1, paymentDate: new Date(), ContractId: contracts[0].id }),
      Job.create({ description: 'Job description 123', price: 123, paid: 1, paymentDate: new Date(), ContractId: contracts[1].id }),
      Job.create({ description: 'Job description 512', price: 512, paid: 1, paymentDate: new Date(), ContractId: contracts[2].id }),
      Job.create({ description: 'Job description 562', price: 562, paid: 1, paymentDate: new Date(), ContractId: contracts[0].id }),
      Job.create({ description: 'Job description 233', price: 233, paid: 1, paymentDate: new Date(), ContractId: contracts[1].id }),
      Job.create({ description: 'Job description 121', price: 121, paid: 1, paymentDate: new Date(), ContractId: contracts[2].id }),
    ]);
  });

  // Delete all jobs, contracts and profiles
  afterEach(async () => {
    await Promise.all([
      Job.destroy({ where: { id: jobs.map(job => job.id) } }),
      Contract.destroy({ where: { id: contracts.map(contract => contract.id) } }),
      Profile.destroy({ where: { id: clients.map(profile => profile.id).concat(contractors.map(contractor => contractor.id)) } }),
    ]);
  });

  describe('GET /best-profession', () => {
    it('returns the best profession', async () => {
      const response = await request(app)
        .get(`/admin/best-profession/?start=${new Date().toISOString().slice(0, 10)}&end=${new Date().toISOString().slice(0, 10)}`)
        .set('profile_id', clients[0].id)

      expect(response.statusCode).toBe(200);
      expect(response.body.profession).toBe('Coach');
      expect(response.body.paid).toBe(1089);
    })

  });

})