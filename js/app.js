/*
  Please add all Javascript code to this file.
  GA JS-SF-7
  Randy Hill
*/
const urlBypass = 'https://accesscontrolalloworiginall.herokuapp.com/';

var sourceListObj = []; //***Hold source objects.
var articleListObj = []; //***Hold articles objects

//***Object for sources.
function source() {
    return {
        url: '',
        url2: '',
        urlBypass: false,
        articleBypass: false,
        callback: ''
    };
}

//***Object for articles.
function article() {
    return {
        thumbnail: 'images/article_placeholder_2.jpg',
        title: 'Test article title',
        impression: 0,
        category: 'N/A',
        url: '',
        date_pub: ''
    }
};

function feed_init() {

    //**************
    // Sources
    //**************
    //var temp = source();
    //temp.url = 'http://digg.com/api/news/popular.json';
    //temp.callback = parse_Digg;
    //temp.urlBypass = true;
    //sourceListObj.push(temp);

    //var temp = source();
    //temp.url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    //temp.url2 = 'https://hacker-news.firebaseio.com/v0/item/[[STORY_ID]].json';
    //temp.callback = parse_HackerNews;
    //temp.urlBypass = false;
    //temp.articleBypass = true;
    //sourceListObj.push(temp);

    var temp = source();
    temp.url = 'http://thedailywtf.com/api/articles/recent';
    temp.callback = parse_TDWTF;
    temp.urlBypass = true;
    sourceListObj.push(temp);

    //***Fill source list dropdown. Domain used as text in dropdown.
    $('#ulSourceListB').empty();
    sourceListObj.forEach(function (elm) {
        var a = $('<a>', { href: elm.url });
        var newA = $('<a>', { href: '#' }).text(a.prop('hostname'))
        var newLi = $('<li>').append(newA);

        $('#ulSourceListB').append(newLi);
    });


}

function get_articles() {
    
    var fetched = 0;

    sourceListObj.forEach(function (elm) {

        //***If souce is marked to use bypass URL method append before source URL.
        var fullurl = elm.url;
        if (elm.urlBypass === true)
            fullurl = urlBypass + elm.url;

        //***Go grab JSON.
        $.when($.get(fullurl)).then(function (resp) {
            console.log(resp);

            //***Use source callbabck method and pass response to parse.
            elm.callback(resp, elm);
            fetched++;

            //***After all the sources have been processed, call to display on page.
            if (fetched >= sourceListObj.length) {
                display_articles();   
            }
        });

    });
}

function parse_TDWTF(resp, source) {

    //***Loop though response.
    resp.forEach(function (elm) {

        //***Create new article object and set properties.
        var art = article();
        art.thumbnail = elm.Author.ImageUrl; // no article thumbnail, use author pic :)
        art.title = elm.Title;
        art.impression = elm.CachedCommentCount;
        art.url = elm.Url;
        art.date_pub = elm.DisplayDate; // already YYYY-MM-DD
        art.category = 'The Daily WTF';

        //***Add article to array.
        articleListObj.push(art);
    });
}

function parse_HackerNews(resp, source) {

    var cnt = 0;

    //https://github.com/HackerNews/API
    //***Loop though response.
    try {
        resp.forEach(function (elm) {
            var storyUrl = source.url2.replace('[[STORY_ID]]', elm);

            //***Go grab JSON.
            $.when($.get(storyUrl)).then(function (resp) {
                console.log(resp);
                parse_HackerNews_Story(resp);
            });

            cnt += 1;
            if (cnt === 10) throw BreakException;
        });

    } catch (e) {
        //if (e !== BreakException) throw e;
        
    }

}

function parse_HackerNews_Story(resp) {

        //***Create new article object and set properties.
        var art = article();
        //art.thumbnail = elm.content.media.images[0].original_url;
        art.title = resp.title;
        art.impression = resp.score;
        art.url = resp.url;
        art.category = 'Hacker News: ' + resp.type;

        //***Convert UTC seconds to date.
        var d = new Date(0);
        d.setUTCSeconds(resp.time);
        art.date_pub = moment(d).format('YYYY-MM-DD');;

        //***Add article to array.
        articleListObj.push(art);
}

function parse_Digg(resp, source) {

    //***Loop though response.
    resp.data.feed.forEach(function (elm) {        

        //***Create new article object and set properties.
        var art = article();
        art.thumbnail = elm.content.media.images[0].original_url;
        art.title = elm.content.title;
        art.impression = elm.digg_score;
        art.url = elm.content.original_url;
        art.category = 'Digg: ' + elm.content.domain;

        //***Convert UTC seconds to date.
        var d = new Date(0); 
        d.setUTCSeconds(elm.date_published);
        art.date_pub = moment(d).format('YYYY-MM-DD');

        //***Add article to array.
        articleListObj.push(art);
    });
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

    //***Sort decending by data_pub property.
    sortOn(articleListObj, 'date_pub', true);

    articleListObj.forEach(function(elm) {
        var $art = $('<article>').addClass('article');

        var $thumb = $('<img>').attr({ src: elm.thumbnail })
        var $sec = $('<section>').addClass('featuredImage');
        $sec.append($thumb);
        $art.append($sec);

        var $link = $('<a>', { href: elm.url });
        var $head3 = $('<h3>').text(elm.title);
        $link.append($head3);

        var $head6 = $('<h6>').text(elm.category);
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

function sortOn (arr, prop, desc) {
    arr.sort (
        function (a, b) {
            if (a[prop] < b[prop])
                return (desc) ? 1 : -1;
             else if (a[prop] > b[prop])
                return (desc) ? -1 : 1;
             else 
                return 0;
        }
    );
}

feed_init();
get_articles();
