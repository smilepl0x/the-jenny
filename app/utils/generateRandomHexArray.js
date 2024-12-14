export const generateRandomHexArray = () => {
  const getHex = () => Math.floor(Math.random() * 255);
  return [getHex(), getHex(), getHex()];
};
