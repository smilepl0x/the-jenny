export const generateRandomHexArray = () => {
  const getHex = () => Math.random() * (255 - 0);
  return [getHex(), getHex(), getHex()];
};
