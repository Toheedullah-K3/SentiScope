import User from '../models/user.model.js'

const generateAccessAndRefreshToken = async (userId) => {
    // find the user by userId
    // generate access token
    // generate refresh token
    // save refresh token in db
    // return access token and refresh token

    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.updateOne({ refreshToken });

    return { accessToken, refreshToken }
}

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
            $or: [{ username }, { email }]
        }
    );


    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            username,
            email,
            password
        });

        if (!user) {
            return res.status(400).json({ message: 'User not created' });
        }

        user.password = undefined;
        user.refreshToken = undefined;

        return res.status(201).json({ user })

    } catch (error) {
        console.log("Error in Creating User: ", error)
    }
};

const loginUser = async (req, res) => {
    // get the data from request
    // validate the username or email and password
    // check if user exists in db
    // compare the password
    // generate access and refresh token
    // remove password & refreshToken from response
    // send cookies 
    // send success response

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json({ 
            user: loggedInUser, 
            accessToken, 
            refreshToken,
            message: 'Login Successful'
        });
}



export {
    registerUser,
    loginUser
}