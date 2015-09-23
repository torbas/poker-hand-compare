$(function(){

	var handlers = {
		pushArray: function(options){
			var arr = [];
			options.each(function(){
				arr.push($(this).val());
			});
			return arr;
		},
		//purpose of this is to make sure a hand doesn't have 5 duplicates
		validateHand: function(hand){
			var count = 0;
			var current = {};
			current["suit"] = "";
			current["num"] = 0;

			for(var i=0; i<5; i++){
				//only occurs if a card with the same suit appears twice or more
				if(count > 1){
					break;
				}
				var card = {};
				card["suit"] = hand[i].suit;
				card["num"] = hand[i].num;
				if(card.suit != current.suit || card.num != current.num){
					current.suit = card.suit;
					current.num = card.num;
					count = 0;
				}
				count++;
			}
			
			return !(count>1);
		},
		compareSuit: function(a, b){

			if(a.suit < b.suit){
				return -1;
			}else if(a.suit > b.suit){
				return 1;
			}else{
				return 0;
			}
		},
		compareNum: function(a, b){

			if(a.suit == b.suit){
				return a.number - b.number;
			}else{
				return 0;
			}
		},
		sortHand: function(suits, numbers){
			var handArr = [];

			for(var i=0; i<5; i++){
				var card = {};
				card["suit"] = suits[i]; 
				card["num"] = numbers[i];
				handArr.push(card);
			}

			return handArr.sort(handlers.compareSuit).sort(handlers.compareNum);

		},
		determineDuplicates: function(hand){
			//sort by numbers
			var numSorted = hand.sort(function(a,b){ return a.num - b.num});
			var count = 0;
			var duplicates = [];
			var current = {};
			current["suit"] = "";
			current["num"] = 0;

			for(var i=0; i<5; i++){
				var card = {};
				card["suit"] = hand[i].suit;
				card["num"] = hand[i].num;
				if(card.num != current.num){
					count++;
					duplicates[count-1] = [];
					current.suit = card.suit;
					current.num = card.num;
				}
				duplicates[count-1].push(card);
			}

			var type = "";
			var pairsCount = 0;
			var threesCount = 0;
			for(var d=0; d<duplicates.length; d++){
				if(duplicates[d].length <= 1){
					continue;
				}else if(duplicates[d].length == 4){
					type = "four of a kind";
					break;
				}else if(duplicates[d].length == 2){
					pairsCount++;
				}else if(duplicates[d].length == 3){
					threesCount++;
				}
			}

			if(threesCount == 1 && pairsCount == 1){
				type = "full house";
			}

			if(threesCount == 0 && pairsCount == 1){
				type = "one pair"
			}

			if(threesCount == 0 && pairsCount == 2){
				type = "two pair"
			}

			if(threesCount == 1 && pairsCount == 0){
				type = "three of a kind"
			}
			
			return type;

		},
		determineFlush: function(hand){
			var count = 0;
			var type = "";

			for(var s=0; s<hand.length-1; s++){
				var current = hand[s].suit;
				var next = hand[s+1].suit;
				if(current == next){
					count++;
				}
			}

			if(count == 4){
				type = "flush";
			}

			return type;

		},
		determineStraight: function(hand){
			var numSorted = hand.sort(function(a,b){ return a.num - b.num});
			var type = "";
			var highest = 0;
			var count = 0;

			for(var s=0; s<hand.length-1; s++){
				var current = parseInt(numSorted[s].num)+1;
				var next = parseInt(numSorted[s+1].num);
				if(current==next){
					count++;
				}
				highest = next;
			}

			//since its sorted then royal straight if highest = 14
			if(highest == 14 && count == 4){
				type = "royal straight";
			}else if(highest != 14 && count == 4){
				type = "straight"
			}

			return type;


		},
		determineHand: function(hand){
			var duplicateRes = handlers.determineDuplicates(hand);
			var straightRes = handlers.determineStraight(hand);
			var flushRes = handlers.determineFlush(hand);
			
			if(duplicateRes != ""){
				return duplicateRes;
			}else{
				if(straightRes != "" && flushRes != ""){
					return straightRes +" "+ flushRes;
				}

				if(straightRes != "" && flushRes == ""){
					return straightRes;
				}

				if(straightRes == "" && flushRes != ""){
					return flushRes;
				}

				return false;
			}
		},
		player1Win: function(player1, player2){
			player1.css("background-color", "#99FF33");
			player2.css("background-color", "#FFA3A3");
		},
		player2Win: function(player1, player2){
			player2.css("background-color", "#99FF33");
			player1.css("background-color", "#FFA3A3");
		},
		bothWin: function(player1, player2){
			player1.css("background-color", "#99FF33");
			player2.css("background-color", "#99FF33");
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
		"class": "col-xs-12 suit-select"
	});

	var cardNumber = $("<select>",{
		"class": "col-xs-12 number-select"
	});

	var compareBtn = $("<button>",{
		"class": "col-sm-12 btn btn-primary",
		"id": "compare-btn",
		"text": "Compare"
	});

	var suits = ["&spades;", "&hearts;", "&clubs;", "&diams;"];

	//Jack 11, Queen 12, King 13, Ace 14
	for(var n=1; n<=14; n++){
		var number;
		switch(n){
			case 11:
				number = "J";
				break;
			case 12:
				number = "Q";
				break;
			case 13:
				number = "K";
				break;
			case 14:
				number = "A";
				break;
			default:
				number = n;
		}
		var option = $("<option>", {"value": n}).text(number);
		option.appendTo(cardNumber);
	}

	for(var s=0; s<suits.length; s++){
		var suit;
		switch(s){
			case 0:
				suit = "S";
				break;
			case 1:
				suit = "H";
				break;
			case 2:
				suit = "C";
				break;
			case 3:
				suit = "D";
				break;
		}
		var option = $("<option>", {"value":suit}).html(suits[s]);
		option.appendTo(cardSuit);
	}

	cardSuit.appendTo(card);
	cardNumber.appendTo(card);
	card.appendTo(cardContainer);
	compareBtn.appendTo(main);

	main.children(".hand").each(function(){
		for(var i=0; i<5; i++){
			var tmpContainer = cardContainer.clone().appendTo($(this));
			if(i == 0){
				tmpContainer.addClass("col-sm-offset-1");
			}
		}
	});

	var ranks = {};
	ranks["one pair"] = 1;
	ranks["two pair"] = 2;
	ranks["three of a kind"] = 3;
	ranks["straight"] = 4;
	ranks["royal straight"] = 4;
	ranks["flush"] = 5;
	ranks["full house"] = 6;
	ranks["four of a kind"] = 7;
	ranks["straight flush"] = 8;
	ranks["royal straight flush"] = 9;


	$("#main").on("click", "#compare-btn", function(){

		var messageDiv = $("#message");

		var player1 = $("#1");
		var player2 = $("#2");

		var player1Suits = handlers.pushArray(player1.find(".suit-select option:selected"));
		var player2Suits = handlers.pushArray(player2.find(".suit-select option:selected"));

		var player1Nums = handlers.pushArray(player1.find(".number-select option:selected"));
		var player2Nums = handlers.pushArray(player2.find(".number-select option:selected"));

		var player1Hand = handlers.sortHand(player1Suits, player1Nums);
		var player2Hand = handlers.sortHand(player2Suits, player2Nums);

		var player1Valid = handlers.validateHand(player1Hand);
		var player2Valid = handlers.validateHand(player2Hand);

		if(!player1Valid||!player2Valid){
			messageDiv.addClass("alert alert-danger").text("One of the hands has too many duplicates");
			return;
		}else{
			messageDiv.removeClass("alert alert-danger").text("");
		}

		var player1Res = handlers.determineHand(player1Hand);
		var player2Res = handlers.determineHand(player2Hand);

		var player1Msg = player1Res;
		var player2Msg = player2Res;

		if(!player1Msg){
			player1Msg = "high card";
		}

		if(!player2Msg){
			player2Msg = "high card";
		}

		player1.children("h2").append(" "+player1Msg.toUpperCase());
		player2.children("h2").append(" "+player2Msg.toUpperCase());

		if(player1Res && player2Res){
			//compare if player 1 or player 2 wins
			if(ranks[player1Res] > ranks[player2Res]){
				handlers.player1Win(player1, player2);
			}

			if(ranks[player1Res] < ranks[player2Res]){
				handlers.player2Win(player1, player2);
			}

			if(ranks[player1Res] == ranks[player2Res]){
				handlers.bothWin(player1, player2);
			}

			return;

		}

		console.log(player1Res, player2Res);

		if(!player1Res && !player2Res){
			//compare high card
			var player1Highest = player1Hand.sort(function(a,b){ return b.num - a.num})[0];
			var player2Highest = player2Hand.sort(function(a,b){ return b.num - a.num})[0];

			var suitRanks = {};
			suitRanks["D"] = 1;
			suitRanks["C"] = 2;
			suitRanks["H"] = 3;
			suitRanks["S"] = 4;

			var player1Suit = suitRanks[player1Highest.suit];
			var player2Suit = suitRanks[player2Highest.suit];

			if(player1Highest.num > player2Highest.num){
				handlers.player1Win(player1, player2);
			}

			if(player1Highest.num < player2Highest.num){
				handlers.player2Win(player1, player2);
			}

			if(player1Highest.num == player2Highest.num){
				if(player1Suit > player2Suit){
					handlers.player1Win(player1, player2);
				}

				if(player1Suit < player2Suit){
					handlers.player2Win(player1, player2);
				}

				if(player1Suit == player2Suit){
					handlers.bothWin(player1, player2);
				}
			}

			player1Res = "high card";
			player2Res = "high card";

			return;
			
		}

		if(!player2Res){
			//player 1 wins
			handlers.player1Win(player1, player2);
			player2Res = "high card";
			return;
		}

		if(!player1Res){
			//player 2 wins
			handlers.player2Win(player1, player2);
			player1Res = "high card";
			return;
		}
		
	});

});