const validateReview = (review: any) => {
  if (!review.title || !review.content || !review.rating) {
    throw new Error('Missing required fields');
  }
  //for more validation
};


