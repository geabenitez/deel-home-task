const express = require('express');
const router = express.Router();

/**
 * @returns contract by id and profile id
 */
router.get('/:id', async (req, res) => {
  const { Contract } = req.app.get('models')

  // Get contract by id and profile id
  const contract = await Contract.findOne({
    where: {
      id: req.params.id,
      ClientId: req.profile.id
    }
  })

  // Return 404 if contract not found
  if (!contract) return res.status(404).send('Contract not found')

  // Return contract
  res.json(contract)
})

/**
 * @returns all contracts for a profile id
 */
router.get('/', async (req, res) => {
  const { Contract } = req.app.get('models')

  // Get all contracts for a profile id and status in_progress
  const contracts = await Contract.findAll({
    where: {
      ClientId: req.profile.id,
      status: 'in_progress'
    }
  })

  // Return contracts
  res.json(contracts)
})

module.exports = router;