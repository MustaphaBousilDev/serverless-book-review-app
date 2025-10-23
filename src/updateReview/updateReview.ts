import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { updateReview } from "../common/db";
import { logger } from "../common/loggs";
import { generateErrorResponse } from "../common/utils";
import { ReviewNotFoundError, ReviewUpdateError } from "../common/exception";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.pathParameters || !event.pathParameters.reviewId) {
      logger.warn('Missing reviewId in path parameters');
      return generateErrorResponse(400, 'Missing reviewId in path parameters');
    }

    const { reviewId } = event.pathParameters;
    const { title, content, rating } = JSON.parse(event.body || '{}');

    if (!title || !content || !rating) {
      logger.warn('Missing required fields in request body');
      return generateErrorResponse(400, 'Missing required fields');
    }

    try {
      const updatedReview = await updateReview(reviewId, { title, content, rating });
      logger.info('Review updated successfully:', { reviewId });

      return {
        statusCode: 200,
        body: JSON.stringify(updatedReview),
      };
    } catch (error) {
      if (error instanceof ReviewNotFoundError) {
        logger.warn('Review not found:', { error, reviewId });
        return generateErrorResponse(404, 'Review not found');
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof ReviewUpdateError) {
      logger.error('Error updating review:', { error, reviewId:event?.pathParameters?.reviewId });
      return generateErrorResponse(500, 'Failed to update review');
    }
    logger.error('Unexpected error:', { error });
    return generateErrorResponse(500, 'Internal Server Error');
  }
};