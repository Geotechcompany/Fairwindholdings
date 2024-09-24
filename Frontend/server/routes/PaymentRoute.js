import express from 'express'
import { cancel, createPayment, success } from '../controller/PaymentController.js'

const paymentRouter = express.Router()

paymentRouter.post('/create-checkout-session', createPayment)
paymentRouter.get('/success', success)
paymentRouter.get('/cancel', cancel)

export default paymentRouter