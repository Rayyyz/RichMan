var turn = 0;   //表示当前轮到的player
var point = 0;  //表示骰子掷出的点数

var chooseEventBuy = false;
var chooseEventUpdate = false;

var player = new Array();
var walkBlock = new Array();
var buildBlock = new Array();
var specialBlock = new Array();

$(document).ready(function () {
    newgame();
})

function newgame() {
    //初始化地图格子
    initMap();
    //初始化角色及金钱
    initPlayer();
    //初始化地图建筑状态
    initBuild();
}

function initMap() {
    for (let i = 0; i < 14; i++) {
        {
            var walkblock = $("#walk-block-" + i);
            walkblock.css('top', getWalkPosTop(i));
            walkblock.css('left', getWalkPosLeft(i));
        }
    }
    for (let i = 0; i < 13; i++) {
        {
            if (i == 6) continue;
            var buildblock = $("#build-block-" + i);
            buildblock.css('top', getBuildPosTop(i));
            buildblock.css('left', getBuildPosLeft(i));
        }
    }
    for (let i = 0; i < 2; i++) {
        var specialblock = $("#special-block-" + i);
        specialblock.css('top', getSpecialPosTop(i));
        specialblock.css('left', getSpecialPosLeft(i));
    }
}

function initPlayer() {
    for (let i = 0; i < 2 && !player[i]; i++) {
        player[i] = new Object();
        player[i].money = 10000;
        player[i].curPos = 0;
        player[i].nextPos = 0;
        //显示角色金钱变化
        showMoney(i, player[i].money);
        $('#chess-' + i).css("top", getWalkPosTop(0));
        $('#chess-' + i).css("left", getWalkPosLeft(0));
    }
    player[0].name = '钱夫人';
    player[1].name = '孙小美';

    turn = 0;
    showAnimationTurn(turn);
}

function initBuild() {
    for (let i = 0; i < 13 && !buildBlock[i]; i++) {
        if (i == 6) continue;
        buildBlock[i] = new Object();
        buildBlock[i].owner = '';
        buildBlock[i].ownerIndex = '';
        buildBlock[i].level = 0;                //地皮等级      
        buildBlock[i].name = mapdata[i].name;   //地皮名称
        buildBlock[i].price = mapdata[i].price; //地皮价值
        buildBlock[i].passcost = mapdata[i].passcost;    //过路费
        buildBlock[i].updatecost = mapdata[i].updatecost; //升级建筑花费
        buildBlock[i].levelplus = mapdata[i].levelplus;   //每一级提升过路费
    }
}

function isGameOver() {
    for (let i = 0; i < 2; i++) {
        if (player[i].money < 0) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    for (let i = 0; i < 2; i++) {
        if (player[i].money < 0) {
            alert("游戏结束！" + player[i].name + "输了。");
        }
    }
}

//投骰子
function getPoint() {
    //禁用骰子
    $('#dice').removeAttr("onclick");
    point = parseInt(Math.floor(Math.random() * 6 + 1));
    showAnimationPoint(point);
    playerMove();

    if (!isGameOver()) {
        exchangeTurn();
    } else {
        gameOver();
    }

}

//角色切换
function exchangeTurn() {
    if (!chooseEventBuy && !chooseEventUpdate) {
        turn = 1 - turn;
        showAnimationTurn(turn);
        //可用骰子
        $('#dice').attr("onclick", "getPoint()");
    }
    else {
        //500毫秒轮询一次
        setTimeout(exchangeTurn, 500);
    }
}

//角色移动
function playerMove() {
    playerPosChange(turn, point);
    showAnimationMove(turn);
    player[turn].curPos = player[turn].nextPos;
    //判断事件
    eventJudge();
}

function eventJudge() {
    var pos = player[turn].curPos;

    if (pos == 6 || pos == 13) {
        //发生随机事件
        randomEvent();
    } else {
        if (!buildBlock[pos].owner) {
            //买地事件
            eventBuyBlock();
        }
        else if (buildBlock[pos].owner == player[turn].name) {
            //升级土地事件
            eventUpdateBlock();
        } else {
            //付钱事件
            eventPayPasscost();
        }
    }

}

//随机事件
function randomEvent() {
    var luck = parseInt(Math.floor(Math.random() * 2));
    switch (luck) {
        case 0:
            eventAddMoney();
            break;
        case 1:
            eventLoseMoney();
            break;
        default:
            break;
    }
}

function eventAddMoney() {
    player[turn].money += 800;
    showMoney(turn, player[turn].money);
    var str = "天降横彩！你买的幸运彩票中奖了800元！"
    showAnimationEvent(str);
}

function eventLoseMoney() {
    player[turn].money -= 500;
    showMoney(turn, player[turn].money);
    var str = "不幸降临！你在逛街的时候被小偷窃取500元。"
    showAnimationEvent(str);
}

//买地事件
function eventBuyBlock() {
    var pos = player[turn].curPos;
    var name = buildBlock[pos].name;
    var price = buildBlock[pos].price;
    var str = "这块土地叫" + name + ",价格为" + price + "元.请问是否购买？";
    showAnimationEvent(str);

    chooseEventBuy = true;
    showButton();
}

function buyBlock(pos) {
    if (buildBlock[pos].price > player[turn].money) {
        var str = "金钱不足，购买失败！";
        showAnimationEvent(str);
    } else {
        player[turn].money -= buildBlock[pos].price;
        showMoney(turn, player[turn].money);
        buildBlock[pos].owner = player[turn].name;
        buildBlock[pos].ownerIndex = turn;
        buildBlock[pos].level += 1;
        showBoughtBlock(turn, pos);

        var str = "购买成功！";
        showAnimationEvent(str);

    }
}

//升级土地事件
function eventUpdateBlock() {
    var pos = player[turn].curPos;
    var level = buildBlock[pos].level;
    var updatecost = buildBlock[pos].updatecost;

    var str = "当前土地等级为" + level + ",升级价格为" + updatecost + "元.请问是否升级？";
    showAnimationEvent(str);

    chooseEventUpdate = true;
    showButton();
}

function updateBlock(pos) {
    if (buildBlock[pos].updatecost > player[turn].money) {
        var str = "金钱不足，升级失败！";
        showAnimationEvent(str);
    } else {
        player[turn].money -= buildBlock[pos].updatecost;
        showMoney(turn, player[turn].money);
        buildBlock[pos].level += 1;
        showUpdateBlock(pos);
        buildBlock[pos].passcost += buildBlock[pos].levelplus;

        var str = "升级成功！";
        showAnimationEvent(str);

    }
}

//付钱事件
function eventPayPasscost() {
    var pos = player[turn].curPos;
    var to = buildBlock[pos].ownerIndex;
    var cost = buildBlock[pos].passcost;

    player[turn].money -= cost;
    player[to].money += cost;
    showMoney(turn, player[turn].money);
    showMoney(to, player[to].money);

    var str = player[turn].name + "付给了" + player[to].name + "过路费" + cost + "元。";
    showAnimationEvent(str);

}

//选择
function chooseYes() {
    if (chooseEventBuy) {
        buyBlock(player[turn].curPos);
        chooseEventBuy = false;
        hiddenButton();
    } else if (chooseEventUpdate) {
        updateBlock(player[turn].curPos);
        chooseEventUpdate = false;
        hiddenButton();
    }

}

function chooseNo() {
    chooseEventBuy = false;
    chooseEventUpdate = false;
    hiddenButton();

}
