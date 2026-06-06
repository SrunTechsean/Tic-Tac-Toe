function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2d array that will represent the state of the game board
    // row 0 represent the top row and column 0 represent the left-most column.
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(j);
        }
    }

    // Method to get our board that the UI will need to render
    const getBoard = () => board;

    // Method to print out the board in the console
    const printBoard = () => console.log(board);

    return { getBoard, printBoard };
}
