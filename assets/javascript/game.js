// Initialize Firebase
var config = {
    apiKey: "AIzaSyCDUwOoLgJefEyW1WtCRSl-MkipeNvQR7Y",
    authDomain: "rps-multiplayer-f270a.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-f270a.firebaseio.com",
    projectId: "rps-multiplayer-f270a",
    storageBucket: "",
    messagingSenderId: "136818389861"
};
firebase.initializeApp(config);

var database = firebase.database();
var whichPlayer;

$(document).ready(function () {
    $("#add-player").on("click", function (event) {
        event.preventDefault();
        var name = $("#name-input").val().trim();
        createPlayer(name);
        updatePlayer();
    });

    var playersRef = database.ref('players/');
    playersRef.remove()
    playersRef.on('value', function (snapshot) {
        updatePlayer(snapshot.val());
    });

    var turnRef = database.ref('turn');
    turnRef.remove()
    turnRef.on('value', function (snapshot) {
        var turn = snapshot.val();
        if (turn == 1) {
            $("#p1").css("border-color", "deeppink");
            $("#p2").css("border-color", "aqua");
            if (whichPlayer == 1) {
                $("#rock").show();
                $("#paper").show();
                $("#scissors").show();
                $("#rock").on("click", function (e) {
                    choicePicked("Rock");
                });
                $("#paper").on("click", function (e) {
                    choicePicked("Paper");
                });
                $("#scissors").on("click", function (e) {
                    choicePicked("Scissors");
                });
                $("#rock2").hide();
                $("#paper2").hide();
                $("#scissors2").hide();
            } else {
                $("#rock").hide();
                $("#paper").hide();
                $("#scissors").hide();
                $("#rock2").hide();
                $("#paper2").hide();
                $("#scissors2").hide();
            }
        }
        else if (turn == 2) {
            $("#p2").css("border-color", "deeppink");
            $("#p1").css("border-color", "aqua");
            if (whichPlayer == 2) {
                $("#rock2").show();
                $("#paper2").show();
                $("#scissors2").show();
                $("#rock2").on("click", function (e) {
                    choicePicked("Rock");
                    calcWinner()
                });
                $("#paper2").on("click", function (e) {
                    choicePicked("Paper");
                    calcWinner()

                });
                $("#scissors2").on("click", function (e) {
                    choicePicked("Scissors");
                    calcWinner()
                });
                $("#rock").hide();
                $("#paper").hide();
                $("#scissors").hide();
            } else {
                $("#rock").hide();
                $("#paper").hide();
                $("#scissors").hide();
                $("#rock2").hide();
                $("#paper2").hide();
                $("#scissors2").hide();
            }
        };
    });
});

function choicePicked(choice) {
    database.ref("players/" + whichPlayer).update({
        choice: choice,
    });
    var nextTurn;
    if (whichPlayer == 1) {
        nextTurn = 2;
    } else if (whichPlayer == 2) {
        nextTurn = 1;
    }
    database.ref().update({
        turn: nextTurn,
    });
}

function calcWinner() {
    var playersRef = database.ref('players/');
    var players;
    playersRef.once('value', function (snapshot) {
        players = snapshot.val();
    });
    var p1Choice = players[1].choice;
    var p2Choice = players[2].choice;

    if ((p1Choice === "Rock") && (p2Choice === "Scissors")) {
        database.ref('players/1').update({
            wins: players[1].wins + 1,
        });
        database.ref('players/2').update({
            losses: players[2].losses + 1,
        });
        $("#wins").html(player[1].wins);
        $("#2losses").html(player[2].losses);

    } else if ((p1Choice === "Rock") && (p2Choice === "Paper")) {
        database.ref('players/1').update({
            losses: players[1].losses + 1,
        });
        database.ref('players/2').update({
            wins: players[2].wins + 1,
        });
        $("#losses").html(player[1].losses);
        $("#2wins").html(player[2].wins);

    } else if ((p1Choice === "Scissors") && (p2Choice === "Rock")) {
        database.ref('players/1').update({
            losses: players[1].losses + 1,
        });
        database.ref('players/2').update({
            wins: players[2].wins + 1,
        });
        $("#losses").html(player[1].losses);
        $("#2wins").html(player[2].wins);

    } else if ((p1Choice === "Scissors") && (p2Choice === "Paper")) {
        database.ref('players/1').update({
            wins: players[1].wins + 1,
        });
        database.ref('players/2').update({
            losses: players[2].losses + 1,
        });
        $("#wins").html(player[1].wins);
        $("#2losses").html(player[2].losses);

    } else if ((p1Choice === "Paper") && (p2Choice === "Rock")) {
        database.ref('players/1').update({
            wins: players[1].wins + 1,
        });
        database.ref('players/2').update({
            losses: players[2].losses + 1,
        });
        $("#wins").html(player[1].wins);
        $("#2losses").html(player[2].losses);

    } else if ((p1Choice === "Paper") && (p2Choice === "Scissors")) {
        database.ref('players/1').update({
            losses: players[1].losses + 1,
        });
        database.ref('players/2').update({
            wins: players[2].wins + 1,
        });
        $("#losses").html(player[1].losses);
        $("#2wins").html(player[2].wins);

    } else if (userGuess === computerGuess) {
        database.ref('players/1').update({
            ties: players[1].ties + 1,
        });
        database.ref('players/2').update({
            ties: players[2].ties + 1,
        });
    }
}

function nextRound() {
    database.ref("players/1").update({
        choice: "",
    });
    database.ref("players/2").update({
        choice: "",
    });
};

function updatePlayer(players) {
    if (players != null) {
        if (players[1] != null) {
            $("#waiting1").html(players[1].name);
        }
        if (players[2] != null) {
            $("#waiting2").html(players[2].name);
        };
    };
}

function createPlayer(name) {

    var player1;
    var playersRef = database.ref('players/1');
    playersRef.once('value', function (snapshot) {
        player1 = snapshot.val();
    });

    if (player1 == null) {
        database.ref('players/1').set({
            name: name,
            choice: "",
            wins: 0,
            losses: 0,
            ties: 0
        });
        whichPlayer = 1;
    } else {
        database.ref('players/2').set({
            name: name,
            choice: "",
            wins: 0,
            losses: 0,
            ties: 0
        });
        whichPlayer = 2;
        database.ref().update({
            turn: 1,
        })
    }
    $("#user-input").remove();
    $("#which-player").html("You are Player " + whichPlayer);
}


//   var computerChoices = ["r", "p", "s"];


  // This function is run whenever the user presses a key.
//   document.onkeyup = function(event) {

//     // Determines which key was pressed.
//     var userGuess = event.key;

//     // Randomly chooses a choice from the options array. This is the Computer's guess.
//     var computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];

//     // Reworked our code from last step to use "else if" instead of lots of if statements.

//     // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
//     if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {

//       if ((userGuess === "r") && (computerGuess === "s")) {
//         wins++;
//       } else if ((userGuess === "r") && (computerGuess === "p")) {
//         losses++;
//       } else if ((userGuess === "s") && (computerGuess === "r")) {
//         losses++;
//       } else if ((userGuess === "s") && (computerGuess === "p")) {
//         wins++;
//       } else if ((userGuess === "p") && (computerGuess === "r")) {
//         wins++;
//       } else if ((userGuess === "p") && (computerGuess === "s")) {
//         losses++;
//       } else if (userGuess === computerGuess) {
//         ties++;
//       }

//       // Creating a variable to hold our new HTML. Our HTML now keeps track of the user and computer guesses, and wins/losses/ties.
//       var html =
//         "<p>You chose: " + userGuess + "</p>" +
//         "<p>The computer chose: " + computerGuess + "</p>" +
//         "<p>wins: " + wins + "</p>" +
//         "<p>losses: " + losses + "</p>" +
//         "<p>ties: " + ties + "</p>";

//       // Set the inner HTML contents of the #game div to our html string
//       document.querySelector("#game").innerHTML = html;
//     }
//   };