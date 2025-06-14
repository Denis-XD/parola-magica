import { create } from 'zustand';

export const useProgreso = create((set) => ({
  progreso: {
    Animali: [],
    Colori: [],
    Casa: [],
    Vestiti: [],
  },
  completar: (categoria, palabra) =>
    set((state) => {
      const actual = state.progreso[categoria] || [];
      const nuevo = [...new Set([...actual, palabra])];
      return {
        progreso: {
          ...state.progreso,
          [categoria]: nuevo
        }
      };
    }),
}));
