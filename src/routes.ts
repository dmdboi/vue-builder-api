import { Router } from "express";

import ComponentController from "./controllers/components";
import TemplateController from "./controllers/templates";
import PageController from "./controllers/pages";

const router = Router();

router.get("/components", ComponentController.list);
router.post("/components", ComponentController.store);
router.get("/components/:id", ComponentController.get);
router.get("/components/:id/html", ComponentController.getHTML);

router.get("/pages", PageController.list);
router.post("/pages", PageController.store);
router.get("/pages/:id", PageController.get);
router.get("/pages/:id/html", PageController.getHTML);

router.get("/templates", TemplateController.list);
router.post("/templates", TemplateController.store);
router.get("/templates/:id", TemplateController.get);
router.get("/templates/:id/html", TemplateController.getHTML);

export default router;
