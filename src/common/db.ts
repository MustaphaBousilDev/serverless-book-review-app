import { DynamoDB } from 'aws-sdk';
import { ReviewCreationError, ReviewDeletionError, ReviewNotFoundError, ReviewUpdateError } from './exception';
import { logger } from './loggs';

const dynamoDB = new DynamoDB.DocumentClient()



export const getReviewById = async (reviewId: string) => {
  const params = {
    TableName: process.env.REVIEWS_TABLE!,
    Key: { id: reviewId },
  };

  try {
    logger.info('Getting review by ID:', { reviewId });
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      logger.warn('Review not found:', { reviewId });
      throw new ReviewNotFoundError('Review not found');
    }
    logger.info('Review retrieved successfully:', { reviewId });
    return result.Item;
  } catch (error) {
    logger.error('Error getting review:', { error, reviewId });
    throw error;
  }
};

export const createReview = async (review: any) => {
  try {
    validateReview(review);
    const params = {
      TableName: process.env.REVIEWS_TABLE!,
      Item: review,
    };
    logger.info('Creating review:', { review });
    await dynamoDB.put(params).promise();
    logger.info('Review created successfully:', { reviewId: review.id });
    return review;
  } catch (error) {
    logger.error('Error creating review:', { error, review });
    throw new ReviewCreationError('Failed to create review');
  }
};

export const updateReview = async (reviewId: string, updatedReview: any) => {
  try {
    validateReview(updatedReview);
    const updateExpression = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(updatedReview)) {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }

    const params = {
      TableName: process.env.REVIEWS_TABLE!,
      Key: { id: reviewId },
      UpdateExpression: `set ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    logger.info('Updating review:', { reviewId, updatedReview });
    const result = await dynamoDB.update(params).promise();
    logger.info('Review updated successfully:', { reviewId });
    return result.Attributes;
  } catch (error) {
    logger.error('Error updating review:', { error, reviewId, updatedReview });
    throw new ReviewUpdateError('Failed to update review');
  }
};

export const deleteReview = async (reviewId: string) => {
  const params = {
    TableName: process.env.REVIEWS_TABLE!,
    Key: { id: reviewId },
  };

  try {
    logger.info('Deleting review:', { reviewId });
    await dynamoDB.delete(params).promise();
    logger.info('Review deleted successfully:', { reviewId });
  } catch (error) {
    logger.error('Error deleting review:', { error, reviewId });
    throw new ReviewDeletionError('Failed to delete review');
  }
};