import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { generateErrorResponse, generateRandomId } from "../common/utils";
import { createReview } from "../common/db";
import { logger } from "../common/loggs";
import { ReviewCreationError } from "../common/exception";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = event.body;
    if (!requestBody) {
      logger.warn('Request body is missing');
      return generateErrorResponse(400, 'Le corps de la requête est manquant');
    }

    const { title, content, rating } = JSON.parse(requestBody);
    const review = {
      id: generateRandomId(),
      title,
      content,
      rating,
      createdAt: new Date().toISOString(),
    };

    try {
      validateReview(review);
    } catch (error) {
      logger.warn('Invalid review data:', { error, review });
      return generateErrorResponse(400, 'Champs requis manquants');
    }

    await createReview(review);
    logger.info('Review created successfully:', { reviewId: review.id });

    return {
      statusCode: 201,
      body: JSON.stringify(review),
    };
  } catch (error) {
    if (error instanceof ReviewCreationError) {
      logger.error('Error creating review:', { error });
      return generateErrorResponse(500, 'Failed to create review');
    }
    logger.error('Unexpected error:', { error });
    return generateErrorResponse(500, 'Internal Server Error');
  }
};