import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// register new users
export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("📥 Incoming registration request for email:", email);

    try {
        // Check if user already exists
        const oldUser = await UserModel.findOne({ email });
        if (oldUser) {
            console.log("\u26a0\ufe0f User already exists with this email:", email);
            return res.status(400).json({ message: "This User already exists!" });
        }

        // Password hashing
        console.log("\ud83d\udd10 Hashing password...");
        const salt = await bcrypt.genSalt(10);
        let pass = password.toString();
        // Use the generated salt string (not parseInt) when hashing.
        const hashedPass = await bcrypt.hash(pass, salt);
        req.body.password = hashedPass;

        // Creating new user
        const newUser = new UserModel(req.body);
        console.log("\ud83c\udd95 Creating new user with data:", newUser);

        const user = await newUser.save();
        console.log("\u2705 User saved successfully:", user);

        // Generating token (fall back to a default key in case env is missing)
        const jwtKey = process.env.JWT_KEY || 'changeme';
        const token = jwt.sign(
            { email: user.email, id: user._id },
            jwtKey
        );
        console.log("\ud83d\udd11 JWT token generated:", token);

        // Success response
        res.status(200).json({ user, token });

    } catch (error) {
        console.error("\u274c Error in registerUser:", error);
        // Provide more detailed error for debugging (safe in dev)
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};


// Login users

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);

    try {
        const user = await UserModel.findOne({ email: email });

        if (user) {
            const validity = await bcrypt.compare(password, user.password)

            if (!validity) {
                res.status(400).json("Sorry, Please enter the correct email or password!");
            } else {
                const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
                console.log(token)
                res.status(200).json({ user, token });
            }
        } else {
            res.status(404).json("Sorry, Please enter the correct email or password!")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}