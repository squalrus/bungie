/* Flickr Image View
------------------------------------------------------------*/
var FlickrImageView = Backbone.View.extend({
    tagName: 'div',
    className: 'image-block',

    events: {
        'click .love': 'toggleLove',
        'click .share': 'toggleShare'
    },

    render: function() {
        dust.render('imageBlock', data, function( err, out ) {
            if ( err ) console.log( err );
            else $('#content-main').html( out );
        });
        return this;
    }

});


/* Flickr Image Model
------------------------------------------------------------*/
var FlickrImage = Backbone.Model.extend({
    defaults: {
        'loved': false,
        'shared': false
    },

    initialize: function() {
        console.log( 'created FlickrImage');
    }
});


/* Photo Album Model
------------------------------------------------------------*/
var PhotoAlbum = Backbone.Collection.extend({
    model: FlickrImage,
    groupId: 'temp',
    url: function() {
        return 'data.json?callback=?';
        // return 'http://api.flickr.com/services/feeds/groups_pool.gne?format=json&id=' + this.groupId + '&jsoncallback=?';
    },

    initialize: function() {
        console.log( 'created PhotoAlbum' );

        $.get('dust/image.block.dust', function( data ) {
            var compiled = dust.compile( data, "imageBlock" );
            // console.log( 'compiledImageBlock = ' + compiled );
            dust.loadSource( compiled );
        }, 'html');

        $.get('dust/image.list.dust', function( data ) {
            var compiled = dust.compile( data, "imageList" );
            // console.log( 'compiledImageList = ' + compiled );
            dust.loadSource( compiled );
        }, 'html');
    },
    sync: function( method, model, options ) {
        options.dataType = 'jsonp';
        return Backbone.sync( method, model, options );
    },
    parse: function( response ) {
        return response.items;
    }
});

var binderFullOfImages = new PhotoAlbum();
binderFullOfImages.groupId = '1755030@N21';

binderFullOfImages.fetch();