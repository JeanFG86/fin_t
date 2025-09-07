import axios from "axios";

axios.defaults.validateStatus = () => true;

test("Deve criar uma conta válida", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
});

test("não deve criar uma conta válida com nome inválido", async () => {
  const inputSignup = {
    name: "John",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.error).toBe("Invalid name");
});

test("não deve criar uma conta válida com email inválido", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe",
    document: "97456321558",
    password: "asdQWE123",
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.error).toBe("Invalid email");
});

test("não deve criar uma conta válida com cpf inválido", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "974563215",
    password: "asdQWE123",
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.error).toBe("Invalid document");
});

test("não deve criar uma conta válida com password inválido", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE",
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.error).toBe("Invalid password");
});

test("Deve fazer um depósito", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const { data: outputSignup } = await axios.post("http://localhost:3000/signup", inputSignup);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 10,
  };

  await axios.post("http://localhost:3000/deposit", inputDeposit);
  const { data: outputGetAccount } = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  expect(outputGetAccount.assets).toHaveLength(1);
  expect(outputGetAccount.assets[0].assetId).toBe("BTC");
  expect(outputGetAccount.assets[0].quantity).toBe(10);
});
