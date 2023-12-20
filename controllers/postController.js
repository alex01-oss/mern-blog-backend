import postModel from '../models/post.js';
import commentModel from '../models/comment.js';

export const getAll = async (req, res) => {
  try {
    const posts = await postModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'failed to get articles'
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await postModel.find().limit(5).exec();
    const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'failed to get articles'
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const comments = await commentModel.find().limit(5).populate('user').exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Помилка при отриманні коментарів'
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    });

    if (!updatedPost) {
      return res.status(404).json({
        message: 'Article not found'
      });
    }

    res.json(updatedPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to retrieve the article'
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new postModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'failed to create article'
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const removedPost = await postModel.findByIdAndDelete(postId);

    if (!removedPost) {
      return res.status(404).json({
        message: 'Article not found'
      });
    }

    res.json({ success: true });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to delete the article'
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await postModel.findByIdAndUpdate(postId, {
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId
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