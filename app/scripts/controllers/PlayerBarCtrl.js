(function() {
    function PlayerBar(Fixtures, SongPlayer) {
        this.albumData = Fixtures.getAlbum;
        this.songPlayer = SongPlayer;
    }

    angular
        .module('blocJams')
        .controller('PlayerBarCtrl', ['Fixtures', 'SongPlayer', PlayerBar]);
})();
