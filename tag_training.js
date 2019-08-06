var loops = [
    ["B", "A", "B", "A", "B"],
    ["B", "A", "B", "A", "A"],
    ["A", "A", "B", "B", "A"],
    ["A", "B", "B", "A", "A"],
    ["B", "A", "A", "B", "B"],
    ["A", "B", "A", "B", "A"]
]
var moves = [];
var enemyMoves = [];

$(document).ready(function() {
    renderLoops(loops);
    $("#reset").on("click", function() {
        resetForm();
    })
    $("#next_set").on("click", function() {
        highlightNext();
    })

    $(".player_controls").on("click", function() {
        moves.push($(this).html());
        $(".player_controls").prop("disabled", true);
        $(".enemy_controls").prop("disabled", false);
    });
    $(".enemy_controls").on("click", function() {
        $(".player_controls").prop("disabled", true).removeClass("prevent_click");
        enemyMoves.push($(this).html());
        suggestMove();
    });
});

function resetForm() {
    moves = [];
    enemyMoves = [];
    $(".player_controls").prop("disabled", false).removeClass("prevent_click");
    $(".enemy_controls").prop("disabled", true);
    $("#highlight_move").prop("hidden", false);
    $("#next_set").prop("disabled", true);
    renderLoops(loops);
}

function suggestMove() {
    var possibleMoves = loops.slice();
    var ruleOut = [];

    for(var i = 0; i < enemyMoves.length; i++) {
        // Rule out possible moves
        for(var j = 0; j < possibleMoves.length; j++) {
            if(possibleMoves[j][i] != enemyMoves[i]) {
                ruleOut.push(possibleMoves.splice(j, 1)[0]);
                j--;
            }
        }
        if(i == moves.length-1) {
            // Decide next move
            var averageMove = 0;
            for(var j = 0; j < possibleMoves.length; j++) {
                if(possibleMoves[j][i+1] == "A") {
                    averageMove++;
                } else {
                    averageMove--;
                }
            }
            averageMove = averageMove <= 0 ? "B" : "A";
            if(averageMove == "A") {
                moves.push("B");
            } else {
                moves.push("A");
            }
        }
    }
    // populate the suggested move
    var useNext = moves[moves.length-1];
    $("#player_"+useNext).prop("disabled", false).addClass("prevent_click");
    ruleOut = getIndeces(ruleOut);
    updateLoops(ruleOut, moves);
}

function renderLoops(possibleMoves) {
    var htmlString = "";
    for(var i = 0; i < possibleMoves.length; i++) {
        htmlString += "<div id=\"loop_" + i + "\" class=\"move_set\">";
        for(var j = 0; j < possibleMoves[i].length; j++) {
            htmlString += "<div class=\"" + possibleMoves[i][j] + "\">" + possibleMoves[i][j] + "</div>";
        }
        htmlString += "</div>";
    }
    htmlString += "<div id=\"highlight_move\"></div>";
    $("#move_chart").html(htmlString);
}

function updateLoops(ruleOut, moves) {
    for(var i = 0; i < ruleOut.length; i++) {
        $("#loop_"+ruleOut[i]).addClass("lowlight");
    }
    if(moves.length > loops[0].length) {
        $("#highlight_move").prop("hidden", true);
        $("#next_set").prop("disabled", false);
        $(".player_controls").prop("disabled", true);
        $(".enemy_controls").prop("disabled", true);
    } else {
        $("#highlight_move").css("left", (moves.length-1)*20+"%");
    }
}

function getIndeces(ruleOut) {
    var indeces = [];
    for(x in loops) {
        for(y in ruleOut) {
            if(loops[x] == ruleOut[y]) {
                indeces.push(x);
            }
        }
    }
    return indeces;
}

function highlightNext() {
    var currentIndex = $(".move_set:not(.lowlight)")[0];
    currentIndex = Number($(currentIndex).attr("id").split("_")[1]);
    var highlight = currentIndex == loops.length-1 ? 0 : currentIndex + 1;
    $("#loop_"+highlight).removeClass("lowlight");
    $("#loop_"+currentIndex).addClass("lowlight");
}
