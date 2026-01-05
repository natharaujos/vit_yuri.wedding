import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store";
import { Provider } from "react-redux";
import { LoadingProvider } from "./contexts/LoadingContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </LoadingProvider>
  </StrictMode>
);
