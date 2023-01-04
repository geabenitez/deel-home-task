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

/**
 * @returns the clients the paid the most for jobs in the query time period. 
 * limit query parameter should be applied, default limit is 2.
 */
router.get('/best-clients', async (req, res) => {
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
    where: {
      paid: 1,
    },
    include: [{
      model: Contract,
      where: {
        createdAt: {
          [Sequelize.Op.between]: [
            new Date(req.query.start),
            new Date(req.query.end).setUTCHours(23, 59, 59)
          ]
        }
      },
      include: [{
        model: Profile,
        as: 'Client',
        foreignKey: 'ClientId'
      }]
    }]
  })

  // Get the top clients
  const topClients = jobs.reduce((acc, job) => {
    const { id, firstName, lastName } = job.Contract.Client
    if (!acc[id]) {
      acc[id] = {
        id,
        fullName: `${firstName} ${lastName}`,
        paid: 0
      }
    }
    acc[id].paid += job.price
    return acc
  }, {})

  // Sort and slice the top clients
  const top = Object.values(topClients)
    .sort((a, b) => {
      if (a.paid < b.paid) return 1
      if (a.paid > b.paid) return -1
      return 0
    })
    .slice(0, req.query.limit || 2)
  return res.json(top)
})

module.exports = router;