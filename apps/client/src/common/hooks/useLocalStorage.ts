import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Recipe } from "../../pages/CreateRecipe/utils";

type LocalStorage = {
  recipes: Recipe[];
};

export function getLocalStorage<K extends keyof LocalStorage>(
  key: K,
  defaultValue: LocalStorage[K]
): LocalStorage[K] {
  const value = tryParseJSON(localStorage.getItem(key));

  if (value) {
    return value;
  }

  return defaultValue;
}

export function setLocalStorage<K extends keyof LocalStorage>(
  key: K,
  value: LocalStorage[K]
): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalStorage<K extends keyof LocalStorage>(key: K): void {
  localStorage.removeItem(key);
}

/**
 * Think of it as a useState hook that also stores the updates in localStorage for retrieval on mount.
 */
export function useLocalStorage<K extends keyof LocalStorage>(
  key: K,
  initialValue: LocalStorage[K]
): [LocalStorage[K], Dispatch<SetStateAction<LocalStorage[K]>>] {
  const [value, setValue] = useState(() => getLocalStorage(key, initialValue));

  useEffect(() => {
    setLocalStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}

/**
 * JSON.parse() wrapper that returns the original value if it fails.
 */
export function tryParseJSON(x: string | null) {
  if (x === null) {
    return null;
  }

  try {
    return JSON.parse(x);
  } catch (e) {
    return x;
  }
}
