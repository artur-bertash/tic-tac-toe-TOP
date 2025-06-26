const SoundClick = new Audio("sound_click.mp3");
const SoundOver = new Audio("sound_over.mp3");


class GameBoard {

    constructor() {
        this.rows = 3;
        this.cols = 3;
        this.board = []
        this.#initBoard();
    }

    #initBoard() {
        this.board = []
        for (let row = 0; row < this.rows; row++) {
            this.board.push([])
            for (let col = 0; col < this.cols; col++) {
                this.board[row].push(new Cell())
            }
            console.log("\n")
        }

    }

    getBoard = () => this.board;

    printBoard = () => {
        for (let row = 0; row < this.rows; row++) {
            let rowStr = ""
            for (let col = 0; col < this.cols; col++) {
                rowStr += this.board[row][col].getValue()
            }
            console.log(rowStr)

        }
    }

    eraseBoard = () => {
        console.log(this.board)
        this.#initBoard()
    }


}



class Cell {
    #value;
    constructor() {
        this.#value = 0
    }


    addToken = (player) => {
        this.#value = player
    }

    getValue = () => {
        return this.#value
    }

}

class GameControl {
    #board;
    #players;
    #activePlayer;

    constructor(playerOneName = "Player X", playerTwoName = "Player O") {
        this.#board = new GameBoard()
        this.#players = [
            {
                name: playerOneName,
                token: 1
            },
            {
                name: playerTwoName,
                token: 2
            }
        ]
        this.#activePlayer = this.#players[0]

    }




    getActivePlayer = () => this.#activePlayer;

    switchPlayer = () => {

        this.#activePlayer = this.#activePlayer === this.#players[0] ? this.#players[1] : this.#players[0]
    }

    printNewRound = () => {
        this.#board.printBoard()
        console.log(this.#activePlayer.name + "'s turn!")
    }
    isWon = () => {
        const board = this.#board
        for (let row = 0; row < 3; row++) {
            if (board.getBoard()[row][0].getValue() != 0 && board.getBoard()[row][0].getValue() == board.getBoard()[row][1].getValue() && board.getBoard()[row][1].getValue() == board.getBoard()[row][2].getValue()) {
                return true;
            }
        }
        for (let col = 0; col < 3; col++) {
            if (board.getBoard()[0][col].getValue() != 0 && board.getBoard()[0][col].getValue() == board.getBoard()[1][col].getValue() && board.getBoard()[1][col].getValue() == board.getBoard()[2][col].getValue()) {
                return true;
            }
        }

        if (board.getBoard()[0][0].getValue() != 0 && board.getBoard()[0][0].getValue() == board.getBoard()[1][1].getValue() && board.getBoard()[1][1].getValue() == board.getBoard()[2][2].getValue()) {
            return true;
        }
        if (board.getBoard()[2][0].getValue() != 0 && board.getBoard()[2][0].getValue() == board.getBoard()[1][1].getValue() && board.getBoard()[1][1].getValue() == board.getBoard()[0][2].getValue()) {
            return true;
        }
    }

    playRound = (row, col) => {
        const board = this.#board
        if (board.getBoard()[row][col].getValue() !== 0) {
            console.log("Can't move there")
            return { winner: null };
        }
        board.getBoard()[row][col].addToken(this.#activePlayer.token)


        if (this.isWon()) {
            console.log(this.#activePlayer.name + ": Won the game!")
            return { winner: this.#activePlayer };
        }
        this.switchPlayer()
        this.printNewRound()
        return { winner: null }
    }
    newGame = () => {
        this.#board.eraseBoard()
        this.#activePlayer = this.#players[0]

    }
    isFull = () => {
        if (this.#board.getBoard().every(row => row.every(cell => cell.getValue() != 0))) {


            return true
        }
        return false
    }




}


const game = new GameControl()
const text = document.querySelector(".text")
let gameOver = false

for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
        const cell = document.getElementById(`${row}-${col}`)
        cell.addEventListener("click", () => {
            if (!gameOver) {
                const player = game.getActivePlayer()
                const result = game.playRound(row, col)
                SoundClick.play();

                if (cell.innerText == "") {
                    const symbol = player.token === 1 ? "❌" : "⭕"
                    cell.innerText = symbol
                    if (result.winner) {
                        text.innerText = result.winner.name + " has won the game!";
                        gameOver = true
                        SoundOver.play();
                    }

                }
                if (game.isFull()) {
                    text.innerText = "It's a draw!";
                    gameOver = true
                    SoundOver.play();

                }
            }


        })
    }
}

function kill() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.getElementById(`${row}-${col}`)
            cell.innerText = ""
        }
    }
}
const playAgainBtn = document.querySelector(".again")

playAgainBtn.addEventListener("click", () => {
    game.newGame()
    kill()

    gameOver = false
})
