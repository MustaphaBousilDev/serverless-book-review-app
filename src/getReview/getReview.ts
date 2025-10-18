import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import  { getReviewById } from '../common/db'
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters || !event.pathParameters.reviewId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing reviewId in path parameters' }),
    };
  }
  const { reviewId } = event.pathParameters;
  

  const review = await getReviewById(reviewId);
  

  return {
    statusCode: 200,
    body: JSON.stringify(review),
  };
};