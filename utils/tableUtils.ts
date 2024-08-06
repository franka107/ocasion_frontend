import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Ref } from 'vue';
import type { Updater } from '@tanstack/vue-table';

/**
 * Combina clases de Tailwind CSS utilizando clsx y tailwind-merge.
 * @param {...ClassValue[]} inputs - Las clases a combinar.
 * @returns {string} - La cadena de clases combinadas.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Actualiza el valor de un Ref utilizando un Updater.
 * @template T
 * @param {Updater<any> | any} updaterOrValue - El nuevo valor o una función Updater.
 * @param {Ref} ref - El Ref a actualizar.
 */
export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref): void {
  ref.value = typeof updaterOrValue === 'function'
    ? (updaterOrValue as Function)(ref.value)
    : updaterOrValue;
}
