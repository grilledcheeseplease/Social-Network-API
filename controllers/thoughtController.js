const { User, Thought } = require('../models');

module.exports = {

    getThoughts(req, res) {
        Thought.find()
            .select('-__v')
            .populate({ path: 'reactions', select: '-__v' })
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .populate({ path: 'reactions', select: '-__v' })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'Thought created, but found no user with that ID' })
                    : res.json('Created thought')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $set: req.body },
            { new: true },
        )
            .select('-__v')
            .populate({ path: 'reactions', select: '-__v' })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : User.findOneAndUpdate(
                        { username: dbThoughtData.username },
                        { $pull: { thoughts: params.id } }
                    )
            )
            .then((thought) => 
            !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json({ message: 'Thought successfully deleted' })
            )
            .catch((err) => res.status(404).json(err));
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reaction: req.body } },
            { runValidators: true, new: true }
        )
        .select('-__v')
        .populate({ path: 'reactions', select: '-__v' })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
        )
        .catch((err) => res.status(404).json(err));
    },

    deleteReaction(req, res){
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reaction: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
        )
        .catch((err) => res.status(404).json(err));
    },
};