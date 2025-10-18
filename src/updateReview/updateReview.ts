import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { updateReview } from "../common/db";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.pathParameters || !event.pathParameters.reviewId) {
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing reviewId in path parameters' }),
    };
    }
    
  const { reviewId } = event.pathParameters;
  

  const { title, content, rating } = JSON.parse(event.body || '{}');
  if (!title || !content || !rating) {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Missing required fields' }),
  };
  
}
  

  const updatedReview = await updateReview(reviewId, { title, content, rating });
  

  return {
    statusCode: 200,
    body: JSON.stringify(updatedReview),
  };
};