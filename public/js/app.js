$(document).ready(function(){
  $("div.row-header").nextUntil("div.row-looks-container").hide();

  var template = _.template($("#looks-template").html() );
  var gTemplate = _.template($("#grid-template").html() );
  var baseUrl = "http://localhost:3000/api/"


  //load page with looks
  getLooks();

  var looks =[
      { url: "http://topmodafemei.ro/wp-content/uploads/2014/08/outfit6.png",
        createdDate: new Date()
      },
      { url: "http://www.designsnext.com/wp-content/uploads/2014/05/Back-to-School-Outfit-Ideas-4.jpg",
        createdDate: new Date()
      },
      { url: "https://s-media-cache-ak0.pinimg.com/236x/ea/af/95/eaaf95a776e011ee7f877b9daf166193.jpg",
        createdDate: new Date()
      },
      { url: "https://cevalenti.files.wordpress.com/2013/08/casual-outfits-51.jpg",
        createdDate: new Date()
      }
  ]

  // _.each(looks, function(look){
  //   console.log(look);
  //   var $look = template(look);
  //   $("#looks-container").append($look);
  // });

  // function gridRender(){
  //   $(".row-grid-icons").removeClass("hide");
  //   _.each(looks, function(look){
  //     console.log(look);
  //     var $look = gTemplate(look);
  //     $("#looks-container").append($look);
  //   });
  // } 

  //GET looks
  function getLooks(){
    $.ajax({
      //url: baseUrl +"looks",
      //url: "/api/looks",
      url: "https://api.instagram.com/v1/tags/ootd/media/recent?client_id=6f1ace0e97194e09adbe7c7740d51531",
      type: "GET",
      crossDomain: true,
      dataType: "jsonp",
      success: function(data){
        //console.log(data.data);
        _.each(data.data, function(look){
          look = imgExtractor(look)
          //console.log(look);
          var $look = template(look);
          $("#looks-container").append($look);
        });
      }
    });
  }
  ////////////Favorites ///////////////

  //Favs ALL
  function setLooksContainer(user) {
    //favs-all
    $("#looks-container").on("click", ".btn-all", function(e){
      //e.preventDefault();
      console.log("this in looks container click-",$(this))
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      console.log("the selected img", $img.attr("src") );
      var favAll = {url: $img.attr("src")};
      $.ajax({
        url: "/api/users/" + user._id + "/favs/all",
        type: "POST",
        data: favAll,
        success: function(data){
          console.log("this post was add", data);
        }
      });
    });
    //favs-tops
    $("#looks-container").on("click", ".btn-tops", function(e){
      //e.preventDefault();
      console.log("this in looks container click-",$(this))
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      console.log("the selected img", $img.attr("src") );
      var favTops = {url: $img.attr("src")};
      $.ajax({
        url: "/api/users/" + user._id + "/favs/tops",
        type: "POST",
        data: favTops,
        success: function(data){
          console.log("this Tops post was add", data);
        }
      });
    });
    //favs-legs
    $("#looks-container").on("click", ".btn-legs", function(e){
      //e.preventDefault();
      console.log("this in looks container click-",$(this))
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      console.log("the selected img", $img.attr("src") );
      var favLegs = {url: $img.attr("src")};
      $.ajax({
        url: "/api/users/" + user._id + "/favs/legs",
        type: "POST",
        data: favLegs,
        success: function(data){
          console.log("this Legs post was add", data);
        }
      });
    });
    //favs-shoes
    $("#looks-container").on("click", ".btn-shoes", function(e){
      //e.preventDefault();
      console.log("this in looks container click-",$(this))
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      console.log("the selected img", $img.attr("src") );
      var favShoes = {url: $img.attr("src")};
      $.ajax({
        url: "/api/users/" + user._id + "/favs/shoes",
        type: "POST",
        data: favShoes,
        success: function(data){
          console.log("this shoes post was add", data);
        }
      });
    });
    //favs-pieces
    $("#looks-container").on("click", ".btn-pieces", function(e){
      //e.preventDefault();
      console.log("this in looks container click-",$(this))
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      console.log("the selected img", $img.attr("src") );
      var favPieces = {url: $img.attr("src")};
      $.ajax({
        url: "/api/users/" + user._id + "/favs/pieces",
        type: "POST",
        data: favPieces,
        success: function(data){
          console.log("this pieces post was add", data);
        }
      });
    });
    //Fav Click
    $("#fav-grid-btn").on("click", function(e){
      console.log("i clicked fav btn", user._id);
      if($("#grid-container").hasClass("grid-active") ){
                getLooks();
      }
      $("#grid-container").toggleClass("hide").toggleClass("grid-active");
      // $("#grid-container").toggleClass("hide").addClass("grid-active");
      $("#looks-container").toggleClass("hide").empty();
      //add all favs to view
      $.ajax({
        url: "/api/users/" + user._id + "/favs/all",
        type: "GET",
        success: function(data){
          console.log("the data is", data);
          _.each(data.fav_all, function(look){
            console.log("inside each grid");
            var $look = gTemplate(look);
            $("#fav-all-container").append($look);
          });
        }
      });
      //add all tops to view
      $.ajax({
        url: "/api/users/" + user._id + "/favs/tops",
        type: "GET",
        success: function(data){
          console.log("the tops data is", data);
          _.each(data.fav_tops, function(look){
            console.log("inside each grid");
            var $look = gTemplate(look);
            $("#fav-tops-container").append($look);
          });
        }
      });
      // all legs to view
      $.ajax({
        url: "/api/users/" + user._id + "/favs/legs",
        type: "GET",
        success: function(data){
          console.log("the legs data is", data);
          _.each(data.fav_legs, function(look){
            console.log("inside each grid");
            var $look = gTemplate(look);
            $("#fav-legs-container").append($look);
          });
        }
      });
      // all shoes to view
      $.ajax({
        url: "/api/users/" + user._id + "/favs/shoes",
        type: "GET",
        success: function(data){
          console.log("the shoes data is", data);
          _.each(data.fav_shoes, function(look){
            console.log("inside each grid");
            var $look = gTemplate(look);
            $("#fav-shoes-container").append($look);
          });
        }
      });
      // all pieces to view
      $.ajax({
        url: "/api/users/" + user._id + "/favs/pieces",
        type: "GET",
        success: function(data){
          console.log("the pieces data is", data);
          _.each(data.fav_pieces, function(look){
            console.log("inside each grid");
            var $look = gTemplate(look);
            $("#fav-pieces-container").append($look);
          });
        }
      });
    });
  }
  //Guest Sign in
  $("#guest-btn").on("click", function(e){
    e.preventDefault();
    console.log("I logged in as guest");
    var tempUser = {};
        tempUser.email = "test@gmail.com";
        tempUser.password = "test";
    console.log(tempUser);
    $.ajax({
      url: "/login",
      type: "POST",
      data: tempUser,
      success: function(data){
        console.log(data);
        setLooksContainer(data);
        $("#currentUser").text("Username: " + data.username); 
      }
    });
  })


  //Sign Up
  $("#sign-up-btn").on("click", function(){
    console.log("I clicked sign-up-btn");
    if( $("div.row-login").hasClass("active-toggle") ){
      $("div.row-login").removeClass("active-toggle").slideUp("slow");
      $("div.row-sign-up").slideDown("slow").addClass("active-toggle");

    } else if( $("div.row-sign-up").hasClass("active-toggle") ){
      $("div.row-sign-up").slideUp("slow").removeClass("active-toggle");
    }else if( !$("div.row-sign-up").hasClass("active-toggle") && 
        !$("div.row-login").hasClass("active-toggle") ){
        $("div.row-sign-up").slideDown("slow").addClass("active-toggle");
    }
  });

  //Sign UP Submit Form
  $("#submit-sign-up-btn").on("click", function(e){
    e.preventDefault();
    console.log("I submitted sign up")
    var tempUser = {};
        tempUser.email = $("#sign-up-email").val();
        tempUser.username = $("#sign-up-username").val();
        tempUser.password = $("#sign-up-password").val();
    console.log(tempUser);
    $.ajax({
      url: "/api/users",
      type: "POST",
      data: tempUser,
      success: function(data){
        setLooksContainer(data);
        console.log("return user-", data);
      }
    });
 
    $("#form-sign-up").trigger("reset");

  });

  //Login
  $("#login-btn").on("click", function(){
    console.log("I clicked login-btn");
    if( $("div.row-sign-up").hasClass("active-toggle") ){
      $("div.row-sign-up").removeClass("active-toggle").slideUp("slow");
      $("div.row-login").slideDown("slow").addClass("active-toggle");

    } else if( $("div.row-login").hasClass("active-toggle") ){
      $("div.row-login").slideUp("slow").removeClass("active-toggle");
    }else if( !$("div.row-sign-up").hasClass("active-toggle") && 
              !$("div.row-login").hasClass("active-toggle") ){
              $("div.row-login").slideDown("slow").addClass("active-toggle");
    }
  });

  //Login submit
  $("#submit-login-btn").on("click", function(e){
    e.preventDefault();
    console.log("I submitted login")
    var tempUser = {};
        tempUser.email = $("#login-email").val();
        tempUser.password = $("#login-password").val();
    console.log(tempUser);
    $("div.row-login").slideUp("slow");
    $.ajax({
      url: "/login",
      type: "POST",
      data: tempUser,
      success: function(data){
        console.log(data);
        setLooksContainer(data) 
      }
    }); 
    $("#form-login").trigger("reset");
  });



  function imgExtractor( obj ){
    var tempImg = {};
    tempImg.url = obj.images.low_resolution.url;
    //tempImg.url = obj.images.standard_resolution.url; 

    return tempImg;
  }
});




