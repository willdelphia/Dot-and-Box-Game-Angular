import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  rows: any = 12;
  columns: any = 12;

  rowArray: any;
  columnArray: any;

  turn: any; 

  playerArray = [
    {
      playerIndex: 0,
      playerName: 'Human',
      playerColor: 'rgb(255, 0, 238)',
      points: 0
    },
    {
      playerIndex: 1,
      playerName: 'Computer',
      playerColor: 'rgb(0, 255, 51)',
      points: 0
    },
  ];

  barControlObject = {};
  squareControlObject = {};

  gameOver = false;
 

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {


    this.rowArray = Array.from(Array(this.rows),(x,i)=>i); 
    this.columnArray = Array.from(Array(this.columns),(x,i)=>i); 
    
    this.initGame();
 
  }

  initGame() {

    this.barControlObject = {};
    this.squareControlObject = {};

    for(let row = 0; row < (this.rows ); row++) {
      for(let column = 0; column < (this.columns); column++) {

        if(column != (this.columns-1)) {
          let hid = row + "-" + column + "--" + row + "-" + (column + 1);
          this.barControlObject[hid] = {
            background: 'white',
            filled: false,
            lastPlay: false
          }; 
        }

        if(row != (this.rows-1)) {
          let vid = row + "-" + column + "--" + (row + 1) + "-" + column;
          this.barControlObject[vid] = {
            background: 'white',
            filled: false,
            lastPlay: false
          };
        }

        if(column != (this.columns-1) && row != (this.rows-1)) {
          let sid = row + '-' + column;
          this.squareControlObject[sid] = {
            background: 'white',
            filled: false,
            owner: null
          };
        }

      } 
    } //end for loop 
 
    this.turn = 0;
  }


  checkBarType(r1,c1,r2,c2) {

    if(r1 === r2){
      return 'h'
    }
    else {
      return 'v'
    }

  }

  clickBar(id,player) {

    //check to see if it is players turn 
    if(player === this.turn) { 

      let checkBarState = this.barControlObject[id].filled;
      if(checkBarState == true) {
        console.log("This bar is already filled");
      }
      else if (checkBarState == false) {


        let filledAbove = false;
        let filledBelow = false;
        let filledRight = false;
        let filledLeft  = false;

        this.clearAllLastPlayClass();

        this.barControlObject[id] = {
          background: 'black',
          filled: true,
          lastPlay: true
        };

        let coord1 = id.split('--')[0];
        let coord2 = id.split('--')[1];

        let r1 = parseInt(coord1.split('-')[0],10);
        let c1 = parseInt(coord1.split('-')[1],10);
        let r2 = parseInt(coord2.split('-')[0],10);
        let c2 = parseInt(coord2.split('-')[1],10);

        let bar = this.checkBarType(r1,c1,r2,c2);

        if (bar === 'v') {

          //check to the right
          if(c1 < (this.columns - 1)) {

          let acrossRightId = r1 + '-' + (c1 + 1) + '--' + r2 + '-' + (c2 + 1);
          let checkRightAcross = this.barControlObject[acrossRightId].filled;
          
          let topRightId = r1 + '-' + c1 + '--' + (r2 - 1) + '-' + (c2 + 1);
          let checkTopRight = this.barControlObject[topRightId].filled;

          let bottomRightId =  (r1 + 1) + '-' + c1 + '--' + r2 + '-' + (c2 + 1);
          let checkBottomRight = this.barControlObject[bottomRightId].filled;

            if (checkRightAcross == true && checkTopRight == true && checkBottomRight == true) 
            {
              let squareCoords = r1 + '-' + c1;
              this.squareControlObject[squareCoords] = {
                background: this.playerArray[this.turn].playerColor,
                filled: true,
                owner: this.playerArray[this.turn].playerIndex
              };

              filledRight = true;
              this.awardPoint(this.turn);

              this.promptComputerToGoAgain();

            }
          } // if not last column 

          //check to the left
          if(c1 > 0) {

            let acrossLeftId = r1 + '-' + (c1 - 1) + '--' + r2 + '-' + (c2 - 1);
            let checkAcrossLeft = this.barControlObject[acrossLeftId].filled;

            let topLefttId = r1 + '-' + (c1 - 1) + '--' + (r2 - 1) + '-' + c2;
            let checkTopLeft = this.barControlObject[topLefttId].filled;

            let bottomLeftId = (r1 + 1) + '-' + (c1 - 1) + '--' + r2 + '-' + c2;
            let checkBottomLeft = this.barControlObject[bottomLeftId].filled;

            if (checkAcrossLeft == true && checkTopLeft == true && checkBottomLeft == true) 
            {
              let squareCoords = r1 + '-' + (c1 - 1);
              this.squareControlObject[squareCoords] = {
                background: this.playerArray[this.turn].playerColor,
                filled: true,
                owner: this.playerArray[this.turn].playerIndex
              };
  
              filledLeft = true;
              this.awardPoint(this.turn);
              this.promptComputerToGoAgain();

            }

          } //if not first column 
        } //if vbar


        else if (bar === 'h') {

          //check above 
          if(r1 > 0) {
            let acrossTopId = (r1 - 1) + '-' + c1 + '--' + (r2 -1)+ '-' + c2;
            let checkAcrossTop = this.barControlObject[acrossTopId].filled;

            let topLefttId = (r1 - 1) + '-' + c1 + '--' + r2+ '-' + (c2 - 1);
            let checkTopLeft = this.barControlObject[topLefttId].filled;

            let topRightId = (r1 - 1) + '-' + (c1 + 1) + '--' + r2+ '-' + c2;
            let checkTopRight = this.barControlObject[topRightId].filled;

            if (checkAcrossTop == true && checkTopLeft == true && checkTopRight == true) 
            {
              let squareCoords = (r1 - 1) + '-' + c1;
              this.squareControlObject[squareCoords] = {
                background: this.playerArray[this.turn].playerColor,
                filled: true,
                owner: this.playerArray[this.turn].playerIndex
              };
              filledAbove = true;
              this.awardPoint(this.turn);
              this.promptComputerToGoAgain();

            }
          } //if not the top row

          //check below 
          if(r1 < (this.rows - 1)) {
            let acrossBottomId = (r1 + 1) + '-' + c1 + '--' + (r2 + 1)+ '-' + c2;
            let checkAcrossBottom = this.barControlObject[acrossBottomId].filled;

            let bottomLefttId = r1 + '-' + c1 + '--' + (r2 + 1) + '-' + (c2 - 1);
            let checkBottomLeft = this.barControlObject[bottomLefttId].filled;

            let bottomRightId = r1 + '-' + (c1 + 1) + '--' + (r2 + 1) + '-' + c2;
            let checkBottomRight = this.barControlObject[bottomRightId].filled;

            if (checkAcrossBottom == true && checkBottomLeft == true && checkBottomRight) 
            {
              let squareCoords = r1 + '-' + c1;
              this.squareControlObject[squareCoords] = {
                background: this.playerArray[this.turn].playerColor,
                filled: true,
                owner: this.playerArray[this.turn].playerIndex
              };
              filledBelow = true;
              this.awardPoint(this.turn);
              this.promptComputerToGoAgain();

            }
    
          } //if not last row
        } // if hbar

        if(filledAbove === false &&
          filledBelow === false &&
          filledLeft  === false &&
          filledRight === false) {
          this.chessClock();

          setTimeout(()=>{ 
            this.takeTurn();
          }, 50);
        }
        else{ //if a box has been filled 
          if (this.turn === 0) { //if it's human's turn

            let openBars = [];

            //select only unfilled bars
            for (let barId in this.barControlObject) {
              let filledCheck =  this.barControlObject[barId].filled;
              if(!filledCheck) {
                openBars.push(barId);
              }
            }

            let nearBoxArray = [];

            openBars.forEach((barId) => {
              let isNearBox =  this.checkForBoxPlays(barId,this.barControlObject);
              if(isNearBox > 0) {
               nearBoxArray.push(barId);
              }
             });

             if(nearBoxArray.length > 0) {
              let whichBar = this.getRandomInt(nearBoxArray.length);
              let chosenId = nearBoxArray[whichBar];

            setTimeout(()=>{ 
              this.clickBar(chosenId,0); 
            }, 50); 
          
            }

          }

          //check to see if the game is over 
          let unfilledBars = 0;
          for(let barId in this.barControlObject) {
            if(this.barControlObject[barId].filled === false) {
              unfilledBars += 1;
            }
          }

          if(unfilledBars === 0) {
            this.clearAllLastPlayClass();
            this.gameOver = true;
            this.endGameAlert();
          } 

        }
      } //if filled state false 
    } //is players turn
  } //click 


  clearAllLastPlayClass() {
    for (let barId in this.barControlObject) {
      this.barControlObject[barId].lastPlay = false;
    }
  }


  chessClock() { 
    if (this.turn === 0) {
      this.turn = 1;
    }
    else if (this.turn === 1) {
      this.turn = 0;
    }
  }

  awardPoint(playerId) {
    this.playerArray[playerId].points = this.playerArray[playerId].points + 1;
  } 

   promptComputerToGoAgain() {

    if (this.turn === 0) {
      console.log('its still humans turn');
    }
    else if (this.turn === 1) {
      setTimeout(()=>{ 
        this.takeTurn();
       }, 50);    }

   }

   endGameAlert() {

    let winnerDeclared = '';

    if(this.playerArray[0].points > this.playerArray[1].points) {
      winnerDeclared = 'Human Wins!';
    }
    else if  (this.playerArray[0].points < this.playerArray[1].points){
      winnerDeclared = 'Computer Wins!';
    }
    else { 
      winnerDeclared = "It's a tie!";
    }

    let finalScore = 'Human: ' + this.playerArray[0].points + '<br>' + 'Computer: ' + this.playerArray[1].points ;



    let alert = this.alertCtrl.create({
      title: winnerDeclared,
      subTitle: finalScore,
      buttons: ['Okay']
    });
    alert.present();
  }

  playAgain() {

    this.turn = 0;
    this.initGame();

    this.playerArray.forEach((player) => {
      player.points = 0;
    })

    this.gameOver = false;

  }



  //Opponent AI
                                                                            
  takeTurn() {

    let topThis = this;

    if( this.turn === 0) {
      console.log('Its not my turn');
    }
    else if(this.turn === 1) { 
      console.log('Im going to take my turn');

      let openBars = [];

      //select only unfilled bars
      for (let barId in this.barControlObject) {
       let filledCheck =  this.barControlObject[barId].filled;
       if(!filledCheck) {
         openBars.push(barId);
       }
      }

      let nearBoxArray = [];
      
      openBars.forEach((barId) => {
       let isNearBox =  this.checkForBoxPlays(barId,this.barControlObject);
       if(isNearBox > 0) {
        nearBoxArray.push(barId);
       }
      });

      if(nearBoxArray.length > 0) {
        let whichBar = this.getRandomInt(nearBoxArray.length);
        let chosenId = nearBoxArray[whichBar];
        this.clickBar(chosenId,1); 
      }
      else { //if there are no nearboxes

        let nearNearBoxArray = [];
        let nonNearNearBoxArray = [];

        openBars.forEach((barId) => {
          let isNearNearBox =  this.checkForPreBoxPlays(barId,this.barControlObject);
          if(isNearNearBox === 0) {
            nonNearNearBoxArray.push(barId);
          }
          else {
            nearNearBoxArray.push(barId);
          }
        });

        if(nonNearNearBoxArray.length > 0) {
          let whichBar = this.getRandomInt(nonNearNearBoxArray.length);
          let chosenId = nonNearNearBoxArray[whichBar];
          this.clickBar(chosenId,1); 
          
        }
        else { //if there are only nearnearboxes left on the map
          let scoreSheet = {};

          nearNearBoxArray.forEach((barId) => { 
            let cloneControlObj = JSON.parse(JSON.stringify(this.barControlObject));
            let loops = 0;

            //recursive loop
            function testMove(bar, controlObject) {
              controlObject[bar].filled = true;
              let hits = [];

              for (let cloneBarId in controlObject) {
                if(controlObject[cloneBarId].filled === false) {
                  let check = topThis.checkForBoxPlays(cloneBarId,controlObject);
                  if(check > 0) { 
                    hits.push(cloneBarId);
                  }
                } //if not filled
              } //for loop

              if (hits.length > 0) {
                //success 
                loops++;
                testMove(hits[0],controlObject);
              }
            }

            testMove(barId, cloneControlObj);

            scoreSheet[barId] = loops;
  
            } // end else if two initial hits
          ); //end loop through every nearnearbox 

          //sort scoreSheet by score
          let scoreSheetSort = [];
          for (var bar in scoreSheet) {
            scoreSheetSort.push([bar, scoreSheet[bar]]);
          }

          scoreSheetSort.sort(function(a, b) {
              return a[1] - b[1];
          });

          //keep only the lowest score
          let lowScoringOptions = [];
          scoreSheetSort.forEach((option) => {
            if(option[1] === scoreSheetSort[0][1]){
              lowScoringOptions.push(option); 
            }
          });

          //make move   
          if(lowScoringOptions.length > 0) {
            let whichBar = this.getRandomInt(lowScoringOptions.length);
            let chosenId = lowScoringOptions[whichBar][0];
            this.clickBar(chosenId,1); 
          }
        } //if there are no nearnear boxes
      } // if there are no near boxes
    } // if it's computer's turn
  } //take turn function 

  checkForBoxPlays(id, controlObject) {

    let score = 0;

    let coord1 = id.split('--')[0];
    let coord2 = id.split('--')[1];

    let r1 = parseInt(coord1.split('-')[0],10);
    let c1 = parseInt(coord1.split('-')[1],10);
    let r2 = parseInt(coord2.split('-')[0],10);
    let c2 = parseInt(coord2.split('-')[1],10);

    let bar = this.checkBarType(r1,c1,r2,c2);

    if (bar === 'v') {

      //check to the right
      if(c1 < (this.columns - 1)) {

      let acrossRightId = r1 + '-' + (c1 + 1) + '--' + r2 + '-' + (c2 + 1);
      let checkRightAcross = controlObject[acrossRightId].filled;
      
      let topRightId = r1 + '-' + c1 + '--' + (r2 - 1) + '-' + (c2 + 1);
      let checkTopRight = controlObject[topRightId].filled;

      let bottomRightId =  (r1 + 1) + '-' + c1 + '--' + r2 + '-' + (c2 + 1);
      let checkBottomRight = controlObject[bottomRightId].filled;

        if (checkRightAcross == true && checkTopRight == true && checkBottomRight == true) 
        {
          score = score +1;
         
        }
      } // if not last column 

      //check to the left
      if(c1 > 0) {

        let acrossLeftId = r1 + '-' + (c1 - 1) + '--' + r2 + '-' + (c2 - 1);
        let checkAcrossLeft = controlObject[acrossLeftId].filled;

        let topLefttId = r1 + '-' + (c1 - 1) + '--' + (r2 - 1) + '-' + c2;
        let checkTopLeft = controlObject[topLefttId].filled;

        let bottomLeftId = (r1 + 1) + '-' + (c1 - 1) + '--' + r2 + '-' + c2;
        let checkBottomLeft = controlObject[bottomLeftId].filled;

        if (checkAcrossLeft == true && checkTopLeft == true && checkBottomLeft == true) 
        {
          score = score +1;
        }

      } //if not first column 
    } //if vbar

    else if (bar === 'h') {
      //check above 
      if(r1 > 0) {
        let acrossTopId = (r1 - 1) + '-' + c1 + '--' + (r2 -1)+ '-' + c2;
        let checkAcrossTop = controlObject[acrossTopId].filled;

        let topLefttId = (r1 - 1) + '-' + c1 + '--' + r2+ '-' + (c2 - 1);
        let checkTopLeft = controlObject[topLefttId].filled;

        let topRightId = (r1 - 1) + '-' + (c1 + 1) + '--' + r2+ '-' + c2;
        let checkTopRight = controlObject[topRightId].filled;

        if (checkAcrossTop == true && checkTopLeft == true && checkTopRight == true) 
        {
          score = score +1;
        }
      } //if not the top row

      //check below 
      if(r1 < (this.rows - 1)) {
        let acrossBottomId = (r1 + 1) + '-' + c1 + '--' + (r2 + 1)+ '-' + c2;
        let checkAcrossBottom = controlObject[acrossBottomId].filled;

        let bottomLefttId = r1 + '-' + c1 + '--' + (r2 + 1) + '-' + (c2 - 1);
        let checkBottomLeft = controlObject[bottomLefttId].filled;

        let bottomRightId = r1 + '-' + (c1 + 1) + '--' + (r2 + 1) + '-' + c2;
        let checkBottomRight = controlObject[bottomRightId].filled;

        if (checkAcrossBottom == true && checkBottomLeft == true && checkBottomRight) 
        {
          score = score +1;
        }
      } //if not last row
    } // if hbar

    return score

  }  //checkForBoxPlays 

  checkForPreBoxPlays(id, controlObject) {

    let score = 0;

    let coord1 = id.split('--')[0];
    let coord2 = id.split('--')[1];

    let r1 = parseInt(coord1.split('-')[0],10);
    let c1 = parseInt(coord1.split('-')[1],10);
    let r2 = parseInt(coord2.split('-')[0],10);
    let c2 = parseInt(coord2.split('-')[1],10);

    let bar = this.checkBarType(r1,c1,r2,c2);

    if (bar === 'v') {

      //check to the right
      if(c1 < (this.columns - 1)) {

      let acrossRightId = r1 + '-' + (c1 + 1) + '--' + r2 + '-' + (c2 + 1);
      let checkRightAcross = controlObject[acrossRightId].filled;
      
      let topRightId = r1 + '-' + c1 + '--' + (r2 - 1) + '-' + (c2 + 1);
      let checkTopRight = controlObject[topRightId].filled;

      let bottomRightId =  (r1 + 1) + '-' + c1 + '--' + r2 + '-' + (c2 + 1);
      let checkBottomRight = controlObject[bottomRightId].filled;

      if (checkRightAcross && checkTopRight || checkRightAcross && checkBottomRight || checkTopRight && checkBottomRight ) {
          score = score +1;
        }
      } // if not last column 

      //check to the left
      if(c1 > 0) {

        let acrossLeftId = r1 + '-' + (c1 - 1) + '--' + r2 + '-' + (c2 - 1);
        let checkAcrossLeft = controlObject[acrossLeftId].filled;

        let topLefttId = r1 + '-' + (c1 - 1) + '--' + (r2 - 1) + '-' + c2;
        let checkTopLeft = controlObject[topLefttId].filled;

        let bottomLeftId = (r1 + 1) + '-' + (c1 - 1) + '--' + r2 + '-' + c2;
        let checkBottomLeft = controlObject[bottomLeftId].filled;

        if (checkAcrossLeft && checkTopLeft || checkAcrossLeft && checkBottomLeft || checkTopLeft && checkBottomLeft) {
          score = score +1;
        }
      } //if not first column 
    } //if vbar


    else if (bar === 'h') {

      //check above 
      if(r1 > 0) {
        let acrossTopId = (r1 - 1) + '-' + c1 + '--' + (r2 -1)+ '-' + c2;
        let checkAcrossTop = controlObject[acrossTopId].filled;

        let topLefttId = (r1 - 1) + '-' + c1 + '--' + r2+ '-' + (c2 - 1);
        let checkTopLeft = controlObject[topLefttId].filled;

        let topRightId = (r1 - 1) + '-' + (c1 + 1) + '--' + r2+ '-' + c2;
        let checkTopRight = controlObject[topRightId].filled;

        //checkAcrossTop  checkTopLeft  checkTopRight

        if (checkAcrossTop && checkTopLeft || checkAcrossTop && checkTopRight || checkTopLeft && checkTopRight) {
          score = score +1;
        }
      } //if not the top row

      //check below 
      if(r1 < (this.rows - 1)) {
        let acrossBottomId = (r1 + 1) + '-' + c1 + '--' + (r2 + 1)+ '-' + c2;
        let checkAcrossBottom = controlObject[acrossBottomId].filled;

        let bottomLefttId = r1 + '-' + c1 + '--' + (r2 + 1) + '-' + (c2 - 1);
        let checkBottomLeft = controlObject[bottomLefttId].filled;

        let bottomRightId = r1 + '-' + (c1 + 1) + '--' + (r2 + 1) + '-' + c2;
        let checkBottomRight = controlObject[bottomRightId].filled;

        if (checkAcrossBottom && checkBottomLeft || checkAcrossBottom && checkBottomRight || checkBottomLeft && checkBottomRight) {
          score = score +1;
        }
      } //if not last row
    } // if hbar

    return score

  }  //checkForBoxPlays 


  //util functions

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  objSum( obj ) {
    let sum = 0;
    for( let el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseFloat( obj[el] );
      }
    }
    return sum;
  }

} 