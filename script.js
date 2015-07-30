// plugin for $.classes() method
;!function(e){e.fn.classes=function(t){var n=[];e.each(this,function(e,t){var r=t.className.split(/\s+/);for(var i in r){var s=r[i];if(-1===n.indexOf(s)){n.push(s)}}});if("function"===typeof t){for(var r in n){t(n[r])}}return n}}(jQuery);

// start function object
var andLogicGallery = function(){

    var _this = this;
    this.localVariable = 'value';
    this.baseUrl = '//photorankapi-a.akamaihd.net/';
    this.customerId = '215815';
    this.version = '2.2';
    this.apiKey = 'f48eeae508d1b1f3133df366679eb2b567bae5dc8058d69d679dc5cb140eb857'

    this.itemsPerPage = '50';
    this.galleryList = $('ul#gallery-list');
    this.filterList = $('ul#filter-list');
    this.filterListItem = $('ul#filter-list li');
    this.viewAll = $('ul#filter-list li[data-id="all"]');

    this.listPool = {
        'media': []
    };

    this.fetchRecent = function(){

        var endpoint = '/media/recent/'
        var requestUrl = _this.baseUrl + 'customers/' + _this.customerId + endpoint + '?auth_token=' + _this.apiKey + '&version=v' + _this.version + '&count=' + _this.itemsPerPage;

        $.ajax({
            url: requestUrl,
            success: function(response){
                $.each(response.data._embedded.media, function(key, value){
                    _this.addToPool(this);
                    _this.updateDom();
                });
            }
        });

    }

    this.filterClick = function(filterItem){

        var streamId = $(filterItem).data('id');

        if ( $(filterItem).data('id') !== 'all' ){

            $(filterItem).toggleClass('checked');

            var endpoint = '/streams/' + streamId + '/media/recent';
            var requestUrl = _this.baseUrl + endpoint + '?auth_token=' + _this.apiKey + '&version=v' + _this.version + '&count=' + _this.itemsPerPage;

            $.ajax({
                url: requestUrl,
                success: function(response){
                    $.each(response.data._embedded.media, function(key, value){

                        _this.addToPool(this);
                        _this.updateDom();

                    });
                }
            });

        }

        _this.filterDom();

    }

    this.addToPool = function(mediaObj){
        _this.listPool['media'] = mediaObj;
    }

    this.updateDom = function(){

        $.each(_this.listPool, function(key, value){
            if ( _this.galleryList.find('li[data-id="'+this.id+'"]').length ){
                // console.log(this.id + ' is already found in DOM, ignoring...');
            } else {

                // console.log(this.id + ' is not found in DOM, adding...');

                // save stream data for this photo
                var streamData = this._embedded['streams:all']._embedded.stream;

                // create DOM object (stayed away from HTML, since we need to iterate through stream objs)
                var listHtml = $('<li>', { 
                    'data-id': this.id, 
                    'style': 'background-image: url(' + this.images.mobile + ')'
                });

                // go through stream data, and add it into DOM object
                $.each(streamData, function(key, value){
                    listHtml.addClass('stream-' + this.id);
                });

                // append to galleryList
                _this.galleryList.append(listHtml);
            }
        });

    }

    this.filterDom = function(){

        var selectedFilters = _this.filterList.find('.checked').not(_this.viewAll);
        var selectedFiltersIds = [];

        for (var i = selectedFilters.length - 1; i >= 0; i--) {
            selectedFiltersIds.push($(selectedFilters[i]).data('id'));
        }

        $.each(_this.galleryList.find('li'), function(key, value){
            if ( !_this.compareItemAgainstFilter(value, selectedFiltersIds) ) {
                $(value).hide();
            } else {
                $(value).show();
            }
        });

        if ( selectedFiltersIds.length == 0 ) {

            _this.viewAll.addClass('checked');
            _this.galleryList.find('li').show();

        } else {
            _this.viewAll.removeClass('checked');
        }

    }

    this.compareItemAgainstFilter = function(item, filterIds){

        var classes = $(item).classes();

        for (var i = classes.length - 1; i >= 0; i--) {
            classes[i] = parseInt( classes[i].substr(7) );
        };

        // console.log('for item id: ' + $(item).data('id') + ' classes: ', classes, 'filter selection: ', filterIds );
        // console.log('is classes part of filters? ', _this.containsAll(filterIds, classes));

        return _this.containsAll(filterIds, classes);

    }

    this.containsAll = function(needles, haystack){ 

        for(var i = 0 , len = needles.length; i < len; i++){
            if($.inArray(needles[i], haystack) == -1) return false;
        }
        
        return true;

    }

    this.init = function(){

        console.log('init!');

        _this.fetchRecent();
        _this.viewAll.addClass('checked');

        _this.filterListItem.click(function(e){
            _this.filterClick(this);
        });

    }

}

var myGallery = new andLogicGallery;

myGallery.init();