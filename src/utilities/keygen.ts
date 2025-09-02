const alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateCode = (length = 7): string => {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return result;
};
