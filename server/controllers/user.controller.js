import User from '../models/user.model.js'

const registerUser = async (req, res) => {
    // get the data from request
    // validate the data (check if all required fields are present)
    // check if existingUser in db
    // create a new user in db
    // remove password & refresh token from response
    // check for user creation
    // send success response

    const { username, email, password } = req.body;
    console.log(username, email, password)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const existingUser = await User.findOne(
        { 
            $or: [{username}, {email}] 
        }
    );


    if(existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            username,
            email,
            password
        });

        if(!user) {
            return res.status(400).json({ message: 'User not created' });
        }

        user.password = undefined;
        user.refreshToken = undefined;

        return res.status(201).json({ user })   

    } catch (error) {
        console.log("Error in Creating User: ", error)
    }
};

export {
    registerUser
}