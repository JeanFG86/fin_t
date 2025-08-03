import express, { Request, Response } from "express";
const app = express();

app.post("/signup", async (req: Request, res: Response) => {
  const accountId = crypto.randomUUID();
  res.json({
    accountId,
  });
});
app.listen(3000);
