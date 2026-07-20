const asyncHandler = require('express-async-handler');
const BlogPost = require('../models/BlogPost');

// @desc  Get all published blog posts (paginated)
// @route GET /api/blog
// @access Public
const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 9, tag } = req.query;
  const query = { isPublished: true };
  if (tag) query.tags = tag;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(30, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const [posts, total] = await Promise.all([
    BlogPost.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limitNum),
    BlogPost.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
  });
});

// @desc  Get a single blog post by slug or id
// @route GET /api/blog/:idOrSlug
// @access Public
const getPost = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  const post = isObjectId
    ? await BlogPost.findById(idOrSlug)
    : await BlogPost.findOne({ slug: idOrSlug });

  if (!post || (!post.isPublished && !(req.user && req.user.role === 'admin'))) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  res.json({ success: true, data: post });
});

// @desc  Get all posts for admin (including unpublished)
// @route GET /api/blog/admin/all
// @access Private/Admin
const getAllPostsAdmin = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find().sort({ createdAt: -1 });
  res.json({ success: true, data: posts });
});

// @desc  Create a blog post
// @route POST /api/blog
// @access Private/Admin
const createPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.create(req.body);
  res.status(201).json({ success: true, data: post });
});

// @desc  Update a blog post
// @route PUT /api/blog/:id
// @access Private/Admin
const updatePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  Object.assign(post, req.body);
  const updated = await post.save();
  res.json({ success: true, data: updated });
});

// @desc  Delete a blog post
// @route DELETE /api/blog/:id
// @access Private/Admin
const deletePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }
  await post.deleteOne();
  res.json({ success: true, message: 'Blog post deleted' });
});

module.exports = { getPosts, getPost, getAllPostsAdmin, createPost, updatePost, deletePost };
