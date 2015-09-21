$(function(){
	var main = $("#main");

	var cardContainer = $("<div>", {
		"class": "col-sm-2 card-container"
	});

	var card = $("<div>", {
		"class": "col-sm-2 card"
	});


	main.children(".hand").each(function(){
		for(var i = 0; i < 5; i++){
			var tmpCard = card.clone().appendTo($(this));
			if(i==0){
				tmpCard.addClass("col-sm-offset-1");
			}
		}
	});

	// $(".row").on("click", ".card-container", function(){

	// });

});