import { Document } from "mongoose";

export interface JobType extends Document{
    title:string,
    pickup:string,
    drop:string,
    amount:number,
    customerId:any,
    selectedDriver:any,
    applyStatus:[string],
    JobStatus:string,
    taskStatus:string,
    taskImage:string,
    isDeleted:boolean
}