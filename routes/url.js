const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortId = require('shortid');
const config = require('config');

const Url = require('../models/Url');

//@route POST /api/url/shorten
//@des create short url

router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json("Invalid base Url")
    }

    //Create url code
    const urlCode = shortId.generate();

    //Check long url
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });

            if (url) {
                res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date(),
                    visits: 0,
                });
                await url.save();

                res.json(url);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(401).json('Invalid Long Url');
    }
});


router.patch('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });
        if (url) {
            // url.visits += 1;
            // url.save();
            const baseUrl = config.get('baseUrl');
            url.shortUrl = baseUrl + '/' + req.body.newShort;
            url.urlCode = req.body.newShort;
            url.save();
            return res.send(url);
        } else {
            return res.status(400).json('No Url found');
        }
    } catch (error) {
        console.error(err);
        res.status(500).json('Server Error');
    }
})


module.exports = router;