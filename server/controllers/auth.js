import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
	const { username, email, password, role } = req.body;
	const hashedPassword = bcryptjs.hashSync(password, 10);
	const newUser = new User({ username, email, password: hashedPassword, role });
	try {
		await newUser.save();
		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		// next(errorHandler(300, "something went wrong"));
		next(error);
	}
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const validUser = await User.findOne({ email });
		if (!validUser) return next(errorHandler(404, "User Not Found!"));
		const validPasswod = bcryptjs.compareSync(password, validUser.password);
		if (!validPasswod) return next(errorHandler(401, "Wrong Credentials!"));
		const token = jwt.sign(
			{ id: validUser._id, role: validUser.role },
			process.env.JWT_SECRET
		);
		const { password: hashedPassword, ...rest } = validUser._doc;
		const expiryDate = new Date(Date.now() + 3600000);
		res
			.cookie("acess_token", token, { httpOnly: true, expires: expiryDate })
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};
