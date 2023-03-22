import express from "express"
import UserRouter from "./users/routes"

const router = express.Router()


// app.use('/', indexRouter)

router.use("/users", UserRouter)

export default router