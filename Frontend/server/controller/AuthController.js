import User from "../model/User.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
import Payment from "../model/Payment.js";

let currentSite = "";
dotenv.config({path: "../.env"});

const signup = async (req, res, next) => {
  const { username, email, password, project, site, plan } = req.body;
  currentSite = site;
  let requests = 0
  switch (plan) {
    case "free":
      requests = 10
      break;
    case "subscription-1":
      requests = 20
      break;  
    case "subscription-2":
        requests = 30
    break; 
    case "subscription-3":
      requests = 40
      break;       
  
    default:
      request = 10
      break;
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    try {
      const user = new User({ username, email, password: hash, project, plan, requests });
      user.generateVerificationHash();
      await user.save();

      const verificationLink = `${req.protocol}://${req.get(
        "host"
      )}/verify?hash=${user.verificationHash}`;
      sendVerificationEmail(user.email, verificationLink);

      res.status(200).json({ user });
    } catch (error) {
      // Check if the error is a duplicate key error (E11000)
      if (error.code === 11000 && error.keyPattern.username) {
        res.status(400).json({ message: "Username already exists" });
      } else if (error.code === 11000 && error.keyPattern.email) {
        res.status(400).json({ message: "Email already exists" });
      } else {
        // If it's a different error, pass it to the error handler
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

const sendVerificationEmail = (to, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // your email address
      pass: process.env.PASS, // your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Email Verification",
    html: `<div style="padding: 30px; background-color: #3758F9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center;">
        <p style="fontSize: 28px; color: #fff;"><a style="color: #fff; textDecoration: underline" href="${link}">LOGIN WITH THIS LINK TO VERIFY YOUR EMAIL</a></p>
     </div>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};


// AuthController.js
const verifyEmail = async (req, res) => {
  const { hash } = req.query;

  try {
    const user = await User.findOne({ verificationHash: hash });

    // if (!user) {
    //   res.status(400).json({ message: "Invalid verification link" });
    // } else {
      
    // }
    user.verified = true;
    user.verificationHash = "";
    await user.save();

    res.redirect(303, `${currentSite}/signin.html`);
  } catch (error) {
    console.log(error);
    res.send(`<p style="fontSize: 28px; color: red;">INVALID VERIFICATION ID</p>`)
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
    } else {
      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const verificationCode = generateVerificationCode();
        user.loginVerificationCode = verificationCode;
        await user.save();

        // You can customize the message and method of sending the code (e.g., SMS)
        sendVerificationCode(user.email, verificationCode);

        res
          .status(200)
          .json({ success: "Verification code sent successfully" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const generateVerificationCode = () => {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationCode = (to, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // your email address
      pass: process.env.PASS, // your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "2FA AUTHENTICATION CODE",
    html: `<div style="padding: 30px; background-color: #3758F9; box-shadow: 0 4px 8px #3758F9; text-align: center;">
        <p style="color: white; font-size: 28px;">${to}: ${code}</p>
     </div>`,
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log(`Verification code sent to ${to}: ${code}`);
};

// AuthController.js
const verifyLoginCode = async (req, res) => {
  const { username, code } = req.body;

  try {
    const user = await User.findOne({
      username: username,
      loginVerificationCode: code,
    });
    console.log(user);

    if (!user) {
      res.status(401).json({ message: "Invalid verification code" });
    } else {
      // Reset the verification code after successful verification
      user.loginVerificationCode = "";
      await user.save();

      const token = Jwt.sign({ id: user.id }, "secret_jwt", {
        expiresIn: "30d",
      });
      // check payment
      const payment = await Payment.findOne({user_id: user.user_id});

      res
        .status(200)
        .json(
          { 
            success: "Login success", 
            token: token, 
            user: user,
            plan: user.plan,
            paid: payment?.paid ? true: false
          }
          );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = Jwt.verify(token, "secret_jwt");
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ user: user });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};
const updateRequests = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = Jwt.verify(token, "secret_jwt");
    const userId = decoded.id;

    const user = await User.findById(userId);

    user.requests += 1
    await user.save()
    res.status(200).json({ i: "incremented request"})
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export { login, signup, getUserDetails, verifyEmail, verifyLoginCode, updateRequests };
