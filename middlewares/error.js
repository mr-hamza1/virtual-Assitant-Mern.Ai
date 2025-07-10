



const TryCatch = (passedFun) => async(req, res, next)=>{
    try {
        passedFun(req, res, next)
    } catch (error) {
        next(error)
    }
}

export {TryCatch};