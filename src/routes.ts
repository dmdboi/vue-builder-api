import { Router } from "express";

import ComponentController from "./controllers/components";
import PageController from "./controllers/pages";

const router = Router();

router.get("/components", ComponentController.list);
router.post("/components", ComponentController.store);
router.get("/components/:id", ComponentController.get);
router.get("/components/:id/html", ComponentController.getHTML);

router.get("/pages", PageController.list);
router.post("/pages", PageController.store);
router.get("/pages/:ref", PageController.get);
router.get("/pages/:ref/html", PageController.getHTML);

router.post("/templates", async (req, res) => {});

router.get("/templates/:id", async (req, res) => {
  const template = [
    {
      type: "header",
      content: [
        {
          type: "h1",
          content: ["{{title}}"],
        },
      ],
      attributes: {
        class: "blog-header",
      },
    },
    {
      type: "main",
      placeholder: "post-content",
      content: [] as any,
    },
    {
      type: "footer",
      content: [
        {
          type: "p",
          content: ["Posted on {{date}}"],
        },
      ],
      attributes: {
        class: "blog-footer",
      },
    },
  ];

  const postContent = {
    type: "post",
    content: [
      {
        type: "h2",
        content: ["{{title}}"],
      },
      {
        type: "p",
        content: ["{{content}}"],
      },
    ],
    data: {
      placeholder: "post-content",
      content: "This is the content of the post",
      title: "This is the title of the post",
    },
  };

  // Merge the template with the post content
  const mergedTemplate = template.map(block => {
    if (block.placeholder === postContent.data.placeholder) {
      block.content = postContent.content;

      delete (block as any).placeholder;
    }
    return block;
  });

  res.json(mergedTemplate);
});

export default router;
