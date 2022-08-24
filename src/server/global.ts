// https://stackoverflow.com/questions/47736473/how-to-define-global-function-in-typescript
export {}

declare global {
  function $localize (messageParts: TemplateStringsArray, ...expressions: readonly any[]): string;
}

const _global = global as any;
_global.$localize = (messageParts: TemplateStringsArray, ...expressions: readonly any[]): string => {
  let result = '';

  for (let i = 0; i < expressions.length; i++) {
    result += messageParts[i];
    result += expressions[i];
  }

  result += messageParts[messageParts.length - 1];
  return result;
};