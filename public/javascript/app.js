$(document).ready(function() {
  // Save every article on database by click on SAVE AS FAVORITE button:
  $(".save-button").on("click", function() {
    let id = $(this).data("id");
    let title = $(this).data("title");
    let link = $(this).data("link");
    let summary = $(this).data("summary");

    let savedArticle = {
      title: title,
      link: link,
      summary: summary
    };

    $.post("/api/save-articles/" + id, savedArticle).then(function() {
      console.log("Favorite article saved!");
    });
    location.reload();
  });

  // Delete every favorite article from database by click on DELETE FROM FAVORITES button:
  $(".delete-article-btn").on("click", function() {
    let id = $(this).data("id");
    let title = $(this).data("title");
    let link = $(this).data("link");
    let summary = $(this).data("summary");

    let deletedArticle = {
      title: title,
      link: link,
      summary: summary
    };

    $.post("/api/delete-save/" + id, deletedArticle).then(function() {
      console.log("Favorite article deleted!");
    });
    location.reload();
  });

  // Delete every comment from database by click on SAVE AS FAVORITE button:
  $(".delete-comment-btn").on("click", function() {
    let id = $(this).data("id");
    $.post("/api/delete-comment/" + id).then(function() {
      location.reload();
    });
  });
});
