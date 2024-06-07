import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import User from '../models/user.js';

export const signin = async (req, res) => {
    const {email, password} = req.body;
    try {
        const existingUser = User.findOne({email});
        console.log(existingUser);
        if(!existingUser) return res.status(404).json({message: "User doesn't exist"})
        const isPasswordExist = await bycrypt.compare(password, existingUser.password);
        console.log(isPasswordExist);
        if(!isPasswordExist) return res.status(400).json({message: "Invalid credential."});

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "1h"});
        // test = credential password dicreate oleh developer dan nanti diletakin pada .env
        // expiresIn = otomatis logout bila time > expiresIn

        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" })
    }
}
export const signup = async (req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;
    try {
        const existingUser = User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exist" });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match"})
        const hashedPassword = await bycrypt.hash(password, 12);
        console.log(hashedPassword);
        const result = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`});
        const token = jwt.sign({ email: result.email, id: result._id}, 'test', {expiresIn: "1h"} );
        res.status(200).json({ result, token })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}