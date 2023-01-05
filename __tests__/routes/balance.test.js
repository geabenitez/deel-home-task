const request = require('supertest');
const app = require('../../src/app');
const { Profile, Job, Contract } = require('../../src/model');

describe('BALANCES ROUTE', () => {
  describe('POST /balance/deposit/:userId', () => {
    let client;
    let contractor;
    let contract;
    let jobs;

    // Prepare the test environment
    beforeEach(async () => {
      // Create a client anc contractor profile
      client = await Profile.create({ firstName: 'John', lastName: 'Doe', profession: 'Soccer Player', balance: 0, type: 'client', });
      contractor = await Profile.create({ firstName: 'Jane', lastName: 'Doe', profession: 'Developer', balance: 0, type: 'contractor', });

      // Create a contract
      contract = await Contract.create({ terms: 'Contract terms', status: 'in_progress', ClientId: client.id, ContractorId: contractor.id });

      // Create some jobs and contracts for the client
      jobs = await Promise.all([
        Job.create({ description: 'Job description 100', price: 100, ContractId: contract.id }),
        Job.create({ description: 'Job description 200', price: 200, ContractId: contract.id }),
        Job.create({ description: 'Job description 300', price: 300, ContractId: contract.id }),
      ]);
    });


    // Delete all jobs, contracts and profiles
    afterEach(async () => {
      await Promise.all([
        Job.destroy({ where: { id: jobs.map(job => job.id) } }),
        Contract.destroy({ where: { id: contract.id } }),
        Profile.destroy({ where: { id: [client.id, contractor.id] } }),
      ]);
    });

    it('updates the client balance with the amount', async () => {
      // An amount of 25% of the total jobs to pay
      const amount = jobs.reduce((acc, job) => acc + job.price, 0) * 0.25;

      // Make the request
      const response = await request(app)
        .post(`/balances/deposit/${client.id}`)
        .set('profile_id', client.id)
        .send({ amount });

      // Expect success
      expect(response.statusCode).toBe(200);

      // Check the client balance
      const updatedClient = await Profile.findOne({ where: { id: client.id } });
      expect(updatedClient.balance).toBe(amount);
    });

    it('returns a 400 error if the amount is more than 25% of total jobs to pay', async () => {
      // An amount of 26% of the total jobs to pay
      const amount = jobs.reduce((acc, job) => acc + job.price, 0) * 0.26;

      // Make the request
      const response = await request(app)
        .post(`/balances/deposit/${client.id}`)
        .set('profile_id', client.id)
        .send({ amount });

      // Expect error
      expect(response.statusCode).toBe(400);
    });
  });
})