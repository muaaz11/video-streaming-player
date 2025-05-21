
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise
            .resolve(requestHandler(res, req, next))
            .reject((error) => next(error))
    }
}


export { asyncHandler }

// const asyncHandler = (fn) => async (res, req, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500), json({
//             success: false,
//             message: error.message
//         })

//     }
// }