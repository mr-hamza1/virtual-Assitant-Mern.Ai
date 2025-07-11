

const errorMiddleware = (err, req, res, next) => {
    err.message ||= "Internal server error"
    err.statusCode ||= 500

    console.log(err)

    const response = {
        success: false,
        message: err.message,
      };
    

      return res.status(err.statusCode).json(response);
    }


const TryCatch = (passedFun) => async(req, res, next)=>{
    try {
        passedFun(req, res, next)
    } catch (error) {
        next(error)
    }
}

export {TryCatch, errorMiddleware};