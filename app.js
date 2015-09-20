$(function(){
	var main = $("#main");

	var card = $("<div>", {
		"class": "col-md-2 card"
	});

	main.children(".hand").each(function(){
		for(var i = 0; i < 5; i++){
			card.clone().appendTo($(this));
		}
	});

});