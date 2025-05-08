import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

export function createUser(req, res) {
  //only an admin can create another admin
  if ((req.body.role = "admin")) {
    if (req.user != null) {
      if (req.user.role != "admin") {
        res.status(403).json({
          message: "You are not authorized to create an admin accounts",
        });
        return; //exit from createUser
      }
    } else {
      res.status(403).json({
        message:
          "You are not authorized to create an admin accounts. Please login first",
      });
      return; //exit from createUser
    }
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds); // Generate a unique salt
  const hashedPassword = bcrypt.hashSync(req.body.password, salt); // Hash password with salt

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    salt: salt, // Optionally store salt if needed
    role: req.body.role,
  });

  user
    .save()
    .then(() => {
      res.json({
        message: "User added successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "Failed to add user",
      });
    });
}

export function loginUser(req, res) {
  //email and password typed by user
  const email = req.body.email;
  const password = req.body.password;

  //finding the user with the sent email from DB
  User.findOne({ email: email }).then((user) => {
    if (user == null) {
      res.status(404).json({
        message: "user not found",
      });
    } else {
      //comparing the password hashes
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        //making jwt token
        const token = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            img: user.img,
          },
          process.env.JWT_KEY  //encryption key for the token Stored in .env file
        );
        //sending the token to the client
        res.json({
          message: "Login Successful",
          token: token,
          role: user.role,
        });
      } else {
        res.json({
          message: "Invalid Password",
        });
      }
    }
  });
}

export function isAdmin(req, res) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role != "admin") {
    return false;
  }
  return true;
}
