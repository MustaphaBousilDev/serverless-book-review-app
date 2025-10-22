export const generateRandomId = () => {
  return Math.random().toString(36).substring(7);
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};
export const generateErrorResponse = (error: Error) => {
  return {
    error: error.name,
    message: error.message,
  };
};