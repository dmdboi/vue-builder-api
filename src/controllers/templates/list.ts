import { Request, Response } from "express";

import Content from "../../models/Content";

async function list(req: Request, res: Response) {
  // Find the content in MongoDB
  const data = await Content.findOne({ type: "template" });

  res.status(200).json({ message: "Success", data });
}

export default list;
