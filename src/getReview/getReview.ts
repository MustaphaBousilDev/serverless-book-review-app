import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import  { getReviewById } from '../common/db'
import { logger } from "../common/loggs";
import { generateErrorResponse } from "../common/utils";
import { ReviewNotFoundError } from "../common/exception";
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.pathParameters || !event.pathParameters.reviewId) {
      logger.warn('Missing reviewId in path parameters');
      return generateErrorResponse(400, 'Missing reviewId in path parameters');
    }

    const { reviewId } = event.pathParameters;

    try {
      const review = await getReviewById(reviewId);
      logger.info('Review retrieved successfully:', { reviewId });

      return {
        statusCode: 200,
        body: JSON.stringify(review),
      };
    } catch (error) {
      if (error instanceof ReviewNotFoundError) {
        logger.warn('Review not found:', { error, reviewId });
        return generateErrorResponse(404, 'Review not found');
      }
      throw error;
    }
  } catch (error) {
    logger.error('Unexpected error:', { error });
    return generateErrorResponse(500, 'Internal Server Error');
  }
};