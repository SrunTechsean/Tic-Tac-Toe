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

    return { getBoard, printBoard, dropToken };
}
