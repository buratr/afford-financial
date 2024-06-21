// types.ts
export interface FormulaItem {
    id: string;
    name: string;
    category: string;
    value: number | string;
  }
  
  export interface StoreState {
    formulaArr: FormulaItem[];
    setFormulaArr: (newArr: FormulaItem[]) => void;
    updateFormulaItem: (id: string, newValue: number | string) => void;
  }
  