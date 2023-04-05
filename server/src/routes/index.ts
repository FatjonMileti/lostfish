import { Router, Request, Response, NextFunction } from "express";
const router: Router = Router();
import { csrfProtection, parseForm } from "../middleware/csrf";

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.render("index", { title: "Express" });
});

router.get("/form", csrfProtection, (req: Request, res: Response) => {
  return res.render("form", {
    csrfToken: req.csrfToken(),
    color: req.session.color,
  });
});

router.post(
  "/form",
  parseForm,
  csrfProtection,
  (req: Request, res: Response) => {
    req.session.color = req.body.favoriteColor;

    return res.render("form", {
      csrfToken: req.csrfToken(),
      color: req.session.color,
    });
  }
);

module.exports = router;
