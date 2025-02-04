import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface RiceLandContextType {
  riceLandId: number | null;
  setRiceLandId: (id: number | null) => void;
}

// Create the context
const RiceLandContext = createContext<RiceLandContextType | undefined>(
  undefined
);

// Define props for the provider
interface RiceLandProviderProps {
  children: ReactNode;
}

// Create the provider component
export const RiceLandProvider: React.FC<RiceLandProviderProps> = ({
  children,
}) => {
  const [riceLandId, setRiceLandId] = useState<number | null>(null);

  return (
    <RiceLandContext.Provider value={{ riceLandId, setRiceLandId }}>
      {children}
    </RiceLandContext.Provider>
  );
};

// Custom hook to use the context
export const useRiceLand = () => {
  const context = useContext(RiceLandContext);
  if (!context) {
    throw new Error("useRiceLand must be used within a RiceLandProvider");
  }
  return context;
};