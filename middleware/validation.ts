import { NextFunction, Request, Response } from "express";

export const validation = (Schema:any)=>{
    return (req:Request,res:Response,next:NextFunction) =>{
        const data = {...req.body,...req.query,...req.params}
        const {error} = Schema.validate(data)
        if(error){
            return res.status(400).json({
                message:error.details[0].message
            })
        }
        next()
    }
}