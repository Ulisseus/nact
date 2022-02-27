import { Fiber } from '../types';

export const isFiberOrNull = (
    variable: Fiber | null | number | number[]
): variable is Fiber | null => {
    if ((variable as any[])?.length) return false;
    return typeof variable !== 'number';
};
