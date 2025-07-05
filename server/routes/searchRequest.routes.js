import { Router } from "express";
import { 
    getSearchRequest, 
    getSearchRequestById, 
    getSentimentOverTime,
    getSearchRequestByUser,
    deleteSearchById
} from "../controllers/searchRequest.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/getSearchRequest').get(VerifyJWT, getSearchRequest)
router.route('/getSearchRequestById').get(getSearchRequestById)
router.route('/getSentimentOverTime').get(VerifyJWT, getSentimentOverTime)
router.route('/getSearchRequestByUser').get(VerifyJWT, getSearchRequestByUser)
router.route('/deleteSearchById').delete(VerifyJWT, deleteSearchById)

export default router