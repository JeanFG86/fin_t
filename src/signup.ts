import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

const accounts: any = [];

app.post("/signup", async (req: Request, res: Response) => {
  const input = req.body;
  const nameParts = input.name.split(" ");
  if (nameParts.length < 2) {
    return res.status(422).json({
      error: "Invalid name",
    });
  }
  const accountId = crypto.randomUUID();
  const account = {
    accountId,
    name: input.name,
    email: input.email,
    document: input.document,
    password: input.password,
  };

  accounts.push(account);
  res.json({
    accountId,
  });
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
  const accountId = req.params.accountId;
  const account = accounts.find((account: any) => account.accountId === accountId);
  res.json(account);
});
app.listen(3000);
