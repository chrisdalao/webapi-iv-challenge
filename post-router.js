const express = require('express');

const Posts = require('./data/db.js');

const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    const postData = req.body;
    if (!postData.title || !postData.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        Posts.insert(postData)
            .then(post => {
                if (post) {
                    res.status(201).json(postData)
                }
            })
            .catch(err => {
                err = { error: "There was an error while saving the post to the database" };
                res.status(500).json(err)
            })
    }
})

router.post('/:id/comments', (req, res) => {
    const { text } = req.body;
    const post_id = parseInt(req.params.id);
    const postComment = ({ text, post_id })
    if (!postComment.post_id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else if (!postComment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Posts.insertComment(postComment)
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                err = { error: "There was an error while saving the comment to the database" };
                res.status(500).json(err)
            })
    }
})


router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            err = { error: "The posts information could not be retrieved" };
            res.status(500).json(err);
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: " The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            err = { error: "The post information could not be retrieved" };
            res.status(500).json(err)
        })
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;

    Posts.findPostComments(id)
        .then(comments => {
            if (comments && comments.length) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            err = { error: "The comments information could not be retrieved" };
            res.status(500).json(err)
        })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if (!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else if (!changes.title || !changes.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        Posts.update(id, changes)
            .then(updated => {
                if (updated) {
                    res.status(200).json(changes);
                }
            })
            .catch(err => {
                err = { error: "The post information could not be modified." };
                req.status(500).json(err);
            })
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Posts.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            err = { error: "The post could not be removed" };
            res.status(500).json(err);
        })
})

module.exports = router;