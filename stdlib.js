window.__stdlib = {
  index: 0,
  ptrs: {}
};

export type char = string;

export type int = number;
export type long = number;

export type float = number;
export type double = number;

export type size_t = number;

export type div_t = {
  quot: int;
  rem: int;
};

export type ldiv_t = {
  quot: long;
  rem: long;
};

export type ptr<T> = {
  idx: number | null;
  value: T | null;
  size: size_t;
};

export type const_ptr<T> = {
  idx: number | null;
  value: T | null;
  size: size_t;
  const: true;
};

export const RAND_MAX = 32767;

function __ischar(value: any): value is char {
  return typeof value === 'string' && value.length === 1;
}

function __isstring(value: any): value is string {
  return typeof value === 'string';
}

function __isnumber(value: any): value is number {
  return typeof value === 'number';
}

function __make_ptr<T>(str: T): ptr<T> {
  const target = window.__stdlib.ptrs[window.__stdlib.index++] = {
    idx: window.__stdlib.index - 1,
    value: str,
    size: str.length ?? 0
  };

  return new Proxy(target, {
    set(target, p, newValue) {
      target[p] = newValue;
      return true;
    },
    get(target, p) {
      return target[p];
    }
  });
}

function __make_constptr<T>(ptr: ptr<T>): const_ptr<T> {
  const target = window.__stdlib.ptrs[window.__stdlib.index++] = {
    idx: window.__stdlib.index - 1,
    value: ptr.value,
    size: ptr.size,
    const: true as const
  };

  return new Proxy(target, {
    set(target, p, newValue) {
      throw Error('Cannot change value of const pointer.');
    },
    get(target, p) {
      if (p !== 'value') throw Error('Cannot get other property than value of pointer.');
      return target[p];
    }
  });
}

function __resize_ptr<T>(ptr: ptr<T>, size: size_t): ptr<T> {
  if (ptr.size > size) {
    throw Error('Cannot resize pointer to a smaller size.');
  }
  ptr.size = size;
  ptr.value = ptr.value.concat(new Array(size - ptr.value.length).fill(0));
  return ptr;
}

function __check_ptr_size<T>(ptr: ptr<T>, size: size_t): boolean {
  return ptr.size >= size;
}

function __ptr_size_without_null<T>(ptr: ptr<T>): size_t {
  return ptr.value.filter(e => !!e).length;
}

function __check_ptr_size_without_null<T>(ptr: ptr<T>, size: size_t): boolean {
  return __ptr_size_without_null(ptr) >= size;
}

/**
 * Inserts a string into a pointer by replacing part of the current value, starting at the specified index.
 * @param ptr The pointer to insert the string into.
 * @param str The string to insert.
 */
function __insert_by_replace<T>(ptr: ptr<T>, str: any[] | string) {
  const split_value = __isstring(str) ? str.split('') : str;
  const split_size = split_value.length;

  // Partially replace the ptr.value from the beginning up to the length of the split_value.
  // Keep the rest of the ptr.value.
  ptr.value = split_value.concat(ptr.value.slice(split_size));
}

/**
 * Inserts a string into a pointer by replacing part of the current value, starting at the beginning.
 * @param ptr The pointer to insert the string into.
 * @param str The string to insert.
 * @param index The index to start inserting the string at.
 */
function __insert_by_replace_indexed<T>(ptr: ptr<T>, str: string, index: number) {
  const split_value = str.split('');
  const split_size = split_value.length;

  // Partially replace the ptr.value from the index up to the length of the split_value.
  // Keep the beginning and the rest of the ptr.value.
  ptr.value = ptr.value.slice(0, index).concat(split_value).concat(ptr.value.slice(index + split_size));
}

export function sizeof(ptr: ptr<string> | string): size_t {
  if (__isstring(ptr)) return ptr.length;
  return ptr.size;
}

export function printf(fmt: string, ...args: any[]): void {
  let i = 0;
  const result = fmt.replace(/%[sdf]/g, match => {
    let arg = args[i++];
    switch (match) {
      case '%s':
        return String(arg);
      case '%d':
        return (parseInt(arg) || 0).toString();
      case '%f':
        return parseFloat(arg).toFixed(2).toString();
      case '%u':
        return Math.min(0, parseInt(arg) || 0).toString();
      default:
        return match;
    }
  });
  console.log(result);
}

export function putchar(char: number | char): void {
  if (__isnumber(char)) char = String.fromCharCode(char);
  if (!__ischar(char)) throw Error('Expected char got string.');
  console.log(char);
}

export function puts(str: string): void {
  console.log(str);
}

export function snprintf(destination: ptr<string>, size: size_t, fmt: string, ...args: any[]): void {
  let i = 0;
  const result = fmt.replace(/%[sdf]/g, match => {
    let arg = args[i++];
    switch (match) {
      case '%s':
        return String(arg);
      case '%d':
        return (parseInt(arg) || 0).toString();
      case '%f':
        return parseFloat(arg).toFixed(2).toString();
      case '%u':
        return Math.min(0, parseInt(arg) || 0).toString();
      default:
        return match;
    }
  });
  __insert_by_replace(destination, result.slice(0, size));
}

export function sprintf(destination: ptr<string>, fmt: string, ...args: any[]): void {
  let i = 0;
  const result = fmt.replace(/%[sdf]/g, match => {
    let arg = args[i++];
    switch (match) {
      case '%s':
        return String(arg);
      case '%d':
        return (parseInt(arg) || 0).toString();
      case '%f':
        return parseFloat(arg).toFixed(2).toString();
      case '%u':
        return Math.min(0, parseInt(arg) || 0).toString();
      default:
        return match;
    }
  });
  __insert_by_replace(destination, result);
}

/**
 * Returns the absolute (positive) value of a number.
 * @param number Required. Specifies a number.
 * @returns An ```int``` value.
 */
export function abs(number: int): int {
  return Math.abs(number);
}

/**
 * Reads a representation of a number from a string and returns its value.
 * @param str A string containing a representation of a number.
 * @returns A ```float``` value containing the number represented by the string.
 */
export function atof(str: string): float {
  return Number.parseFloat(str);
}

/**
 * Reads a representation of a whole number from a string and returns its value.
 * @param str A string containing a representation of a whole number.
 * @returns An ```int``` value containing the number represented by the string.
 */
export function atoi(str: string): int {
  return Number.parseInt(str);
}

export function atol(str: string): long {
  return Number.parseInt(str);
}

export function calloc<T>(nmemb: size_t): ptr<T> {
  return __make_ptr(new Array(nmemb).fill(0)) as ptr<T>;
}

export function malloc<T>(size: size_t): ptr<T> {
  return __make_ptr(Array.from({ length: size }).map(rand)) as ptr<T>;
}

/**
 * Changes the size of a block of memory and returns a pointer to the block of memory.
 * If there is not enough memory at the current location then the block of memory will be moved to a different location and a different pointer will be returned.
 * @param ptr Specifies a block of memory to be reallocated.
 * @param size Specifies the new size of the block of memory measured in bytes.
 * @returns A pointer to the block of memory.
 */
export function realloc<T>(ptr: ptr<T>, size: size_t): ptr<T> {
  return __resize_ptr(ptr, size);
}

/**
 * Deallocates dynamic memory.
 * Dynamic memory is memory which was allocated by the ```malloc()```, ```calloc()``` or ```realloc()``` functions.
 * @param ptr A pointer to a block of dynamic memory.
 */
export function free<T>(ptr: ptr<T>): void {
  delete window.__stdlib.ptrs[ptr.idx];
  ptr.idx = null;
  ptr.value = null;
  ptr.size = 0;
}

/**
 * Does an integer division and returns a structure with the quotient and remainder.
 * @param dividend Required. The dividend of the division.
 * @param divisor Required. The divisor of the division.
 * @returns A ```div_t``` structure with ```int``` members.
 */
export function div(dividend: int, divisor: int): div_t {
  return {
    quot: Math.floor(dividend / divisor),
    rem: dividend % divisor
  };
}

/**
 * Does an integer division and returns a structure with the quotient and remainder.
 * @param dividend Required. The dividend of the division.
 * @param divisor Required. The divisor of the division.
 * @returns A ```ldiv_t``` structure with ```long``` members.
 */
export function ldiv(dividend: long, divisor: long): ldiv_t {
  return {
    quot: Math.floor(dividend / divisor),
    rem: dividend % divisor
  };
}

/**
 * Returns a random non-negative integer.
 * @returns An ```int``` value representing a random integer.
 */
export function rand(): int {
  return Math.floor(Math.random() * (RAND_MAX + 1));
}

/**
 * Returns a pointer to the first occurrence of the character c in the first n bytes of the object pointed to by s.
 * @param pointer Required. A pointer to the block of memory to search in.
 * @param value Required. The value to search for.
 * @param size Required. The size of the block of memory to search in.
 * @returns A void type pointer to the position in memory where the value was found or a NULL pointer if the value was not found.
 */
export function memchr(pointer: const_ptr<string>, value: char, size: size_t): ptr<char> {
  const idx = pointer.value.indexOf(value);
  return __make_ptr(pointer.value.slice(idx, idx + size));
}

/**
 * Copies data from one string into the memory of another string.
 * @param destination Required. A pointer to the string to be copied to.
 * @param source Required. A pointer to the string being copied.
 * @returns A ```char``` type pointer to the destination string.
 */
export function strcpy(destination: ptr<string>, source: ptr<string> | string): ptr<string> {
  if (__isstring(source)) source = __make_ptr(source);
  __insert_by_replace(destination, source.value);
  return destination;
}

/**
 * Copies the first ```n``` characters from one string into the memory of another string.
 * @param destination Required. A pointer to the string to be copied to.
 * @param source Required. A pointer to the string being copied.
 * @param n Required. The number of characters to be copied.
 * @returns A ```char``` type pointer to the destination string.
 */
export function strncpy(destination: ptr<string>, source: ptr<string> | string, n: size_t): ptr<string> {
  if (__isstring(source)) source = __make_ptr(source);
  __insert_by_replace(destination, source.value.slice(0, n));
  return destination;
}

/**
 * Returns the length of a string, which is the number of characters up to the first null terminating character.
 * @param str Required. A string to measure the length of.
 * @returns An integer representing the length of the string.
 */
export function strlen(str: ptr<string>): size_t {
  return str.value.length;
}

/**
 * Sets all of the bytes in a block of memory to the same value.
 * @param destination Pointer to the object to fill.
 * @param ch Fill byte.
 * @param size Number of bytes to fill.
 */
export function memset(destination: ptr<string>, ch: char, size: size_t): void {
  __insert_by_replace(destination, new Array(size).fill(ch));
}

export function strcat(destination: ptr<string>, source: ptr<string> | string): void {
  if (__isstring(source)) source = __make_ptr(source);
  if (!__check_ptr_size_without_null(destination, __ptr_size_without_null(destination) + __ptr_size_without_null(source))) throw Error('Destination pointer is too small.');
  destination.value = destination.value.concat(source.value);
}
