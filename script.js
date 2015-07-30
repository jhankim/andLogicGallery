var andLogicGallery = function(){

    var _this = this;
    this.localVariable = 'value';
    this.recentEndpoint = '//photorankapi-a.akamaihd.net/customers/215815/media/recent?auth_token=f48eeae508d1b1f3133df366679eb2b567bae5dc8058d69d679dc5cb140eb857&version=v2.2&count=50';
    this.galleryList = $('ul#gallery-list');

    this.fetchRecent = function(){
        $.ajax({
            url: _this.recentEndpoint,
            success: function(response){
                $.each(response.data._embedded.media, function(key, value){

                    console.log(this);

                    // save stream data for this photo
                    var streamData = this._embedded['streams:all']._embedded.stream;

                    // create DOM object (stayed away from HTML, since we need to iterate through stream objs)
                    var listHtml = $('<li>', { 
                        'data-id': 'photo-' + this.id, 
                        'style': 'background-image: url(' + this.images.mobile + ')'
                    });

                    // go through stream data, and add it into DOM object
                    $.each(streamData, function(key, value){
                        listHtml.addClass('stream-' + this.id);
                    });

                    // append to galleryList
                    _this.galleryList.append(listHtml);

                });
            }
        });
    }

    this.init = function(){
        console.log('init!');
        _this.fetchRecent();
    }

}

var myGallery = new andLogicGallery;

myGallery.init();