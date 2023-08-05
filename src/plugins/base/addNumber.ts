import { getA } from "./getA";
/**
 * this is addNumber
 * @param a 
 * @param b 
 * @returns 
 */

export function addNumber(a: number, b: number): number {
  return a + b + getA();
}