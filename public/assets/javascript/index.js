$(document).ready(function() {
    var articleContainer = $(".article-container");

    //on clicks to scrape articles and save articles once scraped
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
  
    initPage();
    //load articles if already scraped or else give message that theres no        articles 
    function initPage() {
      articleContainer.empty();
      $.get("/api/headlines?saved=false").then(function(data) {
        if (data && data.length) {
          renderArticles(data);
        }
        else {
          renderEmpty();
        }
      });
    }
  
    function renderArticles(articles) {
      var articlePanels = [];
      for (var i = 0; i < articles.length; i++) {
        articlePanels.push(createPanel(articles[i]));
      }
      articleContainer.append(articlePanels);
    }
      //create a panel for article to be rendered to with specfic scraped data 
    function createPanel(article) {
      var panel = $(
        [
          "<div class='panel panel-default'>",
          "<div class='panel-heading'>",
          "<h3>",
          "<a class='article-link' target='_blank' href='" + article.url + "'>",
          article.headline,
          "</a>",
          "<a class='btn btn-info save'>",
          "Save Article",
          "</a>",
          "</h3>",
          "</div>",
          "<div class='panel-body'>",
          article.summary,
          "</div>",
          "</div>"
        ].join("")
      );
      panel.data("_id", article._id);
      return panel;
    }
      //in case no articles  have been scraped in the DB give a message to the    user 
    function renderEmpty() {
      var emptyAlert = $(
        [
          "<div class='alert alert-warning text-center'>",
          "<h4>Looks like we don't have any new articles.</h4>",
          "</div>",
          "<div class='panel panel-default'>",
          "<div class='panel-heading text-center'>",
          "<h3>What Would You Like To Do?</h3>",
          "</div>",
          "<div class='panel-body text-center'>",
          "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
          "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
          "</div>",
          "</div>"
        ].join("")
      );
      articleContainer.append(emptyAlert);
    }
      //put use to save article 

      
    function handleArticleSave() {
      var articleToSave = $(this).parents(".panel").data();
      articleToSave.saved = true;
        $.ajax({
        method: "PUT",
        url: "/api/headlines",
        data: articleToSave
      }).then(function(data) {
  
        if (data.ok) {
          initPage();
          bootbox.alert("Article Saved!" ).find('.modal-content').css({
            'font-weight' : 'bold',
            'color': '#3366ff',
            'font-size': '2em',
            'margin-top': function (){
                var w = $(window).height();
                var b = $(".modal-dialog").height();
                var h = (w-b)/2;
                return h+"px";
            }
        });
        }
      });
    }
    
    function handleArticleScrape() {
        $.get("/api/fetch").then(function(data) {
        initPage();
        bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
      });
    }
  });