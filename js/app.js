/*
  Please add all Javascript code to this file.
  GA JS-SF-7
  Randy Hill
*/

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

const urlBypass = 'https://accesscontrolalloworiginall.herokuapp.com/';
var urlBypassToggle = false;

var sourceList = [];
var sourceListObj = [];

function source() {
    return {
        url: '',
        urlbypass: false,
        callback: ''
    };
}


var article = {
    thumbnail: 'images/article_placeholder_2.jpg',
    title: 'Test article title',
    impression: 0,
    url: ''
};

function Feed_Init() {

    sourceList.push('http://digg.com/api/news/popular.json');

    var temp = source();
    temp.url = 'http://digg.com/api/news/popular.json';
    temp.callback = 'parse_digg';
    sourceListObj.push(temp);

    //***Fill source list dropdown.
    $('#ulSourceListB').empty();
    sourceListObj.forEach(function (elm) {
        var a = $('<a>', { href: elm.url });
        var newA = $('<a>', { href: '#' }).text(a.prop('hostname'))
        var newLi = $('<li>').append(newA);

        $('#ulSourceListB').append(newLi);
    });

    get_Articles();
}

function get_Articles() {

    sourceListObj.forEach(function (elm) {

        var fullurl = elm.url;
        if (elm.urlbypass === true)
            fullurl = urlBypass + elm.url;

        $.when($.get(fullurl)).then(function (resp) {
            console.log(resp);

            resp.data.feed.forEach(function (elm) {
                console.log('TITLE: ' + elm.content.title);
                console.log('THUMB: ' + elm.content.media.images[0].original_url);
                console.log('URL: ' + elm.content.original_url);
                console.log('SCORE: ' + elm.digg_score);
                console.log('');
            });

        }).fail(function (err) {
            debugger;
            error_msg(err, elm);
        });

        elm.urlbypass = false;
    });

}

function error_msg(err, val) {
    alert('ERROR: ' + err);

    

    if (err.toLowerCase().indexOf('Access-Control-Allow-Origin') >= 0) {
        urlBypassToggle = true;
        val.urlbypass = true;
        get_Articles();
    }
}


Feed_Init();



