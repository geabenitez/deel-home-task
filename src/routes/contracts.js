const express = require('express');
const router = express.Router();

/**
 * @returns contract by id and profile id
 */
router.get('/:id', async (req, res) => {
  const { Contract } = req.app.get('models')
  const contract = await Contract.findOne({
    where: {
      id: req.params.id,
      ClientId: req.profile.id
    }
  })
  if (!contract) return res.status(404).send('Contract not found')
  res.json(contract)
})

/**
 * @returns all contracts for a profile id
 */
router.get('/', async (req, res) => {
  const { Contract } = req.app.get('models')
  const contracts = await Contract.findAll({
    where: {
      ClientId: req.profile.id,
      status: 'in_progress'
    }
  })
  res.json(contracts)
})

module.exports = router;