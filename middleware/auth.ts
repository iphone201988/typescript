import JWT from "jsonwebtoken"
import { ErroHandler } from "../utils/errorHandler.js"
import { NextFunction, Request, Response } from "express";

export const auth = (req:Request, res:Response,next:NextFunction) => {
    try {
        const authHeader = req.headers.authorization
    if(!authHeader){
        return next(new ErroHandler("authHeader is missing", 400))
    }

    const parts = authHeader.split(" ")
    if(parts.length !== 2 || parts[0] !== "Bearer"){
        return next(new ErroHandler("auth format is incorrect", 400))
    }

    const token = parts[1]
    if(!token){
        return next(new ErroHandler("Token is missing", 400))
    }

    const decode = JWT.verify(token,process.env.SECRET as string)
    req.user = decode
    next()

    } catch (error) {
        next(error)
    }
}