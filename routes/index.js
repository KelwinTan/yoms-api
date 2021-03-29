const express = require('express');
const router = express.Router();

const Url = require('../models/Url');

router.get('/', async (req, res) => {
    try {
        const urls = await Url.find({});
        if (urls) {
            return res.send(urls);
        } else {
            return res.status(400).json('No Urls found');
        }
    } catch (error) {
        console.error(err);
        res.status(500).json('Server Error');
    }
});

// @route GET /:code
// @desc  Redirect to long/original URL
router.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });
        if (url) {
            url.visits += 1;
            url.save();
            return res.redirect(url.longUrl);
        } else {
            return res.status(400).json('No Url found');
        }
    } catch (error) {
        console.error(err);
        res.status(500).json('Server Error');
    }
});

module.exports = router;