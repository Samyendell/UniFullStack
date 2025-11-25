const ProfanityFilter = require('profanity-filter');

const pf = new ProfanityFilter();

const isProfane = (text) => {
    if (!text || typeof text !== 'string') {
        return false;
    }
    return pf.isProfane(text);
};

module.exports = {
    isProfane
};