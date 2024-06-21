// useStore.ts
import create from 'zustand';
import { FormulaItem, StoreState } from './types';

const store = create<StoreState>((set) => ({
  formulaArr: [],
  setFormulaArr: (newArr: FormulaItem[]) => set({ formulaArr: newArr }),
  updateFormulaItem: (id: string, newValue: number | string) =>
    set((state) => ({
      formulaArr: state.formulaArr.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      ),
    })),
}));

export default store;
