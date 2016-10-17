const YouTubeApi = require('youtube-node');
const R = require('ramda');
const youtube = new YouTubeApi();

youtube.setKey('AIzaSyBGvV6BCp4zwpQTo_R5_bueCgL1WVQN3aI');

let results = [];

module.exports = {
    search: function(query, resultCount = 10, callback) {



        youtube.search(query, resultCount, function(error, result) {
            if (error) {
                console.log(error);
                return;
            }

            const parsedResults = result.items.map(item => {
                return {
                    id: item.id.videoId || item.id.playlistId || item.id.channelId,
                    kind: item.id.kind.substring(8),
                    title: item.snippet.title,
                }
            });

            results = [
                parsedResults,
            ];

            console.log(result);

            callback(results);
        });
    },

    getResults() {
        return results;
    }
};