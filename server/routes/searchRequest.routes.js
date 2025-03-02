import { Router } from "express";
import { getSearchRequest } from "../controllers/searchRequest.controller.js";


const router = Router()

router.route('/getSearchRequest').get(getSearchRequest)

export default router