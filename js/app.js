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

var sources = [];
var articles = {
	image: 'images/article_placeholder_2.jpg',
	title: 'Test article title',
	impression: 0
}

function Feed_Init() {

	sources.push('http://digg.com/api/news/popular.json');

}

function get_Articles() {

		for (let i = 0; i < sources.length; i++) {
			$.when($.get(sources[i])).then(function(data) {

		        //***Random word from API put in index 0.
		        selectedWord = 0;
		        words[selectedWord] = data.word;
		        
		        getNewWordTomb();

		    }, getNewWordTomb);
		}
}




