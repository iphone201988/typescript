import { NextFunction, Request, Response } from "express";
import { Job } from "../models/job.js";
import { ErroHandler } from "../utils/errorHandler.js";
import mongoose from "mongoose";
import { jobApi } from "../types/API/Job/type.js";

export async function createJob(
  req: Request<{}, {}, jobApi>,
  res: Response,
  next: NextFunction
) {
  try {
    const customerId = req.user.id;
    const role = req.user.role;
    console.log(role);
    if (role == "Driver") {
      return next(new ErroHandler("You are not able to create job", 400));
    }
    const { title, pickup, drop, amount } = req.body;
    const job = await Job.create({
      title,
      pickup,
      drop,
      amount,
      customerId,
    });
    return res.status(200).json({
      message: "Job successfully created",
      job,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateJob(
  req: Request<{ id: string }, {}, jobApi>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    if (role != "Customer") {
      return next(new ErroHandler("Only customer can update a job", 400));
    }
    const { id } = req.params;
    const { title, pickup, drop, amount } = req.body;
    let updatedData = {
      title,
      pickup,
      drop,
      amount,
    };
    // What if the job is not created by me?
    const job = await Job.findOneAndUpdate({ _id: id, userId }, updatedData, {
      new: true,
      runValidators: true,
    });
    console.log(job);
    if (!job) {
      return next(new ErroHandler("Job not found", 400));
    }
    return res.status(200).json({
      message: "Job updated",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.params);
    const userId = req.user.id;
    const role = req.user.role;
    if (role != "Customer") {
      return next(new ErroHandler("Only Customer can delete a job", 400));
    }
    const { id } = req.params;
    // What if the job is not created by me?
    const job = await Job.findOneAndUpdate(
      { _id: id, userId },
      { isDeleted: true },
      { new: true }
    );
    if (!job) {
      return next(new ErroHandler("Job not found", 400));
    }
    return res.status(200).json({
      message: "Job Delete Successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function allJob(req: Request, res: Response, next: NextFunction) {
  try {
    const role = req.user.role;
    if (role != "Driver") {
      return next(new ErroHandler("only driver have access of jobs", 400));
    }
    // What if the driver is selcted to job is completed already?
    const job = await Job.find({ isDeleted: false, taskStatus: "inprogress" });
    if (!job) {
      return next(new ErroHandler("Job not found", 400));
    }
    return res.status(200).json({
      message: "All Jobs",
      job,
    });
  } catch (error) {
    next(error);
  }
}

export async function applyJob(
  req: Request<{id:string},{},{}>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    console.log(id);
    const driverId = req.user.id;
    const role = req.user.role;
    if (role !== "Driver") {
      return next(new ErroHandler("Only driver can apply for job", 400));
    }
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErroHandler("Job not found", 400));
    }
    console.log(job.JobStatus);
    if (job.JobStatus != "available") {
      return next(new ErroHandler("job is not available", 400));
    }
    // What if driver already applied on it?
    const alreadyApplied = job.applyStatus.find((d) => d === driverId);
    if (alreadyApplied) {
      return next(new ErroHandler("you are already applied", 400));
    }
    job.applyStatus.push(driverId);
    await job.save();
    return res.status(200).json({
      message: "job applied",
      job,
    });
  } catch (error) {
    next(error);
  }
}

export async function selectDriver(
  req: Request<{},{},{}>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.query;
    const { driverId } = req.query;
    const role = req.user.role;
    console.log(role);

    if (role != "Customer") {
      return next(new ErroHandler("only customer can select the driver", 400));
    }
    const job = await Job.findById(id);
    console.log(job);
    // What if job not found?
    if (!job) {
      return next(new ErroHandler("job not found", 400));
    }
    const selectedOne = job.applyStatus.find((d) => d === driverId);
    // What if you don't find that driver here?
    if (!selectedOne) {
      return next(new ErroHandler("driver not found", 400));
    }

    job.selectedDriver = driverId;
    job.JobStatus = "unavailable";
    await job.save();

    return res.status(200).json({
      message: "driver selected",
    });
  } catch (error) {
    next(error);
  }
}

export async function taskCompleteStatus(
  req: Request<{},{},{}>,
  res: Response,
  next: NextFunction
) {
  try {
    const role = req.user.role;
    if (role != "Driver") {
      return next(new ErroHandler("only driver can do that", 400));
    }
    const { id } = req.query;
    let taskImage = null;
    if (req.file) {
      taskImage = `image/${req.file.filename}`;
    }
    // No image
    if (!taskImage) {
      return next(new ErroHandler("please enter a image", 400));
    }
    const job = await Job.findById(id);
    // no job
    if (!job) {
      return next(new ErroHandler("Job Not Found", 400));
    }
    job.taskImage = taskImage;
    job.taskStatus = "completed";
    await job.save();
    return res.status(200).json({
      message: "Task Complete",
    });
  } catch (error) {
    next(error);
  }
}

/// getJObBYId
export async function getJobById(
  req: Request<{id:string},{},{}>,
  res: Response,
  next: NextFunction
) {
  try {
    const role = req.user.role;
    if (role != "Driver") {
      return next(new ErroHandler("only driver cam get job", 400));
    }
    const { id } = req.params;
    const job = await Job.findById(id, { isDeleted: false });
    if (!job) {
      return next(new ErroHandler("job Not Found", 400));
    }
    return res.status(200).json({
      message: "Job",
      job,
    });
  } catch (error) {
    next(error);
  }
}
