import { Request, Response } from "express";
import ULID from "ulid";

import { buildRepeatableContent, findRepeatableContent, insertRepeatableContent } from "../../libs/template";

async function store(req: Request, res: Response) {
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
    id: ULID.ulid(),
    content: flatOutputResult,
  };

  res.status(200).json({
    message: "Success",
    data: component,
  });
}

export default store;
