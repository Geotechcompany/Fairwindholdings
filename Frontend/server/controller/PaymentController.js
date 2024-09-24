import "dotenv/config";
import Stripe from "stripe";
import Payment from "../model/Payment.js";
import { payingUser } from "../store/Paying.js";
import User from "../model/User.js";
import dotenv from "dotenv"
dotenv.config()

const stripe = new Stripe("sk_test_51OaXpeDgHezqQ0kofel67ImiykUrh1NZlDTIlsXAaxx1bgyJxQuoaRRBdSIU2QqqSsQToI2Hoefeorpmtt3SnVft00k7kWwDBA");


// export const getPayment = async (r)

export const createPayment = async (req, res) => {
  const order = req.body;
  console.log(order);
  payingUser.plan = order.plan;
  payingUser.user_id = order.user_id;
  payingUser.site = order.site

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: order.plan,
            },
            unit_amount: Math.max(parseInt(1 * 100), 50),
          },
          quantity: 1,
        },
      ],
      success_url: `https://wellnz-6lar.onrender.com/success.html`,
      cancel_url: `https://wellnz-6lar.onrender.com/failure.html`,
    });
    const payment = await Payment.create({
      user_id: order.user_id,
      plan: order.plan,
      amount: 10,
      paid: true
    })
    
    await payment.save()
    res.json({ url: session.url }).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const checkSubs = async (req, res) => {
  try {
    const user = await User.findOne({ _id: data.user_id });
    if(user.requests > 0){
      res.json({message: true}).status(200)
    }else{
      res.json({message: false}).status(400)
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const success = async (req, res) => {
  try {
    const data = {
      user_id: payingUser.user_id,
      amount: req.query.amount_total,
      plan: payingUser.plan,
    };
    const user = await User.findOne({ _id: data.user_id });
    if (!user) {
      res.json({ message: "User not found" });
    }

    //update the user details in the db
    user.plan = data.plan;
    await user.save();

    //insert the payment info in the
    const payment = await Payment.create(data);

    //redirecting the user to the dashboard
    setTimeout(() => {
      res.redirect(303, `${payingUser.site}`);
    }, 3000);
  } catch (error) {
    console.error(error);
    res.json({ error: error }).status(500);
  }
};

export const cancel = async (req, res) => {
  //redirect to the dashboard
  res.redirect(303, `${payingUser.site}`);
};
