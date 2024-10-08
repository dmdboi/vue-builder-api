import { Request, Response } from "express";

import Content from "../../models/Component";

async function list(req: Request, res: Response) {
  const type = req.params.type;

  // Find all content in MongoDB
  const data = await Content.find({ type: type });

  res.status(200).json({ message: "Success", data });
}

export default list;