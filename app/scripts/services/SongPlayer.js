(function() {
    function SongPlayer(Fixtures) {
        /*
        * @desc SongPlayer object to be returned by service
        * @type {Object}
        */
        var SongPlayer = {};

        /*
        * @desc Currently viewed/active album
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
        
        /*
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;

        /*
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
 
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
 
            SongPlayer.currentSong = song;
        };

        /*
        * @function playSong
        * @desc Plays the current Buzz object
        * @param {Object} song
        */
        var playSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.play();
                song.playing = true;
            }
        };
        
        /*
        * @function getSongIndex
        * @desc Returns the index of a given song from the current album
        * @param {Object} song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };

        /*
        * @desc Public - Currently playing song object
        * @type {Object} song
        */
        SongPlayer.currentSong = null;

        /*
        * @function play
        * @desc Public method - checks state of currentSong and either calls setSong() and playSong()
        *                       or just playSong()
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };

        /*
        * @function pause
        * @desc Public method - pauses current Buzz object
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };

        /*
        * @function previous
        * @desc Public method - selects the previous song by index number. If current
        *                       song is first song, it remains selected.
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['Fixtures', SongPlayer]);
})();
