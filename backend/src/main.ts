import express, { Request, Response } from "express";
import { validateCpf } from "./validateCpf";
import pgp from "pg-promise";
import { validPassword } from "./validatePassword";
const app = express();
app.use(express.json());

//const accounts: any = [];
const connection = pgp()("postgres://postgres:123456@localhost:5435/fint");
console.log(connection);

export function isValidName(name: string) {
  return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

export function isValidEmail(email: string) {
  return email.match(/^(.+)\@(.+)$/);
}

app.post("/signup", async (req: Request, res: Response) => {
  const input = req.body;
  if (!isValidName(input.name)) {
    return res.status(422).json({
      error: "Invalid name",
    });
  }
  if (!isValidEmail(input.email)) {
    return res.status(422).json({
      error: "Invalid email",
    });
  }
  if (!validateCpf(input.document)) {
    return res.status(422).json({
      error: "Invalid document",
    });
  }
  if (!validPassword(input.password)) {
    return res.status(422).json({
      error: "Invalid password",
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

  //accounts.push(account);
  await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [
    account.accountId,
    account.name,
    account.email,
    account.document,
    account.password,
  ]);
  res.json({
    accountId,
  });
});

app.post("/deposit", async (req: Request, res: Response) => {
  try {
    const { accountId, assetId, quantity } = req.body;
    if (!accountId || !assetId || !quantity) {
      return res.status(400).json({ error: "Invalid input" });
    }
    await connection.query("INSERT INTO ccca.account_asset (account_id, asset_id, quantity) VALUES ($1, $2, $3)", [accountId, assetId, quantity]);
    res.status(201).json({ accountId, assetId, quantity });
  } catch (err: any) {
    console.error("Deposit error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/withdraw", async (req: Request, res: Response) => {
  try {
    const { accountId, assetId, quantity } = req.body;
    if (!accountId || !assetId || !quantity) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const accountAssetsData: any = await connection.query("select * from ccca.account_asset where account_id = $1 and asset_id = $2", [
      accountId,
      assetId,
    ]);
    if (!accountAssetsData || accountAssetsData.length === 0) {
      return res.status(422).json({ error: "No assets found for this account" });
    }
    const quantityAvailable = parseFloat(accountAssetsData[0].quantity) - Number(quantity);
    if (quantityAvailable < 0) {
      return res.status(422).json({ error: "Insufficient funds" });
    }
    await connection.query("UPDATE ccca.account_asset set quantity = $1 WHERE account_id = $2 AND asset_id = $3", [
      quantityAvailable,
      accountId,
      assetId,
    ]);

    res.status(201).json({ accountId, assetId, remaining: quantityAvailable });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
  const accountId = req.params.accountId;
  //const account = accounts.find((account: any) => account.accountId === accountId);
  const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
  const accountAssetsData = await connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
  accountData.assets = [];
  for (const accountAssetData of accountAssetsData) {
    accountData.assets.push({
      assetId: accountAssetData.asset_id,
      quantity: parseFloat(accountAssetData.quantity),
    });
  }
  res.json(accountData);
});
app.listen(3000);
