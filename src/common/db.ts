import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient()

const getReviewById = async (reviewId: string) => {
    const params = {
        TableName: process.env.REVIEW_TABLE,
        Key: { id: reviewId }
    }

    try {
        const result = await dynamoDB.get(params).promise();
        return result.Item;
    } catch (error) {
        console.error('Error getting review:', error);
        throw error;
    }
}

export const createReview = async (review: any) => {
  const params = {
    TableName: process.env.REVIEWS_TABLE,
    Item: review,
  };

  try {
    await dynamoDB.put(params).promise();
    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (reviewId: string, updatedReview: any) => {
  const params = {
    TableName: process.env.REVIEWS_TABLE,
    Key: { id: reviewId },
    UpdateExpression: 'set #title = :title, #content = :content, #rating = :rating',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#content': 'content',
      '#rating': 'rating',
    },
    ExpressionAttributeValues: {
      ':title': updatedReview.title,
      ':content': updatedReview.content,
      ':rating': updatedReview.rating,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  const params = {
    TableName: process.env.REVIEWS_TABLE,
    Key: { id: reviewId },
  };

  try {
    await dynamoDB.delete(params).promise();
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};