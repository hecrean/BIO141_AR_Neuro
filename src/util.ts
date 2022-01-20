export type RecordableKeys<T> = {
    // for each key in T
    [K in keyof T]: T[K] extends string | number | symbol
        ? // Yes, return the key itself
          K
        : // No. Return `never`
          never;
}[keyof T]; // Get a union of the values that are not `never`.

export function toRecord<T extends { [P in RecordableKeys<T>]: string | number | symbol }, K extends RecordableKeys<T>>(
    array: T[],
    selector: K,
): Record<T[K], T> {
    return array.reduce((acc, item) => ({ ...acc, [item[selector]]: item }), {} as Record<T[K], T>);
}

//   interface Person {
//     name: string,
//     age: number
//     sibling?: Person
//   }

//   const input: Person[] = [ { name: 'Alice', age: 12 }, { name: 'Bob', age: 27 } ]
//   const output = toRecord(input, 'name')