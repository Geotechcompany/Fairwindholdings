import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import userRouter from './routes/AuthRoute.js'
import { connectToDB } from './config/db.js'
import paymentRouter from './routes/PaymentRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(cors({
    origin: ['*', 'http://localhost:4000']
}))

// Serve static files from the 'Public' folder within the server directory
app.use(express.static(path.join(__dirname, 'Public')))

app.use(userRouter)
app.use(paymentRouter)

connectToDB()

app.listen(4000, () => console.log('server listening on http://localhost:4000'))
