import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  useEffect(() => {
    const loader = document.getElementById("app-loader");
    if (loader) loader.remove();
  }, []);

  return <AppRoutes />;
};

export default App;
// hi. (ur gay)