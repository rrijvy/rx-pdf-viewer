import * as pdfjsLib from "pdfjs-dist";

export const testPackage = () => {
  return "Hello World!";
};

const result = testPackage();

console.log(result);

console.log(pdfjsLib);
