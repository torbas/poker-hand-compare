$(function(){

	var handlers = {
		pushArray: function(options){
			var arr = [];
			options.each(function(){
				arr.push($(this).text());
			});
			return arr;
		},
		//purpose of this is to make sure a hand doesn't have 5 duplicates
		validateHand: function(suits, numbers){
			var count = 0;
			var current = "";

			for(var i=0; i<5; i++){
				var card = suits[i] + numbers[i];
				if(card != current){
					current = card;
					count = 0;
				}
				count++;
			}
			
			return !(count==5);
		}
	};

	var main = $("#main");

	var cardContainer = $("<div>", {
		"class": "col-sm-2 card-container"
	});

	var card = $("<div>", {
		"class": "col-sm-12 card"
	});

	var cardSuit = $("<select>",{
		"class": "col-sm-6 suit-select"
	});

	var cardNumber = $("<select>",{
		"class": "col-sm-6 number-select"
	});

	var compareBtn = $("<button>",{
		"class": "col-sm-12 btn btn-primary",
		"id": "compare-btn",
		"text": "Compare"
	});

	var suits = ["&spades;", "&hearts;", "&clubs;", "&diams;"];

	//Jack 11, Queen 12, King 13, Ace 14
	for(var n=1; n<=14; n++){
		var option = $("<option>").text(n);
		option.appendTo(cardNumber);
	}

	for(var s=0; s<suits.length; s++){
		var option = $("<option>").html(suits[s]);
		option.appendTo(cardSuit);
	}

	cardSuit.appendTo(cardContainer);
	cardNumber.appendTo(cardContainer);
	card.appendTo(cardContainer);
	compareBtn.appendTo(main);

	main.children(".hand").each(function(){
		for(var i = 0; i < 5; i++){
			var tmpContainer = cardContainer.clone().appendTo($(this));
			if(i==0){
				tmpContainer.addClass("col-sm-offset-1");
			}
		}
	});

	$("#main").on("click", "#compare-btn", function(){

		var player1 = $("#1");
		var player2 = $("#2");

		var player1Suits = handlers.pushArray(player1.find(".suit-select option:selected"));
		var player2Suits = handlers.pushArray(player2.find(".suit-select option:selected"));

		var player1Nums = handlers.pushArray(player1.find(".number-select option:selected"));
		var player2Nums = handlers.pushArray(player2.find(".number-select option:selected"));

		var player1Valid = handlers.validateHand(player1Suits, player1Nums);
		var player2Valid = handlers.validateHand(player2Suits, player2Nums);

		if(!player1Valid||!player2Valid){
			alert("One of the hands has five duplicates");
			return;
		}
		
	});

});