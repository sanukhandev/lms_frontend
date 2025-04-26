export const secureEncode = (value: string): string => {
  const reversed = value.split('').reverse().join('');
  const encoded = btoa(reversed);
  const random = Math.random().toString(36).substring(2, 10);
  return `${encoded}.${random}.${random}`;
};

export const secureDecode = (encodedValue: string): string | null => {
  try {
    const part = encodedValue.split('.')[0];
    const decoded = atob(part);
    return decoded.split('').reverse().join('');
  } catch {
    return null;
  }
};
