export const success = (body: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};

export const error = (statusCode: number, message: string) => {
  return {
    statusCode,
    body: JSON.stringify({ message }),
  };
};