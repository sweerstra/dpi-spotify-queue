module.exports = {
    playTrack(track) {
        return new Promise((resolve, reject) => {
            // some transformation, play song here
            resolve(track);

            // if something goes wrong
            // reject('Could not play this track');
        });
    }
};