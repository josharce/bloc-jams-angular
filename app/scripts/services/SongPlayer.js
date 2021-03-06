(function() {
    function SongPlayer($rootScope, Fixtures) {
        /*
        * @desc SongPlayer object to be returned by service
        * @type {Object}
        */
        var SongPlayer = {};
        
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
                preload: true,
                volume: SongPlayer.volume || 80
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();

                    if (SongPlayer.currentTime === SongPlayer.currentSong.duration) {
                        SongPlayer.next();
                    }
                });
            });

            currentBuzzObject.bind('volumechange', function() {
                $rootScope.$apply(function() {
                    SongPlayer.volume = currentBuzzObject.getVolume();

                    if (SongPlayer.volume === 0) {
                        SongPlayer.isMuted = true;
                    } else {
                        SongPlayer.isMuted = false;
                    }
                });
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
        * @function stopSong
        * @desc Stops the current Buzz object
        * @param {Object} song
        */
        var stopSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                song.playing = null;
            }
        };
        
        /*
        * @function getSongIndex
        * @desc Returns the index of a given song from the current album
        * @param {Object} song
        */
        var getSongIndex = function(song) {
            return SongPlayer.currentAlbum.songs.indexOf(song);
        };

         /*
        * @desc Public - currently viewed/active album
        * @type {Object}
        */
        SongPlayer.currentAlbum = Fixtures.getAlbum();

        /*
        * @desc Public - Currently playing song object
        * @type {Object} song
        */
        SongPlayer.currentSong = null;

        /*
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;

        /*
        * @desc value of the volume
        * @type {Number}
        */
        SongPlayer.volume = null;

        /*
        * @desc boolean based on if volume is 0
        * @type {Boolean}
        */
        SongPlayer.isMuted = false;

        /*
        * @desc value of the volume
        * @type {Number}
        */
        SongPlayer.volumePriorToMute = null;

        /*
        * @function muteVolume
        * @desc Store current volume for unmuteVolume() and set current volume to 0
        */
        SongPlayer.muteVolume = function() {
            SongPlayer.volumePriorToMute = SongPlayer.volume;
            SongPlayer.volume = 0;
            SongPlayer.setVolume(SongPlayer.volume);
        };

        /*
        * @function unmuteVolume
        * @desc Set volume to value of volume before mute
        */
        SongPlayer.unmuteVolume = function() {
            SongPlayer.volume = SongPlayer.volumePriorToMute;
            SongPlayer.setVolume(SongPlayer.volume);
            SongPlayer.volumePriorToMute = null;
        };

        /*
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

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
                if (currentBuzzObject) {
                    if (currentBuzzObject.isPaused()) {
                        playSong(song);
                    }
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
        * @function next
        * @desc Public method - selects the next song by index number. If current
        *                       song is last song, it remains selected.
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex >= SongPlayer.currentAlbum.songs.length) {
                song = SongPlayer.currentSong;
                stopSong(song);
            } else {
                var song = SongPlayer.currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
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
                song = SongPlayer.currentSong;
                stopSong(song);
            } else {
                var song = SongPlayer.currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /*
        * @function setVolume
        * @desc Public method - update the volume on change
        */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
