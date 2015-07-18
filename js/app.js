$(document).ready(function(){
  $("div.row-header").nextUntil("div.row-looks-container").hide();

  var template = _.template($("#looks-template").html() );
  var gTemplate = _.template($("#grid-template").html() );


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

  function gridRender(){
    $(".row-grid-icons").removeClass("hide");
    _.each(looks, function(look){
      console.log(look);
      var $look = gTemplate(look);
      $("#looks-container").append($look);
    });
  }



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



});




