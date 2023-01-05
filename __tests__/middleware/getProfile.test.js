const request = require('supertest')
const { getProfile } = require('../../src/middleware/getProfile')

describe('getProfile', () => {
  it('returns a 401 error if the profile is not found', async () => {
    // Mock the request response and next objects
    const req = {
      app: { get: () => ({ Profile: { findOne: () => null, }, }), },
      get: () => null,
    }
    const res = { status: jest.fn().mockReturnThis(), end: jest.fn(), }
    const next = jest.fn()

    // Call the middleware
    await getProfile(req, res, next)

    // Expect the status to be 401
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('sets the profile on the request object and calls the next middleware if the profile is found', async () => {
    const req = {
      app: { get: () => ({ Profile: { findOne: () => ({ id: 1 }), }, }), },
      get: () => 0,
    }
    const res = { status: jest.fn().mockReturnThis(), end: jest.fn(), }
    const next = jest.fn()

    await getProfile(req, res, next)

    expect(req.profile).toEqual({ id: 1 })
  })
})
