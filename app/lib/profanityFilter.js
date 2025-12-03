const profanityModule = require('profanity-filter');

const isProfane = (text) => {
    if (!text || typeof text !== 'string') {
        return false;
    }
    const cleanedText = profanityModule.clean(text);
    return cleanedText !== text;
};

module.exports = {
    isProfane
};