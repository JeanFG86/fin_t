import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function confirm() {
    try {
      console.log("Enviando requisição...");

      const input = {
        name,
        email,
        document,
        password,
      };

      console.log("Dados a enviar:", input);

      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      console.log("Status da resposta:", response.status);
      console.log("Response OK:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resposta do backend:", data);

      setMessage("success");
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  function fill() {
    setName("John Doe");
    setEmail("john.doe@gmail.com");
    setDocument("97456321558");
    setPassword("asdQWE123");
  }

  return (
    <div>
      <div>
        <input className="input-name" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <input className="input-email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <input className="input-document" placeholder="Documento" value={document} onChange={(e) => setDocument(e.target.value)} />
      </div>
      <div>
        <input className="input-password" placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <span className="span-message">{message}</span>
      </div>
      <button className="button-fill" onClick={fill}>
        Fill
      </button>
      <button className="button-confirm" onClick={confirm}>
        Confirm
      </button>
    </div>
  );
}

export default App;
