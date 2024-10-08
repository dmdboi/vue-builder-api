import { Request, Response } from "express";
import ULID from "ulid";
import Content from "../../models/Content";

async function store(req: Request, res: Response) {
  // Check that type is set to "page"
  if (req.body.type !== "template") {
    res.status(400).json({
      message: "Error",
      data: "Type must be set to 'template'",
    });
  }

  // Build component content
  const component = {
    id: ULID.ulid(),
    ...req.body,
  };

  // Save template to MongoDB
  await Content.create(component);

  res.status(200).json({
    message: "Success",
    data: component,
  });
}

export default store;
