
//确定棋盘格子位置
function getWalkPosTop(i) {
    if (i <= 5)
        return 140;
    else if (i == 6 || i == 13)
        return 260;
    else
        return 380;
}

function getWalkPosLeft(i) {
    if (i <= 5)
        return 250 + i * 120;
    else if (i == 6)
        return 250 + 5 * 120;
    else if (i == 13)
        return 250;
    else
        return 250 + (12 - i) * 120;
}

function getBuildPosTop(i) {
    if (i <= 5) return 20;
    else return 500;
}

function getBuildPosLeft(i) {
    if (i <= 5)
        return 250 + i * 120;
    else
        return 250 + (12 - i) * 120;
}

function getSpecialPosTop(i) {
    return 260;
}

function getSpecialPosLeft(i) {
    if (i == 0)
        return 130;
    else
        return 970;
}

function playerPosChange(turn, point) {
    player[turn].nextPos = (player[turn].curPos + point) % 14;
    return;
}

function getLandLevel(pos) {
    return buildBlock[pos].level;
}