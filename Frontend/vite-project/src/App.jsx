import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginButton from "./Button";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LoginButton />
    </>
  );
}

export default App;
