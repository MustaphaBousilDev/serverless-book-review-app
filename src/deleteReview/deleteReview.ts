import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

import { deleteReview } from "../common/db";
import { logger } from "../common/loggs";
import { generateErrorResponse } from "../common/utils";
import { ReviewDeletionError, ReviewNotFoundError } from "../common/exception";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.pathParameters || !event.pathParameters.reviewId) {
      logger.warn('Missing reviewId in path parameters');
      return generateErrorResponse(400, 'Missing reviewId in path parameters');
    }

    const { reviewId } = event.pathParameters;

    try {
      await deleteReview(reviewId);
      logger.info('Review deleted successfully:', { reviewId });

      return {
        statusCode: 204,
        body: '',
      };
    } catch (error) {
      if (error instanceof ReviewNotFoundError) {
        logger.warn('Review not found:', { error, reviewId });
        return generateErrorResponse(404, 'Review not found');
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof ReviewDeletionError) {
      logger.error('Error deleting review:', { error, reviewId: event?.pathParameters?.reviewId });
      return generateErrorResponse(500, 'Failed to delete review');
    }
    logger.error('Unexpected error:', { error });
    return generateErrorResponse(500, 'Internal Server Error');
  }
};