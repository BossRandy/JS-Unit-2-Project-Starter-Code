/*
  Please add all Javascript code to this file.
  GA JS-SF-7
  Randy Hill
*/

const urlBypass = 'https://accesscontrolalloworiginall.herokuapp.com/';

var sourceListObj = [];
var articleListObj = [];

function source() {
    return {
        url: '',
        urlBypass: false,
        callback: ''
    };
}

function article() {
    return {
        thumbnail: 'images/article_placeholder_2.jpg',
        title: 'Test article title',
        impression: 0,
        url: ''
    }
};

function feed_init() {

    //**************
    // Sources
    //**************
    var temp = source();
    temp.url = 'http://digg.com/api/news/popular.json';
    temp.callback = parse_Digg;
    temp.urlBypass = true;
    sourceListObj.push(temp);

    //***Fill source list dropdown.
    $('#ulSourceListB').empty();
    sourceListObj.forEach(function (elm) {
        var a = $('<a>', { href: elm.url });
        var newA = $('<a>', { href: '#' }).text(a.prop('hostname'))
        var newLi = $('<li>').append(newA);

        $('#ulSourceListB').append(newLi);
    });


}

function get_articles() {
    var fetchedArticlesCounter = 0;
    sourceListObj.forEach(function (elm) {

        var fullurl = elm.url;
        if (elm.urlBypass === true)
            fullurl = urlBypass + elm.url;

        $.when($.get(fullurl)).then(function (resp) {
            //console.log(resp);

            elm.callback(resp);
            fetchedArticlesCounter += 1;

            if (fetchedArticlesCounter >= sourceListObj.length) {
                display_articles();   
            }
        });

    });
}

function parse_Digg(resp) {

    resp.data.feed.forEach(function (elm) {
        /*
        console.log('TITLE: ' + elm.content.title);
        console.log('THUMB: ' + elm.content.media.images[0].original_url);
        console.log('URL: ' + elm.content.original_url);
        console.log('SCORE: ' + elm.digg_score);
        console.log('');
        */
        
        var art = article();
        art.thumbnail = elm.content.media.images[0].original_url;
        art.title = elm.content.title;
        art.impression = elm.digg_score;
        art.url = elm.content.original_url;

        articleListObj.push(art);
    });
    //debugger;
}

function display_articles() {

    /*
    <article class="article">
        <section class="featuredImage">
          <img src="images/article_placeholder_2.jpg" alt="" />
        </section>

        <section class="articleContent">
            <a href="#"><h3>Test article title</h3></a>
            <h6>Lifestyle</h6>
        </section>

        <section class="impressions">526</section>

        <div class="clearfix"></div>
    </article>
    */

    //debugger;
    articleListObj.forEach(function(elm) {
        var $art = $('<article>').addClass('article');

        var $thumb = $('<img>').attr({ src: elm.thumbnail })
        var $sec = $('<section>').addClass('featuredImage');
        $sec.append($thumb);
        $art.append($sec);

        var $link = $('<a>', { href: elm.url });
        var $head3 = $('<h3>').text(elm.title);
        $link.append($head3);

        var $head6 = $('<h6>').text('CATEGORY');
        var $sec = $('<section>').addClass('articleContent');
        $sec.append($link);
        $sec.append($head6);
        $art.append($sec);

        var $sec = $('<section>').addClass('impressions').text(elm.impression);
        $art.append($sec);

        var $div = $('<div>').addClass('clearfix');
        $art.append($div);

        $('#main').append($art);
    });
}

function error_msg(err, val) {
    alert('ERROR: ' + err);
}

feed_init();
get_articles();




