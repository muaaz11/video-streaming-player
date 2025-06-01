import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {User} from '../models/user.model.js'
import { uploadFile } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation -- not empty
    // check if user already exst: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password from refresh token field from response
    // check for user creation
    // return response

    const { username, fullname, email, password } = req.body

    // if (username === "" || fullname === "" || email === "" || password === "") {
    //     throw ApiError(400, "all fields are required")
    // }

    // validation


    if (
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all fields required")
    }

    if (!email.includes("@")) {
        throw new ApiError(400, "email is not valid")
        
    }

    if(!password.length() === 8){
        throw new ApiError(400, "password must be 8 characters long")
    }

    // check if user already exst: username, email

    const existedUser = User.findOne({
        $or: [{email}, {username}]
    })
    
    if (existedUser.email) {
        throw new ApiError(409, "username and email already exist")
    }

    // const existedEmail = await User.findOne({ email });
    // const existedUsername = await User.findOne({ username });

    // if (existedEmail && existedUsername) {
    //     throw new ApiError(409, "Both username and email already exist");
    // } else if (existedEmail) {
    //     throw new ApiError(409, "Email already exists");
    // } else if (existedUsername) {
    //     throw new ApiError(409, "Username already exists");
    // }

    // check for images, check for avatar

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    // upload them to cloudinary, avatar

    const avatar = await uploadFile(avatarLocalPath)
    const coverImage = await uploadFile(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar is required")
    }

    // create user object - create entry in db

    const user = await User.create({
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    })

    // remove password from refresh token field from response

    const userCreated = await User.findOne(user._id).select(
        "-password -refreshToken" 
    )

    if(!userCreated){
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return ApiResponse.status(201).json(    
        new ApiResponse(200, userCreated, "User Registered successfully")
    )







})



export {
    registerUser,
}