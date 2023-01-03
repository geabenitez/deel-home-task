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

module.exports = router;