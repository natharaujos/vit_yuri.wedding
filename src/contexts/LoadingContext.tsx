import { createContext, useContext, useState } from "react";
import StyledLoading from "../components/StyledLoading";

type LoadingContextType = {
  loading: boolean;
  setLoadingWithDelay: (value: boolean, delay?: number) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoadingWithDelay: () => {},
});

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setNavigationLoading] = useState(false);

  function setLoadingWithDelay(value: boolean, delay = 2000) {
    if (!value) {
      setTimeout(() => setNavigationLoading(false), delay);
    } else {
      setNavigationLoading(true);
    }
  }

  return (
    <LoadingContext.Provider value={{ loading, setLoadingWithDelay }}>
      {children}
      {loading && <StyledLoading />}
    </LoadingContext.Provider>
  );
};

const useLoading = () => useContext(LoadingContext);

export { useLoading, LoadingContext, LoadingProvider };
