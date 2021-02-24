
function showMoney(turn, num) {
    var moneyShow = $('#money-' + turn);
    moneyShow.text(num);
}

function showAnimationPoint(point) {
    var dice = $('#dice');
    dice.css("background-image", "url(https://rayyyz.github.io/RichMan/img/骰子" + point + ".png)");
}

function showAnimationMove(turn) {
    var start = player[turn].curPos;
    var end = player[turn].nextPos;
    while (start != end) {
        ShowStepMove(turn, start);
        start = (start + 1) % 14;
    }
}

function ShowStepMove(turn, start) {
    var next = (start + 1) % 14;
    var chess = $('#chess-' + turn);

    chess.animate({
        top: getWalkPosTop(next),
        left: getWalkPosLeft(next)
    }, 200)
}

function showAnimationEvent(str) {
    var msgbox = $('#eventmsg');
    setTimeout(function () {
        msgbox.text(str);
    }, 800);
}

function showBoughtBlock(turn, pos) {
    var block = $('#build-block-' + pos);
    if (turn == 0) {
        block.css("border", "2px solid purple");
    } else {
        block.css("border", "2px solid red");
    }
    block.css("background-image", "url(https://rayyyz.github.io/RichMan/img/房子1.png)");
    block.css("background-size", "100% 100%");
}

function showUpdateBlock(pos) {
    var block = $('#build-block-' + pos);
    block.css("background-image", "url(https://rayyyz.github.io/RichMan/img/房子" + getLandLevel(pos) + ".png)");
}

function showAnimationTurn(turn) {
    var playerCur = $('#player-' + turn);
    playerCur.css("box-shadow", "8px 8px 5px 1px rgba(0, 0, 200, .2)");

    var playerOther = $('#player-' + (1 - turn));
    playerOther.css("box-shadow", "none");

}

function showButton() {
    var btn = $('.choose');
    btn.css('display', 'block');
}

function hiddenButton() {
    var btn = $('.choose');
    btn.css('display', 'none');
}