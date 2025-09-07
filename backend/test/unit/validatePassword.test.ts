import { validPassword } from "../../src/validatePassword";

describe("", () => {
  it("Deve validar a senha", () => {
    const password = "asdQWE123";
    const isValid = validPassword(password);
    expect(isValid).toBe(true);
  });
});
