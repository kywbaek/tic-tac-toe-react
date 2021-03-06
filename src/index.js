import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}
            style={{"background":props.highlight}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        highlight={this.props.winnerSquares[i]}
      />
    );
  }

  render() {
    return (
      <div>
        {[0,3,6].map((indexR)=>(<div className="board-row" key={indexR}>
          {[0,1,2].map((indexC)=>(this.renderSquare(indexR + indexC)))}
        </div>))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: Array(2).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      ascend: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = [((i-(i%3))/3)+1, (i%3)+1];

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: position
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  isSelected(move) {
    if (this.state.stepNumber === move) {
      return true;
    }
    return false;
  }

  toggleOrder() {
    this.setState({
      ascend: !this.state.ascend
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let result = calculateWinner(current.squares);
    let winner = result ? result[-1] : null;
    let winnerSquares;
    winnerSquares = result ? result.slice(1) : Array(9).fill('none');

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " (" + step.position + ")":
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() =>  this.jumpTo(move)}
                  style={{"fontWeight": this.isSelected(move) ? "bold": "normal",
                          "transform": this.state.ascend ? "none": "rotate(180deg)"}}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winnerSquares}
            onClick={(i) => this.handleClick(i)}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.toggleOrder()}>
            reverse order
          </button>
          <ul style={{"transform": this.state.ascend ? "none": "rotate(180deg)"}}>{moves}</ul>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      let winnerSquares = Array(9).fill('none');
      [a,b,c].forEach(e => { winnerSquares[e] = 'gold' });
      return [squares[a]].concat(winnerSquares)
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
