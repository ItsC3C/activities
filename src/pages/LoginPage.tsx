import { useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (data?.user) {
      navigate("/comments");
    } else if (error) {
      console.error("Login error:", error.message);
      setErrorMsg("Login mislukt. Controleer je gegevens.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

        {errorMsg && (
          <div className="text-red-600 text-sm mb-4">{errorMsg}</div>
        )}

        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue="user1@user.be"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Wachtwoord
        </label>
        <input
          type="password"
          name="password"
          id="password"
          defaultValue="test123"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
