import { useContext } from "react";
import { BearContext } from "../features/bear/context/BearContext";

export const useBearState = () => {
  const context = useContext(BearContext);
  if (!context) {
    throw new Error("useBearState must be used within a BearProvider");
  }
  return context;
};
