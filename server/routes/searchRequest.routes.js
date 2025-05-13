import { Router } from "express";
import { getSearchRequest } from "../controllers/searchRequest.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/getSearchRequest').get(VerifyJWT, getSearchRequest)

export default router