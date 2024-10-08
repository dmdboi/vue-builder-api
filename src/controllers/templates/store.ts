import { Request, Response } from "express";
import ULID from "ulid";

import Template from "../../models/Template";

async function store(req: Request, res: Response) {
  // Check that type is set to "page"
  if (req.body.type !== "template") {
    res.status(400).json({
      message: "Error",
      data: "Type must be set to 'template'",
    });
  }

  // Save template to MongoDB
  const template = await Template.create({
    id: ULID.ulid(),
    ...req.body,
  });

  res.status(200).json({
    message: "Success",
    data: template,
  });
}

export default store;
