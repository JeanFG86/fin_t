import { validPassword } from "../../src/validatePassword";

describe("", () => {
  it("Deve validar a senha", () => {
    const password = "asdQWE123";
    const isValid = validPassword(password);
    expect(isValid).toBe(true);
  });

  test.each(["asd", "asqexsd", "ASAFEWTRE", "32143543"])("Não deve validar a senha", (password: string) => {
    const isValid = validPassword(password);
    expect(isValid).toBe(false);
  });
});
