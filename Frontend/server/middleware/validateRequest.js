import joi from 'joi';

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

const signupSchema = joi.object({
  username: joi.string().pattern(new RegExp("^[a-zA-Z]+$")).min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  verified: joi.boolean,
  plan: joi.string(),
  project: joi.string().required(),
  site: joi.string().required(),
  role: joi.string().max(11),
});



export  { validateRequest, signupSchema };