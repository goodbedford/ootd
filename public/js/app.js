$(document).ready(function() {


  var template = _.template($("#looks-template").html());
  var gTemplate = _.template($("#grid-template").html());
  var baseUrl = "http://localhost:3000/api/";

  var scrollTop = $(window).scrollTop();
  var scrollNum = 10000;
  var TEN_GS = 10000;

  $(window).on("scroll", function(event) {

    if( window.scrollY > scrollNum ){
      console.log("scrollY:", window.scrollY);
      console.log("Add scroll num", scrollNum);
       moreOutfits();
      scrollNum += TEN_GS;
    }

  });
  //load page with looks

  checkCurrentUser();
  setCurrentUser();
  getLooks();
  // looksModeView();

  // $("div.row-sign-up").hide();
  // $("div.row-login").hide();
  var looks = [{
    url: "http://topmodafemei.ro/wp-content/uploads/2014/08/outfit6.png",
    createdDate: new Date()
  }, {
    url: "http://www.designsnext.com/wp-content/uploads/2014/05/Back-to-School-Outfit-Ideas-4.jpg",
    createdDate: new Date()
  }, {
    url: "https://s-media-cache-ak0.pinimg.com/236x/ea/af/95/eaaf95a776e011ee7f877b9daf166193.jpg",
    createdDate: new Date()
  }, {
    url: "https://cevalenti.files.wordpress.com/2013/08/casual-outfits-51.jpg",
    createdDate: new Date()
  }];

  //GET looks
  function getLooks() {
    $.ajax({
      url: "/api/looks",
      type: "GET",
      success: function(data) {
        console.log("look server", data);

        _.each(data, function(look) {
          look = imgExtractor(look);
            //console.log(look);
          var $look = template(look);
          $("#looks-container").append($look);
          looksModeView();
        });
      }
    });
  }
  ////////////Favorites ///////////////

  //Favs ALL
  function setLooksContainer(user) {
    //check for current user
    checkCurrentUser();
    //favs-all
    $("#looks-container").on("click", "button.icon-btn", function(e) {
      favActive(this);
      //console.log("this button is:", this);   
    });


    $("#looks-container").on("click", ".btn-all", function(e) {
      //e.preventDefault();
      //console.log("this in looks container 
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      //console.log("the selected img", $img.attr("src") );
      var favAll = {
        url: $img.attr("src")
      };
      // console.log("fav_all:", favAll);
      $.ajax({
        url: "/api/users/" + user._id + "/favs/all",
        type: "POST",
        data: favAll,
        success: function(data) {
          console.log("this post was add", data);
        }
      });
    });
    //favs-tops
    $("#looks-container").on("click", ".btn-tops", function(e) {
      //e.preventDefault();
      //console.log("this in looks container click-",$(this))
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      //console.log("the selected img", $img.attr("src") );
      var favTops = {
        url: $img.attr("src")
      };
      $.ajax({
        url: "/api/users/" + user._id + "/favs/tops",
        type: "POST",
        data: favTops,
        success: function(data) {
          console.log("this Tops post was add", data);
        }
      });
    });
    //favs-legs
    $("#looks-container").on("click", ".btn-legs", function(e) {
      //e.preventDefault();
      //console.log("this in looks container click-",$(this))
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      //console.log("the selected img", $img.attr("src") );
      var favLegs = {
        url: $img.attr("src")
      };
      $.ajax({
        url: "/api/users/" + user._id + "/favs/legs",
        type: "POST",
        data: favLegs,
        success: function(data) {
          console.log("this Legs post was add", data);
        }
      });
    });
    //favs-shoes
    $("#looks-container").on("click", ".btn-shoes", function(e) {
      //e.preventDefault();
      console.log("this in looks container click-", $(this));
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      console.log("the selected img", $img.attr("src"));
      var favShoes = {
        url: $img.attr("src")
      };
      $.ajax({
        url: "/api/users/" + user._id + "/favs/shoes",
        type: "POST",
        data: favShoes,
        success: function(data) {
          console.log("this shoes post was add", data);
        }
      });
    });
    //favs-pieces
    $("#looks-container").on("click", ".btn-pieces", function(e) {
      //e.preventDefault();
      //console.log("this in looks container click-",$(this))
      var $iconRow = $(this).parent().parent();
      //console.log("the iconRow", $iconRow.html() );
      var $img = $iconRow.prev(".row-looks").find("section img");
      //console.log("the selected img", $img.attr("src") );
      var favPieces = {
        url: $img.attr("src")
      };
      $.ajax({
        url: "/api/users/" + user._id + "/favs/pieces",
        type: "POST",
        data: favPieces,
        success: function(data) {
          console.log("this pieces post was add", data);
        }
      });
    });


    //Fav Click
    $("#fav-grid-btn").on("click", function(e) {
      console.log("i clicked fav btn", user._id);

      
      if ($("#grid-container").hasClass("grid-active")) {
        gridModeView();

        $("#grid-container").removeClass("grid-active");

        $("#fav-all-container").empty();
        $("#fav-tops-container").empty();
        $("#fav-legs-container").empty();
        $("#fav-shoes-container").empty();
        $("#fav-pieces-container").empty();
        //add all favs to view
        $.ajax({
          url: "/api/users/" + user._id + "/favs/all",
          type: "GET",
          success: function(data) {
            //console.log("the data is", data);

            _.each(data.fav_all, function(look) {
              //console.log("inside each grid look: ", look);
              var $look = gTemplate(look);
              $("#fav-all-container").prepend($look);
              imgErrorHandler();
            });
          }
        });
        //add all tops to view
        $.ajax({
          url: "/api/users/" + user._id + "/favs/tops",
          type: "GET",
          success: function(data) {
            console.log("the tops data is", data);
            _.each(data.fav_tops, function(look) {
              console.log("inside each grid");
              var $look = gTemplate(look);
              $("#fav-tops-container").prepend($look);
              imgErrorHandler();
            });
          }
        });
        // all legs to view
        $.ajax({
          url: "/api/users/" + user._id + "/favs/legs",
          type: "GET",
          success: function(data) {
            //console.log("the legs data is", data);
            _.each(data.fav_legs, function(look) {
              //console.log("inside each grid");
              var $look = gTemplate(look);
              $("#fav-legs-container").prepend($look);
              imgErrorHandler();

            });
          }
        });
        // all shoes to view
        $.ajax({
          url: "/api/users/" + user._id + "/favs/shoes",
          type: "GET",
          success: function(data) {
            console.log("the shoes data is", data);
            _.each(data.fav_shoes, function(look) {
              console.log("inside each grid");
              var $look = gTemplate(look);
              $("#fav-shoes-container").prepend($look);
              imgErrorHandler();

            });
          }
        });
        // all pieces to view
        $.ajax({
          url: "/api/users/" + user._id + "/favs/pieces",
          type: "GET",
          success: function(data) {
            //console.log("the pieces data is", data);
            _.each(data.fav_pieces, function(look) {
              console.log("inside each grid");
              var $look = gTemplate(look);
              $("#fav-pieces-container").prepend($look);
              imgErrorHandler();

            });
          }
        });
      } else {
        // looksModeView();
        getLooks();
      }
    });

    //Delete Grid images if user is login in
    $("div.row-looks-container").on("click", ".close-img", function(e) {
      var lookId = $(this).attr("data-index");
      var tag = $(this).attr("data-type");
      var url = $(this).prev("img").attr("src");
      var updateUser = {
        type: tag,
        userId: user._id,
        lookId: lookId
      };
      //send id to db for deleting
      deleteFromUser();
      deleteFromLook();
      $(this).parent().remove();

      function deleteFromUser() {
        $.ajax({
          url: "/api/users/" + user._id + "/favs/" + tag,
          type: "PUT",
          data: updateUser,
          success: function(data) {
            console.log("returned data from delete from user: ", data);
          }
        });
      }
      //console.log("the delete lookId: ", lookId);
      function deleteFromLook() {
        $.ajax({
          url: "/api/looks/" + lookId,
          type: "DELETE",
          success: function(data) {
            console.log("returned data from delete: ", data);
          }
        });
      }
    });

  }
  //Guest Sign in
  $("#guest-btn").on("click", function(e) {
    e.preventDefault();
    //console.log("I logged in as guest");
    var tempUser = {};
    tempUser.email = "test@gmail.com";
    tempUser.password = "test";
    //console.log(tempUser);
    $.ajax({
      url: "/login",
      type: "POST",
      data: tempUser,
      success: function(data) {
        console.log(data);

        setLooksContainer(data);
        //set locale storage session id
        localStorage.setItem("current_user", data.username);
        checkCurrentUser();
         looksModeView();
      }
    });
  });

  //Sign Up
  $("#sign-up-btn").on("click", function() {
    console.log("I clicked sign-up-btn");
    if ($("div.row-login").hasClass("active-toggle")) {
      $("div.row-login").removeClass("active-toggle").slideUp("fast");
      $("div.row-sign-up").slideDown("fast").addClass("active-toggle");

    } else if ($("div.row-sign-up").hasClass("active-toggle")) {
      $("div.row-sign-up").slideUp("fast").removeClass("active-toggle");
    } else if (!$("div.row-sign-up").hasClass("active-toggle") &&
      !$("div.row-login").hasClass("active-toggle")) {
      $("div.row-sign-up").slideDown("fast").addClass("active-toggle");
    }
  });

  //Sign UP Submit Form
  $("#submit-sign-up-btn").on("submit", function(e) {
    e.preventDefault();
    console.log("I submitted sign up");
    var tempUser = {};
    tempUser.email = $("#signUpEmail").val();
    tempUser.username = $("#signUpUsername").val();
    tempUser.password = $("#signUpPassword").val();
    console.log(tempUser);
    $.ajax({
      url: "/api/users",
      type: "POST",
      data: tempUser,
      success: function(data) {
        setLooksContainer(data);
        //console.log("return user-", data);
        
        //set locale storage session id
        localStorage.setItem("current_user", data.username);
        checkCurrentUser();
        // looksModeView();
      }
    });

  });

  //Login
  $("#login-btn").on("click", function() {
    console.log("I clicked login-btn");
    if ($("div.row-sign-up").hasClass("active-toggle")) {
      $("div.row-sign-up").removeClass("active-toggle").slideUp("fast");
      $("div.row-login").slideDown("fast").addClass("active-toggle");

    } else if ($("div.row-login").hasClass("active-toggle")) {
      $("div.row-login").slideUp("fast").removeClass("active-toggle");
    } else if (!$("div.row-sign-up").hasClass("active-toggle") &&
      !$("div.row-login").hasClass("active-toggle")) {
      $("div.row-login").slideDown("fast").addClass("active-toggle");
    }
  });

  //Login submit
  $("#submit-login-btn").on("submit", function(e) {
    e.preventDefault();
    console.log("I submitted login");
    var tempUser = {};
    tempUser.email = $("#login-email").val();
    tempUser.password = $("#login-password").val();
    console.log(tempUser);
    $("div.row-login").slideUp("fast");
    $.ajax({
      url: "/login",
      type: "POST",
      data: tempUser,
      success: function(data) {
        console.log(data);
        $("#grid-container").addClass("grid-active");
        setLooksContainer(data);
        //set locale storage session id
        localStorage.setItem("current_user", data.username);
        checkCurrentUser();
        // looksModeView();
      }
    });
    $("#form-login").trigger("reset");
  });
  //Logout 
  $("#logout-btn").on("click", function(e) {
    $.ajax({
      url: "/logout",
      type: "GET",
      success: function(data) {
        console.log(data);
        checkCurrentUser();
        showMenu();
        $("#grid-container").remove("grid-active").hide();
        $("#looks-container").show();
        getLooks();
        // end local storage session
        localStorage.removeItem("current_user");
        window.location.href="/";
      }
    });
  });

  // Menu Collapse
  $("#menu-collapse").on("click", function() {
    //showMenu();
    
   $("#fav-menu").slideToggle("fast");
    //$(this).toggleClass("glyphicon-plus").toggleClass("glyphicon-minus");
  });
  // Current Tab

  // More Outfits
  // $("#fav-more-btn").on("click", moreOutfits);

  function moreOutfits() {
    var current_user = localStorage.getItem("current_user");
    if( current_user){
      getLooks();
    }
  }
  // Helper function
  function imgExtractor(obj) {
    var tempImg = {};
    //tempImg.url = obj.images.low_resolution.url;
    tempImg.url = obj.images.standard_resolution.url;
    return tempImg;
  }

  // check for broken images
  function imgErrorHandler(){ 
      $("img").on("error", function(){
         //alert("error with image");
         console.log("this img error", $(this).data("index"));
         var btn = $(this).next("button.close-img");
         console.log("the btn is", btn);
         btn.trigger("click");
     });
  }

  function checkCurrentUser() {
        var current_user = localStorage.getItem("current_user");
        if (current_user === undefined || current_user === null) {
          $("#currentUser").text("Please Login:");
        } else {
          $("#currentUser").text("Logged in as: " + current_user);
          console.log("current user", current_user);
        }
  }
  function setCurrentUser(){

    if(localStorage.getItem("current_user")){
      $.ajax({
        url: "/api/current",
        type: "GET",
        success: function(currentUser) {
          console.log(currentUser);
          setLooksContainer(currentUser);
        } 
      });
    }

  }
  //return current User
  function showMenu() {
        var current_user = localStorage.getItem("current_user");
        //console.log("localstorage user:", current_user)
        
        //if current user show fav-menu
        if (current_user === undefined || current_user === null) {
          console.log("no current user");

        } else {
          if ($("#looks-mode-collapse").hasClass("grid-active") ){
            $("#looks-mode-collapse").show();
            //$("#fav-menu").slideToggle("fast");
            $("#menu-collapse").toggleClass("glyphicon-plus").toggleClass("glyphicon-minus");

            return;
          }

        $("#fav-menu").slideToggle("fast");
        $("#menu-collapse").toggleClass("glyphicon-plus").toggleClass("glyphicon-minus");

      }
  }

  function looksModeView(){
    var current_user = localStorage.getItem("current_user");
    var $fav_menu = $("#fav-menu");
    var $looks_collapse = $("#looks-mode-collapse");
    var $fav_grid_button = $("#fav-grid-btn");
    var $grid_container = $("#grid-container");
    var $looks_container = $("#looks-container");
    var $guest_btn = $("#guest-btn");
    var $login = $("#login-btn");
    var $sign_up_btn = $("#sign-up-btn");
    var $iconsRow = $(".icons-row");
    var $msgLoginHelp = $("#msg-login-help");
    if(current_user){
      $iconsRow.show();
      $msgLoginHelp.hide();
      $guest_btn.hide();
      $login.hide();
      $sign_up_btn.hide();
      $fav_menu.show();
      $fav_grid_button.show();
      $looks_collapse.hide();
      $grid_container.addClass("grid-active").hide();
      $looks_container.show();
      // $("#menu-collapse").addClass("glyphicon-plus").removeClass("glyphicon-minus");

    } else {
      $iconsRow.hide();
      $msgLoginHelp.show();
      $guest_btn.show();
      $login.show();
      $sign_up_btn.show();
      $fav_menu.show();
      $fav_menu.hide();
      $fav_grid_button.hide();
      $grid_container.removeClass("grid-active").hide();
      $looks_container.show();
      // $("#menu-collapse").addClass("glyphicon-plus").removeClass("glyphicon-minus");

    }
  }

  function gridModeView(){
    var current_user = localStorage.getItem("current_user");
    var $fav_menu = $("#fav-menu");
    var $looks_collapse = $("#looks-mode-collapse");
    var $fav_grid_button = $("#fav-grid-btn");
    var $grid_container = $("#grid-container");
    var $looks_container = $("#looks-container");

    
    if(current_user){

      $fav_menu.show();
      $fav_grid_button.show();
      $looks_collapse.show();
      $grid_container.addClass("grid-active").show();
      $looks_container.hide();

      $("#menu-collapse").addClass("glyphicon-plus");

    } else {
      console.log("error grid view");
    }
  }

  function favActive(btn) {
    $(btn).addClass("fav-active");
    $(btn).on("mouseout", function() {
      $(this).focusout();
    });
  }
   
});






