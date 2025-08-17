import express from "express";
import * as fileController from "../controllers/Appwrite.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

router.get("/", verifyJWT, fileController.getRecords);
router.post("/", verifyJWT, upload.single("file"), fileController.uploadFile);
router.delete("/:id", verifyJWT, fileController.deleteFile);

// Combined file view endpoint
router.get("/:id/view", (req, res) => {
  const { type } = req.query;
  if (type === "prescription") {
    return fileController.viewPres(req, res);
  }
  return fileController.viewFile(req, res);
});

// Combined file sharing endpoint
router.get("/:id/share", (req, res) => {
  const { action } = req.query;
  if (action === "link") {
    return fileController.createDownloadLink(req, res);
  }
  return fileController.downloadLink(req, res);
});

export default router;