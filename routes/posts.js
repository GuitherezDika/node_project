import express from 'express';
import { getPostsBySearch, getPosts, createPost, updatePost, deletePost, likePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js'
const router = express.Router();

router.get('/search', getPostsBySearch);// router + controller
router.get('/', getPosts);// router + controller
router.post('/', auth, createPost);
// web -> user bisa liat semua data post, tapi kalau belum login tidak bisa edit/ create / delete / like post transaksi
// auth dipasang dengan createPost
router.patch('/:id', auth, updatePost); // ":id" = parameter
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
// jika auth di defenisikan sebelum controller --> 
// middleware bisa langsung di populasiin pada controller didalam REQUEST
// misal "userId"
export default router;