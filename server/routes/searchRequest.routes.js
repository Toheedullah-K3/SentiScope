import { Router } from "express";
import { getSearchRequest, getSearchRequestById } from "../controllers/searchRequest.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/getSearchRequest').get(VerifyJWT, getSearchRequest)
router.route('/getSearchRequestById').get(getSearchRequestById)


export default router