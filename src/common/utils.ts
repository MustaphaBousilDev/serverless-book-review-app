import { APIGatewayProxyResult } from "aws-lambda";

export const generateRandomId = () => {
  return Math.random().toString(36).substring(7);
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};
export const generateErrorResponse = (statusCode: number, message: string): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify({ message }),
  };
};