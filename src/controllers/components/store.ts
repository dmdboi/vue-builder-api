import { Request, Response } from "express";
import { ulid } from "ulid";

import { buildRepeatableContent, findRepeatableContent, insertRepeatableContent } from "../../libs/components";
import Component from "../../models/Component";

async function store(req: Request, res: Response) {
  // Build component content
  const component = {
    ...req.body,
    type: "component",
    id: ulid(),
  };

  // Save the component to the database
  await Component.create(component);

  res.status(200).json({
    message: "Success",
    data: component,
  });
}

async function update(req: Request, res: Response) {
  const payload = req.body;

  await Component.updateOne(
    { id: req.params.id },
    {
      $set: payload,
    }
  );

  res.status(200).json({
    message: "Success",
    data: payload,
  });
}

export { store, update };
