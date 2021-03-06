import PostMessage from '../models/PostMessage.js'
import mongoose from 'mongoose'
import express from 'express'

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find()

    res.status(200).json(postMessages)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const { title, message, selectedFile, creator, tags } = req.body

  const newPost = new PostMessage({
    title,
    message,
    selectedFile,
    creator,
    tags,
  })

  try {
    await newPost.save()

    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updatePost = async (req, res) => {
  const { id: _id } = req.params
  const post = req.body

  if (!mongoose.isValidObjectId(_id))
    return res.status(404).send('No post with that id')

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  )

  res.json(updatedPost)
}

export const deletePost = async (req, res) => {
  const { id: _id } = req.params

  if (!mongoose.isValidObjectId(_id))
    return res.status(404).send('No post with that id')

  await PostMessage.findByIdAndRemove(_id)

  res.json({ message: 'Post deleted successfully.' })
}

export const likePost = async (req, res) => {
  const { id: _id } = req.params

  if (!mongoose.isValidObjectId(_id))
    return res.status(404).send('No post with that id')

  const post = await PostMessage.findById(_id)

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  )

  res.json(updatedPost)
}
