$(document).ready(function () {
  var articleContainer = $(".article-container");

  //on clicks for deleting articles, adding notes and deleting notes
  $(document).on("click", ".delete", handleArticleDelete);
  $(document).on("click", ".notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  initPage();
  //either load saved articles or display a message that there aren't any           articles saved yet
  function initPage() {

    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function (data) {

      if (data && data.length) {
        renderArticles(data);
      } else {

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
  //making panel with scraped info and button for deleting the article and         adding notes
  function createPanel(article) {

    var panel = $(
      [
        "<div class='panel panel-default'>",
          "<div class= 'panel-heading grid-container'>",
            "<h3>",
              "<a class='article-link' target='_blank' href='" + article.url + "'>",
              article.headline,
              "</a>",
            "</h3>",
            "<div style='text-align: right'>",
              "<button class='delete'>",
              "Delete From Saved",
              "</button>",
              "<button class=' notes'>Article Notes</button>",
            "</div>",
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
  //func if case where no articles have been saved yet 
  function renderEmpty() {

    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Looks like you don't have any saved articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would You Like to Browse the Available New York Times Articles?</h3>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>",
        "<br>",
        "<br>",
        "<br>",
        "<br>",
        "<br>",
      ].join("")
    );

    articleContainer.append(emptyAlert);
  }
  //if article has been saved, list notes or else give mssage that theres no      notes yet
  function renderNotesList(data) {

    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {

      currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
      notesToRender.push(currentNote);
    } else {

      for (var i = 0; i < data.notes.length; i++) {

        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );

        currentNote.children("button").data("_id", data.notes[i]._id);

        notesToRender.push(currentNote);
      }
    }

    $(".note-container").append(notesToRender);
  }
  //remove article from saved 
  function handleArticleDelete() {

    var articleToDelete = $(this).parents(".panel").data();

    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function (data) {

      if (data.ok) {
        initPage();
      }
    });
  }
    //func for creating new notes, use a modal 
  function handleArticleNotes() {

    var currentArticle = $(this).parents(".panel").data();

    $.get("/api/notes/" + currentArticle._id).then(function (data) {

      // modal creation for notes
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");

      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };

      $(".btn.save").data("article", noteData);

      renderNotesList(noteData);
    });
  }
    //post use to save notes here
  function handleNoteSave() {

    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();

    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function () {

        bootbox.hideAll();
      });
    }
  }
    //delete use to delete note... (obviously?)
  function handleNoteDelete() {

    var noteToDelete = $(this).data("_id");

    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function () {

      bootbox.hideAll();
    });
  }
});