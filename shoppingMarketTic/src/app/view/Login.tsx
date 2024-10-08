import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isNull } from "lodash";
import Button from "../components/Button";
import Input from "../components/Input";
import authService from "../services/auth.service";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isNull(authService.getLoggedUser())) {
      navigate("/");
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = authService.authenticate(formData);
      console.log("Ocorreu um erro ",res);
      authService.setLoggedUser(await res);
      return navigate("/");
    } catch {
      console.log("Algo deu errado");
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1>Login</h1>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <Input
          type="text"
					variant="secundary"
          placeholder="Email"
          value={formData.email}
          name="email"
          onChange={(e) => handleChange(e)}
        />
        <Input
          type="password"
					autoComplete="current-password"
					variant="secundary"
          placeholder="Senha"
          value={formData.password}
          name="password"
          onChange={(e) => handleChange(e)}
        />
        <Button type="submit">Acessar</Button>
      </form>
				<h1 className="font-bold">
					Não possui o cadastro? 
				</h1>
      <Button className="cursor-pointer" onClick={() => navigate("/register")}>
        Sign Up
      </Button>
    </div>
  );
}

export default Login;