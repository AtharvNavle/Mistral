import { type ClassValue, clsx } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const isBrowser = () => typeof window !== "undefined";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

