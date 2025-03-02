import { Router } from "express";
import { getSearchRequest } from "../controllers/searchRequest.controller.js";


const router = Router()

router.route('/getSearchRequest').post(getSearchRequest)

export default router