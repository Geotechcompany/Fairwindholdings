import mongoose from "mongoose";

const { Schema } = mongoose

const PaymentSchema = new Schema({
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: false,
    },
    plan: {
        type: String,
        required: true
    },

    paid: {
        type: Boolean,
        required: true,
        default: false
    }

})

const Payment = mongoose.model('Payment', PaymentSchema)

export default Payment