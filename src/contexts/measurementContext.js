import { createContext } from "react";

const measurementContext = createContext();
/* Usar contextos solo cuando varios componentes lo utilicen, porque hace 
   mas dificil la composicion de componentes */

export default measurementContext;
