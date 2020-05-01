import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const PlayNumber=props=>(
  <button 
  className="number" 
  onClick={()=>props.onClick(props.number,props.status)}
  style={{backgroundColor:colors[props.status]}}
  >
    {props.number}
  </button>

)

const StarDisplay=props=>(
  <>

  {utils.range(1,props.count).map(starId=>
    <div className="star" key={starId} /> 
  )}
  </>
)
const PlayAgain =props=>(
    <div className="game-done" >
      <div style={{color:props.gameStatus==='won'?'green':'red'}}>{props.gameStatus==='won' ? 'Won' : 'Game Over'}</div>
      <button onClick={props.onClick}>PlayAgain</button>
    </div>
)

const Game = props => {
  const [stars,setStars]= useState(utils.random(1,9)); 
  const [availableNums,setAvailableNums]=useState(utils.range(1,9));
  const [candidateNums,setCandidateNums]=useState([]);

  const candidatesAreWrong=utils.sum(candidateNums)>stars;

  const [secondsLeft, setSecondsLeft] = useState(10);

	React.useEffect(() => {
  	if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
	      setSecondsLeft(secondsLeft - 1);
      }, 1000);
    	return () => clearTimeout(timerId);
  	}
  });  



  const onNumberClick=(number,currentStatus)=>{
    if(currentStatus==='used' || gameStatus !=='active'){
      return ;
    }
    const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);

    if(utils.sum(newCandidateNums)<stars){
      setCandidateNums(newCandidateNums);
    }else if(utils.sum(newCandidateNums)==stars){
      const newAvailableNums=availableNums.filter(n=>!newCandidateNums.includes(n));
      setStars(utils.randomSumIn(newAvailableNums,9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
       
    }else if(utils.sum(newCandidateNums)>stars){
      setCandidateNums(newCandidateNums);
    }
  }

  // const resetGame=()=>{
  //   setStars(utils.random(1,9));
  //   setAvailableNums(utils.range(1,9));
  //   setCandidateNums([]);
  //   setSecondsLeft(10);

  // }

  const numberStatus=(number)=>{
    if(!availableNums.includes(number)){
      return 'used';
    }
    if(candidateNums.includes(number)){
      return candidatesAreWrong ? 'wrong':'candidate';
    }
    return 'available';
  };
  
  const gameStatus=availableNums.length===0?
  'won':secondsLeft===0?'lost':'active';
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !=='active' ? (<PlayAgain gameStatus={gameStatus} onClick={props.startNewGame}/>) : (<StarDisplay 
          count={stars} 
          />)
          }
          
        </div>
        <div className="right">
          {utils.range(1,9).map(number=>
            <PlayNumber 
            key={number} 
            number={number}
            status={numberStatus(number)}
            onClick={onNumberClick}
            />
            )}
        </div>
      </div>
      <div className="timer">Time Remaining:{secondsLeft}</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

const StarMatch=()=>{
  const [gameId,setGameId]=useState(1);
  return(
    <Game key={gameId} startNewGame={()=>setGameId(gameId+1)}/>
  )
}
ReactDOM.render(
  <React.StrictMode>
    <StarMatch />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
