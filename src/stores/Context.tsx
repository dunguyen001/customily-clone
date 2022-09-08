import { useReducer } from "react";
import { CanvasContext, canvasInitialState, CanvasReducer } from "./CanvasContext";

export const GlobalContext = ({ children }: { children: any }) => {
  const [canvasState, canvasDispatch] = useReducer(
    CanvasReducer,
    canvasInitialState,
  );
  return (
    <CanvasContext.Provider
      value={{
        state: canvasState,
        dispatch: canvasDispatch,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};