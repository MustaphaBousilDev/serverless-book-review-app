import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

import { deleteReview } from "../common/db";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
if (!event.pathParameters || !event.pathParameters.reviewId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing reviewId in path parameters' }),
    };
  }
  const { reviewId } = event.pathParameters;
  

  await deleteReview(reviewId);

  return {
    statusCode: 204,
    body: '',
  };
};