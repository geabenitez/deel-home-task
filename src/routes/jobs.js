const express = require('express');
const router = express.Router();

/**
 * @returns all unpaid jobs for a profile id for active contracts
 */
router.get('/unpaid', async (req, res) => {
  const { Contract, Job } = req.app.get('models')

  // Get all contract ids for a profile id and status in_progress
  const contractIds = (await Contract.findAll({
    where: {
      ClientId: req.profile.id,
      status: 'in_progress'
    }
  })).map(contract => contract.id)

  // Get all jobs for contract ids and paid is null (unpaid)
  const jobs = await Job.findAll({
    where: {
      ContractId: contractIds,
      paid: null
    }
  })

  // Return jobs
  res.json(jobs)
})

/**
 * Pay for a job, a client can only pay if his balance >= the amount to pay.
 */
router.post('/:job_id/pay', async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models')

  // Get unpaid job by id and return 404 if job not found
  const job = await Job.findOne({ where: { id: req.params.job_id, paid: null } })
  if (!job) return res.status(404).send('Job not found')

  // Get contract by id and profile id, return 404 if contract not found
  const contract = await Contract.findOne({ where: { id: job.ContractId, ClientId: req.profile.id } })
  if (!contract) return res.status(404).send('Job not found')

  // Get the client profile by id
  const client = await Profile.findOne({ where: { id: req.profile.id } })

  // Get the contractor profile by id
  const contractor = await Profile.findOne({ where: { id: contract.ContractorId } })

  // Return 400 if client balance < job price
  if (client.balance < job.price) return res.status(400).send('Insufficient balance')

  // Update client profile balance
  await client.update({ balance: client.balance - job.price })

  // Update contractor profile balance
  await contractor.update({ balance: contractor.balance + job.price })

  // Update job paid to 1 (true)
  await job.update({ paid: 1, paymentDate: new Date() })

  // Return job
  res.send('Job paid')
})

module.exports = router;