import { gaussian } from "./gaussian";
import { Data } from "../types";

export const generateData = (mean: number, sigma: number) => {
    const data: Data[] = [];
    const step = 0.1; // Step size for smooth curve
    for (let i = mean - 3 * sigma; i <= mean + 3 * sigma; i += step) {
      const q = i;
      const p = gaussian(q, mean, sigma);
      data.push({ q, p });
    }
    return data;
  };
  