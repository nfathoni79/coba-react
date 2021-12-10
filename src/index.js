import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {[...Array(3)].map((x, i) => {
          return (
            <div key={i} className="board-row">
              {[...Array(3)].map((y, j) => this.renderSquare(j + 3*i))}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        position: {col: null, row: null},
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sortIsAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const colPos = i % 3 + 1;
    const rowPos = Math.floor(i / 3) + 1;

    this.setState({
      history: history.concat([{
        position: {
          col: colPos,
          row: rowPos,
        },
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortMoves() {
    this.setState({
      sortIsAscending: !this.state.sortIsAscending,
    });
  }

  render() {
    let history;
    let current;

    if (this.state.sortIsAscending) {
      history = this.state.history;
      current = history[this.state.stepNumber];
    } else {
      history = this.state.history.slice().reverse();
      current = history[history.length - 1 - this.state.stepNumber];
    }

    const winner = calculateWinner(current.squares);
    const moves = history.map((element, index) => {
      const moveNumber = this.state.sortIsAscending
        ? index
        : history.length - 1 - index;

      const desc = moveNumber ?
        `Go to move #${moveNumber} (${element.position.col},${element.position.row})` :
        'Go to game start';

      return (
        <li key={moveNumber}>
          <button
            className={moveNumber === this.state.stepNumber ? 'bold' : ''}
            onClick={() => this.jumpTo(moveNumber)}
          >
            {desc}
          </button>
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
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.sortMoves()}>Sort Moves</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return squares[a];
    }
  }
  return null;
}
