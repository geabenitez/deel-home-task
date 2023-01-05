# DEEL BACKEND TASK INSTRUCTIONS AND NOTESS

This project aims to implement the following API endpoints. Please also consider the notes.

## APIs To Implement

1. **_GET_** `/contracts/:id` - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that! **Note:** This enpoint has been fixed to return the contract that belongs to the profile logged.

1. **_GET_** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. **_GET_** `/jobs/unpaid` - Get all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**.

1. **_POST_** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. **_POST_** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment) **Note:** I think this should consider the person already logged and be available only for clients not contractors and no use the param :userId

1. **_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. **_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.

## UNIT Tests

I have implemented some unit tests, for now is better to run them with empty database (but existing database) with a little more time I would create a db for development and another for testing. But for now please try to clear the database before running the tests.

You can run the tests by `npm run test`
