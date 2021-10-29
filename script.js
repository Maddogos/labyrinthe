const m='m'; //représente un mur
const p='p'; //représente le personnage
const b='b'; //représente le chemin
const f="f"; //représente le trophée 

const moveKeys = {
    38 : "top",
    37 : "left",
    40 : "bottom",
    39 : "right"
};

var chrono;
var gameOn = false;

xperso=1; //position initial du personnage sur l'axe X
yperso=1; //postition initial du personnage sur l'axe Y
//tableau à double entrée représentant votre labyrinthe, vous pouvez le modifier pour comprendre le fonctionnement
var laby = [[m,m,m,m,m,m,m,m,m,m],
            [m,p,m,b,b,b,b,b,b,m],
            [m,b,b,b,m,m,m,m,b,m],
            [m,b,m,b,b,b,b,m,b,m],
            [m,b,m,m,b,m,b,m,m,m],
            [m,b,b,b,b,m,b,b,b,f],
            [m,m,m,m,m,m,m,m,m,m]];
var nbPas;
var temps ;

function init () {
    try {
        clearInterval(chrono)
    } catch {}
    nbPas = 0;
    timerElement.innerText = `00:00`
    nbPasElement.innerText = ""
    temps = departMinutes * 60;
    laby = [[m,m,m,m,m,m,m,m,m,m],
            [m,p,m,b,b,b,b,b,b,m],
            [m,b,b,b,m,m,m,m,b,m],
            [m,b,m,b,b,b,b,m,b,m],
            [m,b,m,m,b,m,b,m,m,m],
            [m,b,b,b,b,m,b,b,b,f],
            [m,m,m,m,m,m,m,m,m,m]];
    afficheLaby(); 
    setTimer(); 
    listeners(getCasesPos())
    gameOn = true;

}

function afficheLaby() //ne rien modifier dans cette fonction
{
    var leLaby=document.getElementById("laby");
    insertion="<table border=0 cellspacing=0 cellpadding=0>";
    
    
    for(i=0;i<7;i++)
    {
    insertion+="<tr>";
        for(j=0;j<10;j++)
        {
            if (laby[i][j]==m)
            {
            insertion+="<td class='m'>";
            insertion+="<img width='52'height='52' src='Assets/stonewall.png'>";
            insertion+="</td>";
            }
            if (laby[i][j]==p)
            {
            insertion+="<td class='p'>";
            insertion+="<img width='52' height='52' style='background-image:Assets/Ground.png' src='Assets/Heros.png'>";
            insertion+="</td>";
            }
            if (laby[i][j]==b)
            {
            insertion+="<td class='b'>";
            insertion+="<img width='52' height='52' src='Assets/Ground.png'>";
            insertion+="</td>";
            }
            if (laby[i][j]==f)
            {
            insertion+="<td class='f'>";
            insertion+="<img width='52' height='52' src='Assets/Trophy.png'>";
            insertion+="</td>";
            }
                
        }
        insertion+="</tr>";

    }  
    insertion+="</table>";
    leLaby.innerHTML=insertion;
    
}

function getCasesPos () {
    let trList = Object.values(document.querySelectorAll("tr"));
    let tabResult = [];

    for (let i = 0; i < trList.length; i++) {
        let tdList = Object.values(trList[i].querySelectorAll("td"));
        let ligneResult = [];

        for (let j = 0; j < tdList.length; j++) {
            let objectInser = {HTMLObject : tdList[j], content : laby[i][j], x : j, y : i};
            ligneResult.push(objectInser)
        }

        tabResult.push(ligneResult)
    }

    return tabResult

}

function listeners (tab) {
    for (let i = 0; i < tab.length; i++) {
        for (let j = 0; j < tab[i].length; j++) {
            let currentCase = tab[i][j]

            let charPos = getCharPos();
            let xDiff = currentCase.x - charPos.x;
            let yDiff = currentCase.y - charPos.y;

            let direction;

            switch ([xDiff, yDiff].join('')){
                case '10' :
                    direction = 'right'
                    if ((currentCase.content === 'b') || (currentCase.content === 'f')) {currentCase.HTMLObject.classList.add('valid')}
                    break;

                case '-10' :
                    direction = 'left'
                    if ((currentCase.content === 'b') || (currentCase.content === 'f')) {currentCase.HTMLObject.classList.add('valid')}
                    break;

                case '01' : 
                    direction = 'bottom'
                    if ((currentCase.content === 'b') || (currentCase.content === 'f')) {currentCase.HTMLObject.classList.add('valid')}
                    break;

                case '0-1' : 
                    direction = 'top'
                    if ((currentCase.content === 'b') || (currentCase.content === 'f')) {currentCase.HTMLObject.classList.add('valid')}
                    break;
                    }
            if (direction) {   
                currentCase.HTMLObject.addEventListener('click', () => {
                        moveCharacter(direction)
                    }
                )
            }
        }
    }
}

const departMinutes = 0.001

const timerElement = document.getElementById("timer")
const nbPasElement = document.getElementById("nb-pas")

function setTimer() {
    if (temps === 0.06) {
        chrono = setInterval(() => {
        temps = temps <= 0 ? 0 : temps + 1
        let minutes = parseInt(temps / 60, 10)
        let secondes = parseInt(temps % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        secondes = secondes < 10 ? "0" + secondes : secondes
        timerElement.innerText = `${minutes}:${secondes}`
        }, 1000)
    }
}
function getCharPos () {
    for (let ligne of laby) {
        if (ligne.includes(p)) {
            return {x : ligne.indexOf(p), y : laby.indexOf(ligne)};
        }
    }
}

function moveCharacter(direction) {
    if (gameOn === true) {
        let charPos = getCharPos();
        let destination;
        let destinationPos;
        switch (direction){
            case 'top' :
                destinationPos = {y : charPos.y-1, x : charPos.x};
                break;
            case 'left' :
                destinationPos = {y : charPos.y, x : charPos.x-1};
                break;
            case 'bottom' : 
                destinationPos = {y : charPos.y+1, x : charPos.x};
                break;
            case 'right' : 
                destinationPos = {y : charPos.y, x : charPos.x+1};
                break;
        }
        destination = laby[destinationPos.y][destinationPos.x]
        if (destination === b || destination === f) {
            laby[destinationPos.y][destinationPos.x] = p;
            laby[charPos.y][charPos.x] = b;
            nbPas += 1
        }
        if (destination === f) {
            gameOn = false
            clearInterval(chrono)
            nbPasElement.innerText = "Nombre de pas\n" + nbPas
        };  
        afficheLaby()
        listeners(getCasesPos())
    }
}

var keyPress = document.addEventListener('keydown', event => {
    if (event.keyCode in moveKeys) {
        moveCharacter(moveKeys[event.keyCode])
    } else {
        // compléter événement de connerie
    }
})