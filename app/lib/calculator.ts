const operators: { [key: string]: (a: number, b: number) => number } = {
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
    '*': (a: number, b: number) => a * b,
    '/': (a: number, b: number) => a / b,
    '^': (a: number, b: number) => Math.pow(a, b)
  };
  
  const precedence: { [key: string]: number } = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3
  };
  
  const toPostfix = (infix: string): (number | string)[] => {
    let outputQueue: (number | string)[] = [];
    let operatorStack: string[] = [];
  
    let tokens = infix.match(/\d+|[+\-*/^()]/g);
  
    if (tokens) {
      for (let token of tokens) {
        if (!isNaN(Number(token))) {
          outputQueue.push(Number(token));
        } else if (token in operators) {
          while (
            operatorStack.length > 0 &&
            precedence[operatorStack[operatorStack.length - 1]] >= precedence[token] &&
            operatorStack[operatorStack.length - 1] !== '('
          ) {
            outputQueue.push(operatorStack.pop()!);
          }
          operatorStack.push(token);
        } else if (token === '(') {
          operatorStack.push(token);
        } else if (token === ')') {
          while (operatorStack[operatorStack.length - 1] !== '(') {
            outputQueue.push(operatorStack.pop()!);
          }
          operatorStack.pop();
        }
      }
    }
  
    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop()!);
    }
  
    return outputQueue;
  };
  
  const evaluatePostfix = (postfix: (number | string)[]): number => {
    let stack: number[] = [];
  
    for (let token of postfix) {
      if (typeof token === 'number') {
        stack.push(token);
      } else if (token in operators) {
        let b = stack.pop()!;
        let a = stack.pop()!;
        stack.push(operators[token](a, b));
      }
    }
  
    return stack[0];
  };
  
  export default function solveEquation(equation: string): number {
    const postfix = toPostfix(equation);
    return evaluatePostfix(postfix);
  }
  