import {Router} from "express";
import {videoController} from "./video.controller";

const videoRouter: Router = Router();

videoRouter.get("/", videoController)

export default videoRouter;