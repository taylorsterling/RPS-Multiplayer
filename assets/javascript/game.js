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

    $("#current-message").html("Welcome!");

    var playersRef = database.ref('players/');
    playersRef.remove()
    playersRef.on('value', function (snapshot) {
        updatePlayer(snapshot.val());
    });

    var turnRef = database.ref('turn');
    turnRef.remove()

    addClickEventsToButtons();
    displayWinsLossses();

    // do this everytime turn changes, this controls the flow of game
    turnRef.on('value', function (snapshot) {
        var turn = snapshot.val();
        if (turn == 1) {
            $("#p1").css("border-color", "deeppink");
            $("#p2").css("border-color", "aqua");
            
            database.ref('players/2/name').once('value', function (snapshot) {
                $("#current-message").html("Waiting for " + players[1]);
            });

            if (whichPlayer == 1) {
                $("#rock").show();
                $("#paper").show();
                $("#scissors").show();
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
            database.ref('players/2/name').once('value', function (snapshot) {
                $("#current-message").html("Waiting for " + players[2]);
            });
            if (whichPlayer == 2) {
                $("#rock2").show();
                $("#paper2").show();
                $("#scissors2").show();
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

function addClickEventsToButtons() {
    $("#rock").on("click", function (e) {
        choicePicked("Rock");
    });
    $("#paper").on("click", function (e) {
        choicePicked("Paper");
    });
    $("#scissors").on("click", function (e) {
        choicePicked("Scissors");
    });
    $("#rock2").on("click", function (e) {
        choicePicked("Rock");
        calcWinner();
    });
    $("#paper2").on("click", function (e) {
        choicePicked("Paper");
        calcWinner();
    });
    $("#scissors2").on("click", function (e) {
        choicePicked("Scissors");
        calcWinner();
    });
}

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
    var winner;

    if ((p1Choice === "Rock") && (p2Choice === "Scissors")) {
        winner = 1;

    } else if ((p1Choice === "Rock") && (p2Choice === "Paper")) {
        winner = 2;

    } else if ((p1Choice === "Scissors") && (p2Choice === "Rock")) {
        winner = 2;

    } else if ((p1Choice === "Scissors") && (p2Choice === "Paper")) {
        winner = 1;

    } else if ((p1Choice === "Paper") && (p2Choice === "Rock")) {
        winner = 1;

    } else if ((p1Choice === "Paper") && (p2Choice === "Scissors")) {
        winner = 2;

    } else if (userGuess === computerGuess) {

        winner = 0;
        database.ref('players/1').update({
            ties: players[1].ties + 1,
        });
        database.ref('players/2').update({
            ties: players[2].ties + 1,
        });
    }

    if (winner === 1) {
        database.ref('players/1').update({
            wins: players[1].wins + 1,
        });
        database.ref('players/2').update({
            losses: players[2].losses + 1,
        });

    } else if (winner === 2) {
        database.ref('players/2').update({
            wins: players[2].wins + 1,
        });
        database.ref('players/1').update({
            losses: players[1].losses + 1,
        });

    }

    $("#current-message").html("Winner: " + players[winner].name);
    setTimeout(nextRound, 4000);
}

function nextRound() {
    database.ref().update({
        turn: 1,
    })
};

function displayWinsLossses() {
    database.ref('players/1/wins').on('value', function (snapshot) {
        if (snapshot.val() != null) {
            $("#wins").html("Wins: " + snapshot.val());
        }
    });

    database.ref('players/1/losses').on('value', function (snapshot) {
        if (snapshot.val() != null) {
            $("#losses").html("Losses: " + snapshot.val());
        }
    });

    database.ref('players/2/wins').on('value', function (snapshot) {
        if (snapshot.val() != null) {
            $("#2wins").html("Wins: " + snapshot.val());
        }
    });

    database.ref('players/2/losses').on('value', function (snapshot) {
        if (snapshot.val() != null) {
            $("#2losses").html("Losses: " + snapshot.val());
        }
    });
}

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
