Bungie = (function() {

    var bungie = {};

    var dataCache_;
        // compiledImageBlock = (function(){dust.register("imageBlock",body_0);function body_0(chk,ctx){return chk.write("<h2>").reference(ctx.get("title"),ctx,"h").write("</h2><p>").reference(ctx.get("description"),ctx,"h").write("</p><p><a href=\"").reference(ctx.get("link"),ctx,"h").write("\" target=\"_blank\">").reference(ctx.get("link"),ctx,"h").write("</a></p><div class=\"image-container\">").section(ctx.get("items"),ctx,{"block":body_1},null).write("</div>");}function body_1(chk,ctx){return chk.write("<div class=\"image-block\"><h4>").reference(ctx.get("title"),ctx,"h").write("</h4>").section(ctx.getPath(false,["media","m"]),ctx,{"block":body_2},null).write("<span>link: <a href=\"").reference(ctx.get("link"),ctx,"h").write("\" alt=\"").reference(ctx.get("title"),ctx,"h").write("\" target=\"_blank\">view on flickr</a></span><span>author: ").reference(ctx.get("author"),ctx,"h").write("</span></div>");}function body_2(chk,ctx){return chk.write("<img src=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" width=\"255\" />");}return body_0;})(),
        // compiledImageList = (function(){dust.register("imageList",body_0);function body_0(chk,ctx){return chk.write("<h2>").reference(ctx.get("title"),ctx,"h").write("</h2><p>").reference(ctx.get("description"),ctx,"h").write("</p><p><a href=\"").reference(ctx.get("link"),ctx,"h").write("\" target=\"_blank\">").reference(ctx.get("link"),ctx,"h").write("</a></p><div class=\"image-container\">").section(ctx.get("items"),ctx,{"block":body_1},null).write("</div>");}function body_1(chk,ctx){return chk.write("<div class=\"image-list\">").section(ctx.getPath(false,["media","m"]),ctx,{"block":body_2},null).write("<div class=\"content\"><h4>").reference(ctx.get("title"),ctx,"h").write("</h4><span>link: <a href=\"").reference(ctx.get("link"),ctx,"h").write("\" alt=\"").reference(ctx.get("title"),ctx,"h").write("\" target=\"_blank\">view on flickr</a></span><span>author: ").reference(ctx.get("author"),ctx,"h").write("</span><span>tags: ").reference(ctx.get("tags"),ctx,"h").write("</span></div></div>");}function body_2(chk,ctx){return chk.write("<img src=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" height=\"100\" />");}return body_0;})();

    bungie.initialize = function() {

        // this.loading();

        this.loadDust().done(
            // this.loadFlickrPoolFeed( '1755030@N21' )
        );

        this.bindLayout();
        this.bindFeeds();
        this.bindNonLinks();

    };

    bungie.loading = function() {
        $('#content-main').html( '<span class="loader-container"><span class="loader"></span><span class="loader-text">(front-end) loader...</span></span>' );
    };

    bungie.loadDust = function() {

        // Save the resources by pre-compiling the templates
        /*
        return $.when(function() {
            dust.loadSource( compiledImageBlock );
            dust.loadSource( compiledImageList );
        });
        */

        // Ajax calls to load external dust.js resources
        return $.when(
            $.get('dust/image.block.dust', function( data ) {
                var compiled = dust.compile( data, "imageBlock" );
                // console.log( 'compiledImageBlock = ' + compiled );
                dust.loadSource( compiled );
            }, 'html'),

            $.get('dust/image.list.dust', function( data ) {
                var compiled = dust.compile( data, "imageList" );
                // console.log( 'compiledImageList = ' + compiled );
                dust.loadSource( compiled );
            }, 'html')
        );

    };

    bungie.loadFlickrPoolFeed = function( poolId ) {

        var data = {
            id: poolId,
            format: 'json',
            // nojsoncallback: 1,
            jsoncallback: 'Bungie.renderDustBlockTemplate'
        };

        $.ajax({
            url: 'http://api.flickr.com/services/feeds/groups_pool.gne',
            dataType: 'jsonp',
            data: data
        });

        $('.feed').removeClass('active');
        $('.feed-pool[data-id="' + poolId + '"]').addClass('active');

    };

    bungie.loadFlickrPublicFeed = function() {

        var data = {
            format: 'json',
            // nojsoncallback: 1,
            jsoncallback: 'Bungie.renderDustBlockTemplate'
        };

        $.ajax({
            url: 'http://api.flickr.com/services/feeds/photos_public.gne',
            dataType: 'jsonp',
            data: data
        });

        $('.feed').removeClass('active');
        $('.feed-public').addClass('active');

    };

    bungie.renderDustBlockTemplate = function( data ) {

        dataCache_ = data;

        dust.render('imageBlock', data, function( err, out ) {
            if ( err ) console.log( err );
            else $('#content-main').html( out );
        });

        $('.layout').removeClass('active');
        $('.layout-block').addClass('active');

    };

    bungie.renderDustListTemplate = function( data ) {

        dataCache_ = data;

        dust.render('imageList', data, function( err, out ) {
            if ( err ) console.log( err );
            else $('#content-main').html( out );
        });

        $('.layout').removeClass('active');
        $('.layout-list').addClass('active');

    };

    bungie.bindFeeds = function() {

        $('.feed-pool').click(function() {
            Bungie.loading();
            Bungie.loadFlickrPoolFeed( $(this).data('id') );
            return false;
        });

        $('.feed-public').click(function() {
            Bungie.loading();
            Bungie.loadFlickrPublicFeed();
            return false;
        });

    };

    bungie.bindLayout = function() {

        $('.layout-block').addClass('active');

        $('.layout-block').click(function() {
            Bungie.renderDustBlockTemplate( dataCache_ );
            $(this).addClass('active');
            return false;
        });

        $('.layout-list').click(function() {
            Bungie.renderDustListTemplate( dataCache_ );
            $(this).addClass('active');
            return false;
        });

    };

    bungie.bindNonLinks = function() {

        $('.non-link').click(function() {
            return false;
        });

    };

    return bungie;

})();


(function() {
    Bungie.initialize();
}) ();