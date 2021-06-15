"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {ensureLoggedIn, ensureAdmin} = require("../middleware/auth");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    // User.register is where db.query is at
    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

router.get('/topsecret', (req, res, next) => {
  try {
    const token = req.body._token;
    const data = jwt.verify(token, SECRET_KEY);
    console.log(data.isAdmin);
    (!data.isAdmin) ? console.log('you are not an Admin') : console.log('you are Admin High Five!');

    return res.json({msg: "Signed in! This is TOP SECRET. I like Green."});
  }
  catch (err) {
    return next(new BadRequestError("Please login first!"));
  }
});


////////////////////////////////TESTING LOGIN
router.post("/login", async function (req, res, next) {
  try {
    const {username, password} = req.body;
    // const validator = jsonschema.validate(req.body, userRegisterSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map(e => e.stack);
    //   throw new BadRequestError(errs);
    // }
    // User.login is where db.query is at
    const user = await User.authenticate(username, password);
    return res.json({ msg: `${user} Logged In!` });
  } catch (err) {
    return next(err);
  }
});

router.get('/private', 
  ensureLoggedIn, 
  async (req, res, next) => {
    try {
      return res.json({msg: `Welcome to my VIP section`});
    }
    catch(e) {
      next(e);
    }

})


module.exports = router;
