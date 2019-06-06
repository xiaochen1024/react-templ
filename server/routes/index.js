import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("page/home", {});
});

export default router;
