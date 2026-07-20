const express = require('express');
const {
  getPosts,
  getPost,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/admin/all', protect, admin, getAllPostsAdmin);
router.get('/', getPosts);
router.post('/', protect, admin, createPost);
router.get('/:idOrSlug', getPost);
router.put('/:id', protect, admin, updatePost);
router.delete('/:id', protect, admin, deletePost);

module.exports = router;
