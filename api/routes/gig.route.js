import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  getHomePageGigs,
  getMyGigs
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/homePage", getHomePageGigs);
router.get("/myGigs", getMyGigs);
router.get("/", getGigs);

export default router;
