const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

/**
 * @returns Returns the profession that earned the most money (sum of jobs paid) 
 * for any contactor that worked in the queried time range.
 */
router.get('/best-profession', async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models')

  // Validates start and end query params
  if (!req.query.start || !req.query.end) {
    return res.status(400).send('Missing start or end query param')
  }

  // Validates start and end as valid dates
  if (isNaN(Date.parse(req.query.start)) || isNaN(Date.parse(req.query.end))) {
    return res.status(400).send('Invalid start or end query param the format should be YYYY-MM-DD')
  }

  // Queries all jobs with contracts that have status terminated and createdAt between start and end
  const jobs = await Job.findAll({
    include: [{
      model: Contract,
      where: {
        status: 'terminated',
        createdAt: {
          [Sequelize.Op.between]: [
            new Date(req.query.start),
            new Date(req.query.end).setUTCHours(23, 59, 59)
          ]
        }
      },
      include: [{
        model: Profile,
        as: 'Contractor',
        foreignKey: 'ContractorId'
      }]
    }]
  })

  // Get the top profession
  const topProfession = jobs.reduce((acc, job) => {
    const profession = job.Contract.Contractor.profession
    if (!acc[profession]) {
      acc[profession] = 0
    }
    acc[profession] += job.price
    return acc
  }, {})

  // Return the top profession
  return res.json(topProfession)
})

module.exports = router;