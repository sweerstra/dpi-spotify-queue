module.exports = {
    getUrlHashParams(url) {
        return url.slice(url.indexOf('#') + 1).split('&')
            .reduce((params, hash) => {
                const [key, value] = hash.split('=');
                return { ...params, [key]: value };
            }, {});
    }
};