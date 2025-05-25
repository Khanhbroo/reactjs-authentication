import { redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const action = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw Response.json({ message: "Unsupport mode" }, { status: 422 });
  }

  const data = await request.formData();
  const authData = Object.fromEntries(data.entries());

  const response = await fetch("http://localhost:8080/" + mode, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw Response.json(
      { message: "Could not authenticate user." },
      { status: 500 }
    );
  }

  // Soon: manage that token
  return redirect("/");
};
