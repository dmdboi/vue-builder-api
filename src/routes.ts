import { Router } from "express";

import { getPageByRef, getPageHTMLByRef } from "./controllers/pages";
import ContentController from "./controllers/content";

const router = Router();

router.get("/components", ContentController.list);
router.get("/components/:id", ContentController.get);
router.get("/components/:id/html", ContentController.getHTML);
router.post("/components", ContentController.store);

router.get("/page/:ref", getPageByRef);
router.get("/page/:ref/html", getPageHTMLByRef);

export default router;
