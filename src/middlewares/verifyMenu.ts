import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addDataSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  picture: Joi.allow().optional(),
  user: Joi.optional(),
});

const updateDataSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().optional(),
  description: Joi.string().optional(),
  picture: Joi.allow().optional(),
  user: Joi.optional(),
});

export const verifyAddMenu = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { error } = addDataSchema.validate(request.body, { abortEarly: false });

  if (error) {
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};

export const verifyEditMenu = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateDataSchema.validate(req.body, { abortEarly: false }); //memvalidasi request body dan mengambil error

  if (error) {
    //response jika ada error
    return res.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};
