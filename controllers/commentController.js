import commentModel from '../models/comment.js';
import postModel from '../models/post.js';

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    const post = await postModel.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    const comment = new commentModel({
      text,
      user: req.userId,
      post: post._id
    });

    await comment.save();
    post.comments.push(comment);
    await post.save();

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to add a comment to the post'
    });
  }
};

export const getComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await commentModel.find({ post: postId }).populate('user').exec();

    if (!comments) {
      return res.status(404).json({
        message: 'comments not found'
      });
    }

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'error getting comments'
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const removedComment = await commentModel.findByIdAndDelete(commentId);

    if (!removedComment) {
      return res.status(404).json({
        message: 'Comment not found'
      });
    }

    const postId = removedComment.post;

    const post = await postModel.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: -1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    res.json({ success: true });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to delete the comment'
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const updatedPost = await postModel.findByIdAndUpdate(commentId, {
      text: req.body.text,
    });

    if (!updatedPost) {
      return res.status(404).json({
        message: 'Article not found'
      });
    }

    res.json({ success: true });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to update the article'
    });
  }
};