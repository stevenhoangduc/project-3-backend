const express = require("express");
const router = express.Router();

const UserModel = require("../models/user");
const Comment = require("../models/comment");

router.post ('/users/:userId/cars/:carId/comments', async function (req, res){
    try {
        const owner = await UserModel.findById(req.params.userId)
        console.log(owner)
        const car = owner.cars.id(req.params.carId)
        const newComment = await Comment.create(req.body)
        newComment.user = (req.session.user._id)
        await newComment.save ()
        console.log(car)
        car.comments.push(newComment)
        await owner.save()
        res.redirect(`/users/${owner._id}/cars/${car._id}`)
    }catch (err) {
    console.log(err);
    res.send("Error check the terminal to debug");
  }
}) 
router.delete ('/users/:userId/cars/:carId/comments/:commentId', async function (req, res){
    try {
        const owner = await UserModel.findById(req.params.userId)
        const car = owner.cars.id(req.params.carId)
        const deleteComment= await Comment.findByIdAndDelete(req.params.commentId)
        const index = car.comments.indexOf(deleteComment._id)
        car.comments.splice(index, 1)
        await owner.save()
        res.redirect(`/users/${owner._id}/cars/${car._id}`)

    }catch (err) {
    console.log(err);
    res.send("Error check the terminal to debug");
    }
})






module.exports = router;