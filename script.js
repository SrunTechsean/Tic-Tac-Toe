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
    const board = GameBoard();
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

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    };

    const playRound = (row, column) => {
        console.log(
            `Adding ${getActivePlayer().name}'s Token into Cell ${row} ${column}...`,
        );

        // Check if cell is available
        if (board.getBoard()[row][column].getValue() !== 0) {
            return console.log("Cell Already Taken!");
        }

        board.dropToken(row, column, getActivePlayer().token);

        // Check For Winner
        const checkWinner = () => {
            const currentBoard = board.getBoard();
            const playerToken = activePlayer.token;

            for (let i = 0; i < currentBoard.length; i++) {
                // Checking if every Token in a row (currentBoard[i]) are the same as playerToken
                const winByRow = currentBoard[i].every(
                    (token) => token.getValue() === playerToken,
                );

                // Checking one token from specific row location(row[i]) compare it to other row's token of that same location
                // to see if they're all the same as playerToken
                const winByColumn = currentBoard.every(
                    (row) => row[i].getValue() === playerToken,
                );

                const winDiagonal = currentBoard.every(
                    (row, index) =>
                        row[index].getValue() === playerToken ||
                        row[row.length - (index + 1)].getValue() ===
                            playerToken,
                );

                if (winByRow || winByColumn || winDiagonal) {
                    return console.log(`${activePlayer.name} WIN!`);
                }
            }

            // If there's no winner switch player n tell user it's there turn
            switchPlayerTurn();
            console.log(`${getActivePlayer().name}'s turn.`);
        };

        printNewRound();
        checkWinner();
    };

    // Initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard(),
    };
}

const ScreenController = () => {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        const activePlayer = game.getActivePlayer();
        const board = game.getBoard;

        // Print out who's turn it is
        playerTurnDiv.textContent = `It's ${activePlayer.name}'s Turn.`;

        // Print out current board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("board__cell");

                // Create a data attribute to identify the column and row
                // This makes it easier to pass into our `playRound` function
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;

                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });

        // Listen for User Input
    };
    updateScreen();
};

ScreenController();

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
