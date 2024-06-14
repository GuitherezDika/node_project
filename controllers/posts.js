import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find(); // find function takes time => await
        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// QUERY + value = /posts/page=2 -> "page=2"
// PARAMS: value = /posts/3 -> "3"
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i')
        // semua query text misal "Makan", MAKAN, makan, mAKaN => semua -> 'makan'
        // mempermudah pencarian
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] })
        // pencarian data pada TITLE ataupun TAGS -> $or

        res.json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    // setelah client set API Interceptor
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    // PostMessage = model
    try {
        await newPost.save(); // takes time => await
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

// PARAMS: value = /posts/3 -> "3"
export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    // _id sebagai alias dan dipakai pada code di bawah ini
    const post = req.body; // client

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    res.json(updatedPost)
}

// PARAMS: value = /posts/3 -> "3"
export const deletePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('No post with that id');

    // await PostMessage.findByIdAndRemove(_id);
    await PostMessage.findByIdAndDelete(_id);

    res.json({ message: "Post deleted successfully!" });
}

// PARAMS: value = /posts/3 -> "3"
export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) return res.json({ message: "Unauthenticated" })
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('No post with that id');
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex(id => id === String(req.userId));
    if (index == -1) {
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter(id => id !== String(req.userId))
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    // const updatedPost = await PostMessage.findByIdAndUpdate(id, {likeCount: post.likeCount + 1}, {new: true});

    res.json(updatedPost)
}