$(document).ready(function() {
  $('.updateButton').click(function () {
    var id = $(this).attr('id');
    var newVal = $('.person#' + id).val();
    var pass = $('#password').val();

    //console.log('updating, id = ' + id + ', new value = ' + newVal);
    //console.log({ "day": id, "person": newVal, "password": pass });

    $.ajax({
      "url": "/update",
      "type": "POST",
      "data": JSON.stringify({ "day": id, "person": newVal, "password": pass }),
      "contentType": "application/json; charset=utf-8",
      "dataType": "json",
      "mimeType": "text/html",
      "statusCode": {
        401: function () {
          $('#message').html('Wrong password');
        },
        200: function () {
          $('#message').html("OK")
        }
      }
    });
  });
});
