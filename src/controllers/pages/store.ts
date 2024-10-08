import { Request, Response } from "express";
import ULID from "ulid";
import Page from "../../models/Page";

async function store(req: Request, res: Response) {
  // Check that type is set to "page"
  if (req.body.type !== "page") {
    res.status(400).json({
      message: "Error",
      data: "Type must be set to 'page'",
    });
  }

  // Build component content
  const component = {
    id: ULID.ulid(),
    ...req.body,
  };

  // Save page to MongoDB
  await Page.create(component);

  res.status(200).json({
    message: "Success",
    data: component,
  });
}

export default store;
