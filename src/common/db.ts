import { DynamoDB } from 'aws-sdk';
import { ReviewCreationError, ReviewDeletionError, ReviewNotFoundError, ReviewUpdateError } from './exception';

const dynamoDB = new DynamoDB.DocumentClient()



export const getReviewById = async (reviewId: string) => {
  const params = {
    TableName: process.env.REVIEWS_TABLE!,
    Key: { id: reviewId },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      throw new ReviewNotFoundError('Review not found');
    }
    return result.Item;
  } catch (error) {
    console.error('Error getting review:', error);
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
    await dynamoDB.put(params).promise();
    return review;
  } catch (error) {
    console.error('Error creating review:', error);
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

    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error('Error updating review:', error);
    throw new ReviewUpdateError('Failed to update review');
  }
};

export const deleteReview = async (reviewId: string) => {
  const params = {
    TableName: process.env.REVIEWS_TABLE!,
    Key: { id: reviewId },
  };

  try {
    await dynamoDB.delete(params).promise();
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new ReviewDeletionError('Failed to delete review');
  }
};