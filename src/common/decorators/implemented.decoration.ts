export const Implemented = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    if (Object.getPrototypeOf(this)[propertyKey] !== originalMethod) {
      throw new Error(
        `Method ${propertyKey} must override a superclass method`,
      );
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
};
