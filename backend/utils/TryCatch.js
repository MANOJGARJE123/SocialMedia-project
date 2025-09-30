const TryCatch = (handler) => {
    // Wrapper to automatically catch errors in async Express route handlers and send a 500 response

    return async(req , res ,next) =>{
        try{
            await handler(req, res, next);
        }catch(error){
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

export default TryCatch;