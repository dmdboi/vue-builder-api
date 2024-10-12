import { Router } from "express";

import ComponentController from "./controllers/components";
import TemplateController from "./controllers/templates";
import PageController from "./controllers/pages";

import { validator } from "./middleware/validator";

import { CreateComponentValidator, UpdateComponentValidator } from "./validators/ComponentValidators";
import { CreatePageValidatora, UpdatePageValidator } from "./validators/PageValidators";
import { CreateTemplateValidator } from "./validators/TemplateValidators";
import SiteController from "./controllers/sites";
import { CreateSiteValidator, UpdateSiteValidator } from "./validators/SiteValidators";

const router = Router();

router.post("/site", validator(CreateSiteValidator), SiteController.store);
router.get("/site/:id", SiteController.get);
router.put("/site/:id", validator(UpdateSiteValidator), SiteController.update);
router.get("/site/:id/html", SiteController.getHTML);

router.get("/components", ComponentController.list);
router.post("/components", validator(CreateComponentValidator), ComponentController.store);
router.get("/components/:id", ComponentController.get);
router.put("/components/:id", validator(UpdateComponentValidator), ComponentController.update);
router.get("/components/:id/html", ComponentController.getHTML);

router.get("/pages", PageController.list);
router.post("/pages", validator(CreatePageValidatora), PageController.store);
router.get("/pages/:id", PageController.get);
router.put("/pages/:id", validator(UpdatePageValidator), PageController.update);
router.get("/pages/:id/html", PageController.getHTML);

router.get("/templates", TemplateController.list);
router.post("/templates", validator(CreateTemplateValidator), TemplateController.store);
router.get("/templates/:id", TemplateController.get);
router.get("/templates/:id/html", TemplateController.getHTML);

export default router;
