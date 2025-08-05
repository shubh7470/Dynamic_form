import express from "express"
import { login } from "../controllers/superAdmin.controller.js"

const router = express.Router()

router.post("/login", login)

export default router