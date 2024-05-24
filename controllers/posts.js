import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find(); // find function takes time => await
        console.log(postMessages);
        // res.send('Ok!!22')
        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const createPost = async (req, res) => {
    // res.send("Post Creation");
    const post = req.body;
    const newPost = new PostMessage(post);
    try {
        await newPost.save(); // takes time => await
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}