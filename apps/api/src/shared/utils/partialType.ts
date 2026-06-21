/**
 * Lightweight PartialType helper.
 * Returns a new class whose every property is optional.
 * Usage: export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;

export function PartialType<T>(Base: Constructor<T>): Constructor<Partial<T>> {
  // Copy all metadata from Base to the derived class so class-validator still works
  class PartialClass extends (Base as Constructor) {}
  Object.defineProperty(PartialClass, 'name', { value: `Partial${Base.name}` });
  return PartialClass as Constructor<globalThis.Partial<T>>;
}
