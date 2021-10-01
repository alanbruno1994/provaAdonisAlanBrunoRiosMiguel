export default function templateEmail(user, bet = []) {
  function generateBets() {
    let sum = 0;
    let bets = bet.reduce((accumulator, current) => {
      sum += current.priceGame;
      return (
        accumulator +
        `<tr>
              <td class="colorLeft">Game</td><td class="colorMarked">${current.gameChoose}</td>            
            </tr> 
            <tr>
                <td  class="colorLeft">Number</td> <td>${current.numberChoose}</td>             
            <tr>    
            <tr>
              <td  class="colorLeft" >Price</td><td>${current.priceGame}</td>                
            </tr>   `
      );
    }, "");
    bets += `<tr style="background-color: #f1f1f1">
              <td style="text-align:rigth">Price Total</td>              
              <td>${sum}</td>
            </tr>
      `;
  }
  let html =
    `<!DOCTYPE html>
<html>
<head> 
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<style>
    * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    text-overflow: clip;
     border-collapse: collapse;
     color: rgb(165, 165, 165);
     font-size: 14px;
  }
  html,
  body {
    background-color: #e3e3e3;
  }
  table, th, td {
    border: 1px solid rgba(0, 0, 0, 0.224);
    margin-top: 10px; 
  }
  td
  {
    text-align: center;
      
    word-break: break-all;
  }
  .colorLeft
  {
    background-color: #42f542;
    color: white;
    font-weight: bolder;    
    width: 30%;
  }
  .colorMarked
  {
    background-color: #f1f1f1;
     width: 70%;
  }
  h3
  {
    font-weight: bolder
  }
</style>

<body>
  <div
    style="
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    "
  >
    <div style="width: 100%; height: 80px; background-color: #ffa621"></div>
    <div
      style="
        position: absolute;
        background-color: white;
        top: 20px;
        min-width: 240px;
        width: 90%;
        max-width: 500px;
        border-radius: 5px;
        min-height: 200px;
      "
    >
      <div
        style="
          font-size: 21px;
          font-weight: bold;
          text-align: center;
          width: 100%;
        "
      >
       {{bets.length===1 ? "New bet!": "New bets!"}}
        
      </div>
      <div
        style="
          width: 100%;
          color: rgb(143, 143, 143);
          text-align: left;
          padding: 10px;
          box-sizing: border-box;
          margin-top: 20px;
        "
      > 
      <p>The player named ${user} just made these games:</p>  
      <table style="width: 100%;">  ` +
    generateBets() +
    `
        </table>    
        
      </p>
    </div>
  </div>
</body>
</html>;`;
}
