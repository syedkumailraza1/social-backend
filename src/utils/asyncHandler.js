const asyncHandler =  (fn)=>{
    async(req, req, next)=>{
        try {
            await fn (req, req, next)
        } catch (err) {
            res.status(err.code || 500).json({success: false, message: err.message  })
        }
    }
}

export default asyncHandler