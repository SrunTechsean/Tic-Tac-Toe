function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2d array that will represent the state of the game board
    // row 0 represent the top row and column 0 represent the left-most column.
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // Method to get our board that the UI will need to render
    const getBoard = () => board;

    // Method to print out the board in the console
    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue()),
        );
        console.log(boardWithCellValues);
    };

    const dropToken = (row, column, player) => {
        const cell = board[row][column];
        cell.addToken(player);
    };

    return { getBoard, printBoard, dropToken };
}

/*
 ** A Cell represents one "square" on the board and can have one of
 ** 0: no token is in the square,
 ** O: Player One's token,
 ** X: Player 2's token
 */

function Cell() {
    let value = 0;

    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
        value = player;
    };

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;

    return {
        addToken,
        getValue,
    };
}

/*
 ** The GameController will be responsible for controlling the
 ** flow and state of the game's turns, as well as whether
 ** anybody has won the game
 */

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two",
) {
    let board = GameBoard();
    const players = [
        {
            name: playerOneName,
            token: "O",
        },
        {
            name: playerTwoName,
            token: "X",
        },
    ];

    // Make Player 1(player[0]) go first
    let activePlayer = players[0];
    let winner = null;
    let gameOver = null;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    };

    // Check For Winner
    const checkWinner = () => {
        const currentBoard = board.getBoard();
        const playerToken = activePlayer.token;

        for (let i = 0; i < currentBoard.length; i++) {
            // Checking if every cell in a row (currentBoard[i]) are the same as playerToken
            const winByRow = currentBoard[i].every(
                (cell) => cell.getValue() === playerToken,
            );

            // Checking one token from specific row location(row[i]) compare it to other row's token of that same location
            // to see if they're all the same as playerToken
            const winByColumn = currentBoard.every(
                (row) => row[i].getValue() === playerToken,
            );

            if (winByRow || winByColumn) {
                winner = activePlayer;
                console.log(`${activePlayer.name} WIN!`);
                return true;
            }
        }

        // Check main diagonal win from left to right
        const mainDiagonalWin = currentBoard.every(
            (row, index) => row[index].getValue() === playerToken,
        );

        // Check anti diagonal win from right to left
        const antiDiagonalWin = currentBoard.every(
            (row, index) =>
                row[row.length - index - 1].getValue() === playerToken,
        );

        if (mainDiagonalWin || antiDiagonalWin) {
            winner = activePlayer;
            gameOver = true;
            console.log(`${activePlayer.name} WIN!`);
            return true;
        }

        return false;
    };

    const checkTie = () => {
        const currentBoard = board.getBoard();
        const isFull = currentBoard.every((row) =>
            row.every((cell) => cell.getValue() !== 0),
        );
        if (isFull && !winner) {
            gameOver = true;
            console.log("It's a Tie");
            return true;
        }

        return false;
    };

    const playRound = (row, column) => {
        if (gameOver) {
            console.log("Game is over Please Reset the game!");
            return;
        }

        console.log(
            `Adding ${getActivePlayer().name}'s Token into Cell ${row} ${column}...`,
        );

        // Check if cell is available
        if (board.getBoard()[row][column].getValue() !== 0) {
            return console.log("Cell Already Taken!");
        }

        board.dropToken(row, column, getActivePlayer().token);

        printNewRound();

        if (checkWinner() || checkTie()) return;
        switchPlayerTurn();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const getWinner = () => winner;

    const isGameOver = () => gameOver;

    const resetGame = () => {
        board = GameBoard();
        winner = null;
        gameOver = null;
        activePlayer = players[0];
        printNewRound();
        console.log("Game have been reset!");
    };

    // Initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getWinner,
        isGameOver,
        getBoard: () => board.getBoard(),
        resetGame,
    };
}

const ScreenController = () => {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resultDiv = document.querySelector(".result");
    const reset = document.querySelector(".game__action--retry");

    const updateScreen = () => {
        const activePlayer = game.getActivePlayer();
        const winner = game.getWinner();
        const board = game.getBoard();

        // Remove Current Board
        boardDiv.textContent = "";

        boardDiv.style.setProperty(
            "grid-template-columns",
            `repeat(${board.length}, 1fr)`,
        );
        boardDiv.style.setProperty(
            "grid-template-rows",
            `repeat(${board.length}, 1fr)`,
        );

        // Print out who's turn it is
        playerTurnDiv.textContent = `It's ${activePlayer.name}'s Turn.`;

        // Print out current board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                const cellToken = document.createElement("p");
                cellButton.classList.add("board__cell");
                cellToken.classList.add("board__token");

                // Create a data attribute to identify the column and row
                // This makes it easier to pass into our `playRound` function
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;

                cellToken.textContent =
                    cell.getValue() === 0 ? "" : cell.getValue();
                cellButton.appendChild(cellToken);
                boardDiv.appendChild(cellButton);
            });
        });

        if (winner) {
            resultDiv.textContent = `${winner.name} is the WINNER!!!`;
        } else if (game.isGameOver()) {
            resultDiv.textContent = "It's a Tie!";
        } else {
            resultDiv.textContent = "";
        }
    };

    // Listen for User Input then PlayRound
    const handleClick = (e) => {
        const btn = e.target.closest(".board__cell");
        if (!btn) return;

        const { row, column } = btn.dataset;
        game.playRound(row, column);

        // Rerender screen after every user input
        updateScreen();
    };

    const handleReset = () => {
        game.resetGame();
        updateScreen();
    };

    const init = () => {
        boardDiv.addEventListener("click", handleClick);
        reset.addEventListener("click", handleReset);
        updateScreen();
        console.log("Game Initialize!");
    };

    return { init };
};

const game = ScreenController();
game.init();

// const game = GameController();
// // Testing Row WIN
// game.playRound(0, 1);
// game.playRound(2, 2);
// game.playRound(0, 2);
// game.playRound(1, 2);
// game.playRound(0, 0);

// // Testing Column WIN
// game.playRound(0, 1);
// game.playRound(0, 2);
// game.playRound(1, 1);
// game.playRound(1, 2);
// game.playRound(2, 1);

// // Testing winDiagonal left to right
// game.playRound(0, 0);
// game.playRound(0, 1);
// game.playRound(1, 1);
// game.playRound(1, 2);
// game.playRound(2, 2);

// // Testing winDiagonal right to left
// game.playRound(0, 2);
// game.playRound(0, 1);
// game.playRound(1, 1);
// game.playRound(1, 2);
// game.playRound(2, 0);
//
// // Test a Tie
// game.playRound(0, 2);
// game.playRound(0, 1);
// game.playRound(1, 1);
// game.playRound(1, 2);
// game.playRound(2, 1);
// game.playRound(2, 2);
// game.playRound(0, 0);
// game.playRound(2, 0);
// game.playRound(1, 0);
