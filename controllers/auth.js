const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model.js");
const {promisify} = require("util")

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password)
    {
    return res.status(400).json({
        status:"failed",
        message:"email and password are required"
    })
    }
    const user = await User.findOne({ email });
	
    if (!user || !(await bcrypt.compare(password,user.password))) {
        return res.status(400).json({
            status: "failed",
            message: "incorrect email or Password"
        });
    }

    const token = jwt.sign({ userId: user._id }, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", {
        expiresIn: "10d"
    });
    const expires =  10 * 24 * 60 * 60 * 1000;
    // const expires = 10 * 60 * 1000;
    res.status(200).json({
        status: "success",
        data: {
            token,
            id: user._id,
            expires,
        }
    })
});

exports.signup = catchAsync(async (req, res, next) => {
    let {email, name, password} = req.body;
    if (!email || !name || !password){
        return res.status(400).json({
            status:"failed",
            message:"Please enter all the fields"
        })
    }
    password = await bcrypt.hash(password, 12);
    const user = await User.create({email,name, password})
    const token = jwt.sign({ userId: user._id }, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", {
        expiresIn: "10d"
    });
    const expires =  10 * 24 * 60 * 60 * 1000;
    // const expires = 10 * 60 * 1000;
    res.status(200).json({
        status: "success",
        data: {
            token,
            id: user._id,
            expires,
        }
    })
});


exports.protect = catchAsync( async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token)
    {
        return res.status(401).json({
            status:"failed",
            message: "you are not authenticated"
        })
    }
    const decodedData = await promisify(jwt.verify)(token,"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    const {userId} = decodedData;
    const currentUser = await User.findOne({_id:userId});
    if (!currentUser){
        return res.status(404).json({
            status: "failed",
            message: "User doesn't exist"
        })
    }
    req.user = currentUser;
    next();
 });
