import { ErrorRequestHandler } from "express";

export const errorHandler:ErrorRequestHandler = (
    error,
    req,
    res,
    next
):any => {
    console.error(`Error Occured on path ${req.path}`,error);
    if(error instanceof SyntaxError){
        return res.status(400).json({
            message:"invalid json fromate . plase check your request",
        });
    }
    return res.status(500).json({
        message: "internal Server Error",
        error:error.message ||"Unknow error occurred",
    });
};