$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<h2 class='title'>" +
      data[i].title +
      "</h2><br /><p><a href='" +
      data[i].link +
      "' target= '_blank'><img src='" +
      data[i].image +
      "'></a><p class='description'>" +
      data[i].descrip +
      "</p></br><button id='myBtn' data-id='" +
      data[i]._id +
      "'>Add Notes</button>")

  }
});


// Whenever someone clicks a p tag
$(document).on("click", "#myBtn", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  console.log(thisId);

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })

    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").css("background-color", "rgba(0, 0, 0, 0.6)");
      $("#notes").addClass("animated boumceInRight");
      $("#notes").append("<h2 class='animated bounceInRight' id='noteTitle'>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' class='animated bounceInRight'>");
      // A textarea to add a new note bod
      $("#notes").append("<textarea id='bodyinput' name='body'class='animated bounceInRight'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='animated bounceInRight'>Save Note</button>");

      // If there's a note in the article

      if (data.note) {

        console.log(data.note);
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#noteTitle").removeClass("bounceInRight").addClass("bounceOutRight");
      $("#titleinput").removeClass("bounceInRight").addClass("bounceOutRight");
      $("#bodyinput").removeClass("bounceInRight").addClass("bounceOutRight");
      $("#savenote").removeClass("bounceInRight").addClass("bounceOutRight");
      $("#notes").css("background-color", "rgba(0,0,0,0)");

    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});