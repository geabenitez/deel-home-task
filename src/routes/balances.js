const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

/**
 * Deposits money into the the the balance of a client, a client can't 
 * deposit more than 25% his total of jobs to pay. (at the deposit moment)
 */
router.post('/deposit/:userId', async (req, res) => {
  const { Profile, Job, Contract } = req.app.get('models')
  const amount = req.body.amount

  // Get the client profile by id
  const client = await Profile.findOne({ where: { id: req.params.userId } })

  // Get total of jobs to pay for the client
  const totalJobsToPay = (await Job.findAll({
    where: {
      paid: null,
    },
    include: [{
      model: Contract,
      where: {
        ClientId: client.id,
      }
    }]
  })).reduce((acc, job) => acc + job.price, 0)

  // Validate the amount to deposit
  if (amount > totalJobsToPay * 0.25) {
    return res.status(400).send(`Can't deposit more than 25% of total jobs to pay (${totalJobsToPay})`)
  }

  // Update the client balance
  await client.update({ balance: client.balance + amount })
  return res.send('Client balance updated')

})

module.exports = router