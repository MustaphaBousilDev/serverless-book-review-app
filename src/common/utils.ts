export const generateRandomId = () => {
  return Math.random().toString(36).substring(7);
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};