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
        if (cell.getValue() !== 0) return;
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
}
