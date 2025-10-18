import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { generateRandomId } from "../common/utils";
import { createReview } from "../common/db";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const requestBody = event.body;
   if (!requestBody) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Le corps de la requête est manquant' }),
    };
  }
    const { title, content, rating } = JSON.parse(requestBody);
    if (!title || !content || !rating) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Champs requis manquants' }),
    };
  }
  

  const review = {
    id: generateRandomId(),
    title,
    content,
    rating,
    createdAt: new Date().toISOString(),
  };
  

  await createReview(review);
  

  return {
    statusCode: 201,
    body: JSON.stringify(review),
  };
};