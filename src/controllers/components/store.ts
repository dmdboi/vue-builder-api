import { Request, Response } from "express";
import { ulid } from "ulid";

import { buildRepeatableContent, findRepeatableContent, insertRepeatableContent } from "../../libs/components";
import Component from "../../models/Component";

async function store(req: Request, res: Response) {
  console.log(req.body);

  const results = await findRepeatableContent(req.body.content);

  const buildableResult = await Promise.all(results.map(async result => await buildRepeatableContent(result, req.body.data.menu)));

  // Flatten the array
  const flattened = buildableResult.flat(Infinity);

  // For each repeatable content object, insert the repeatable content into the content array
  const outputResult = await Promise.all(flattened.map(async result => await insertRepeatableContent(req.body.content, result.content, result.repeatable as string)));
  const flatOutputResult = outputResult.flat(Infinity);

  // Build component content
  const component = {
    ...req.body,
    type: "component",
    id: ulid(),
    content: flatOutputResult,
  };

  // Save the component to the database
  await Component.create(component);

  res.status(200).json({
    message: "Success",
    data: component,
  });
}

export default store;
