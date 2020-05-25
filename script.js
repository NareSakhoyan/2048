/**
 * Created by user on 22/05/2020.
 */
let arr = [[], [], [], []];
let arrToCompare;
let currentPlace = [], currentValue=[];
let winScore = 2048;
let win = false;
let alertGameOver = true;

//stop scroll
window.onscroll = function () { window.scrollTo(0, 0); };

window.onload = function () {
    const body = document.getElementsByTagName('body')[0];

    body.addEventListener('keydown', (e)=>{
        let key = e.keyCode;
        if (key==38 || key==87 || key==75){//up, w, k
            moveUp();
        }
        else if(key==39 || key==68 || key==76){//right, d, l
            moveRight();
        }
        else if(key==40 || key==83 || key==74){//down, s, j
            moveDown();
        }
        else if(key==37 || key==65 || key==72){//left, a, h
            moveLeft();
        }
        else{
            //nothing
        }
    });
    newGame();
    // trying()
};

//erase all numbers and classes from tds
function clearBoard() {
    for(let i=0; i<=3; ++i){
        for(let j=0; j<=3; ++j){
            let elem = document.getElementById(`${i}${j}`);
            elem.innerHTML = '';
            elem.classList = '';
        }
    }
}

//default settings, calls newPlace 2 times
function newGame(){
    clearBoard();
    arr = [[], [], [], []];
    arrToCompare = [];
    currentPlace = [];
    currentValue=[];
    winScore = 2048;
    win = false;
    for(let i=0; i<2; ++i){
        newPlace();
    }
}

//gives random numbers 2 or 4, the probability to get 4 is 1/8
function random2or4(){
    let arr2or4 = [2, 2, 2, 2, 2, 2, 2, 4];//one of 8 is 4
    let arrLen = arr2or4.length-1;
    currentValue = arr2or4[Math.round(Math.random()*arrLen)];
    return currentValue;
}

//set and return currentPlace with two coords
function randomPlace(){
    let i, j;
    do{
        i = Math.round(Math.random()*3);
        j = Math.round(Math.random()*3);
    }
    while(arr[i][j]);
    currentPlace = [i, j];
    return currentPlace;
}

//updates UI according to currentPlace, makes animation
function updateTable() {
    // document.getElementById(`${currentPlace[0]}${currentPlace[1]}`).innerHTML = currentValue;
    let elem = document.getElementById(`${currentPlace[0]}${currentPlace[1]}`);
    let value = currentValue;
    elem.innerHTML = value;
    elem.classList = `number${value}`;
    elem.classList.add('open');
    setTimeout(()=>{
        elem.classList.remove('open');
    }, 180)
}

//set randomPlace
function newPlace() {
    let curr = randomPlace();
    arr[curr[0]][curr[1]] = random2or4();
    updateTable()
}

//move up step
function moveUp(){
    // console.log('Up');
    arrToCompare = arr;
    let tmpArr = changeArrays(arr);
    let mergedArr = mergeNumbersLeftOrUp(tmpArr);
    arr = changeArrays(mergedArr);
    callDeepUpdateFunc(arrToCompare, arr)
}

//move right step
function moveRight(){
    // console.log('Right');
    arrToCompare = arr;
    let mergedArr = mergeNumbersRightOrDown(arr);
    arr = mergedArr;
    callDeepUpdateFunc(arrToCompare, arr)
}

//move down step
function moveDown(){
    // console.log('Down');
    arrToCompare = arr;
    let tmpArr = changeArrays(arr);
    let mergedArr = mergeNumbersRightOrDown(tmpArr);
    arr = changeArrays(mergedArr);
    callDeepUpdateFunc(arrToCompare, arr)
}

//move left step
function moveLeft(){
    // console.log('Left');
    arrToCompare = arr;
    let mergedArr = mergeNumbersLeftOrUp(arr);
    arr = mergedArr;
    callDeepUpdateFunc(arrToCompare, arr)
}

function mergeNumbersRightOrDown(arr){//merging when pressed right or down arrow
    let finalMergedArr = [];
    let removedEmptiesArr = [];
    for(let i=0; i<=3; ++i){
        removedEmptiesArr = arr[i].filter(c=>!!c);//remove empty tiles
        let mergedArr = [];
        for(let j=removedEmptiesArr.length-1; j>=0; --j){
            let curr = removedEmptiesArr[j];
            if(curr==removedEmptiesArr[j-1]){
                curr*=2;//if they have the same value I just sum them
                checkWinScore(curr);
                --j;
            }
            mergedArr.push(curr);

        }
        while(mergedArr.length<=3){
            mergedArr.push('')
        }
        finalMergedArr.push(mergedArr.reverse());
    }
    return finalMergedArr
}

function mergeNumbersLeftOrUp(arr) {
    let finalMergedArr = [];
    let removedEmptiesArr = [];
    for(let i=0; i<=3; ++i){
        removedEmptiesArr = arr[i].filter(c=>!!c);//remove empty tiles
        let mergedArr = [];
        for(let j=0, len=removedEmptiesArr.length-1; j<=len; ++j){
            let curr = removedEmptiesArr[j];
            if(curr==removedEmptiesArr[j+1]){
                curr*=2;//if they have the same value I just sum them
                checkWinScore(curr);
                ++j;
            }
            mergedArr.push(curr);

        }
        while(mergedArr.length<=3){
            mergedArr.push('')
        }
        finalMergedArr.push(mergedArr);
    }
    return finalMergedArr;
}

//check whether current score is higher than winScore
function checkWinScore(curr) {
    if (curr == winScore){
        if(!win){
            winFunc();
            win = true;
        }
    }
    else if(curr>winScore){
        newHighScore(curr)
    }
}

//changing directions from vertical to horizontal or vice versa e.g [[1, 2], [3, 4]]=>[[1, 3], [2, 4]]
function changeArrays(originalArray) {
    let tmpArr = [[], [], [], []];
    for(let i=0; i<=3; ++i){
        for(let j=0; j<=3; ++j){
            tmpArr[i][j] = originalArray[j][i];
        }
    }
    return tmpArr;
}

//checks if there is a move or not
function callDeepUpdateFunc(arrToCompare, arr){
    if (arrToCompare.toString() != arr.toString()){
        deepUpdate();
    }
    else {
        // console.log("No moves")
    }
}

//updates UI according to arr
function deepUpdate(){
    for(let i=0; i<=3; ++i){
        for(let j=0; j<=3; ++j){
            let elem = document.getElementById(`${i}${j}`);
            let value = arr[i][j];
            elem.innerHTML = value;
            elem.classList = `number${value>winScore? 'high': value}`;
        }
    }
    newPlace();
    checkForGameOver();
}

function checkForGameOver(){
    for(let i=0; i<=3; ++i){
        for(let j=0; j<=3; ++j){
            if(!arr[i][j]){//if arr[i][j] == undefined || arr[i][j] == ''
                return false
            }
            if(j!=3){
                if(arr[i][j]==arr[i][j+1]){
                    return false
                }
            }
            if(i!=3){
                if(arr[i][j]==arr[i+1][j]){
                    return false
                }
            }

        }
    }
    if (alertGameOver){
        gameOver();
    }
    return true;
}

function gameOver() {
    setTimeout(()=>{
        alert('Game over \nStart new game');
        newGame()
    }, 200)
}

function winFunc() {
    console.log("WinFunc");
    alertGameOver = false;
    setTimeout(()=>{
        let txt = 'You Win! \nYou can continue or start new game';
        if (checkForGameOver()) {
            txt = 'You Win! \nStart new game';
            newGame();
        }
        alertGameOver = true;
        alert(txt);
    }, 200)

}

function newHighScore(curr) {
    winScore = curr;
    let resElem = document.querySelector('.res');
    resElem.innerHTML = 'Great, new high score!!!';
    resElem.style = 'visibility: visible;';
    setTimeout(()=>{
        resElem.style = 'visibility: hidden;';
    }, 1000);
}

//already filled arr for trying
// function trying(){
//     arr = [
//         [2, 4, 2, 4],
//         [4, 2, 4, 2],
//         [2, 4, 2, 8],
//         [8, 8, 2, 4]
//     ];
//     arrToCompare = [
//         [2, 4, 2, 4],
//         [4, 2, 4, 2],
//         [2, 4, 2, 8],
//         [8, 8, 2, 4]
//     ];
//     for(let i=0; i<=3; ++i){
//         for(let j=0; j<=3; ++j){
//             let elem = document.getElementById(`${i}${j}`);
//             let value = arr[i][j];
//             if (!!value){
//                 elem.innerHTML = value;
//                 elem.classList = `number${value}`;
//             }
//         }
//     }
// }