const { Review } = require('../models/Review');

module.exports = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!req.user || req.user.email !== 'admin' || req.user.id !== review.user_id)
      throw new Error('You do not have access to view this page');

    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
