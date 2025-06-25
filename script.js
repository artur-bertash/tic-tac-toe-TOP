const SoundClick = new Audio("sound_click.mp3");
const SoundOver = new Audio("sound_over.mp3");


const GameBoard = (function () {
    const rows = 3;
    const cols = 3;
    let board = []

    for (let row = 0; row < rows; row++) {
        board.push([])
        for (let col = 0; col < cols; col++) {
            board[row].push(Cell())
        }
        console.log("\n")
    }

    const getBoard = () => board;

    const printBoard = () => {
        for (let row = 0; row < rows; row++) {
            let rowStr = ""
            for (let col = 0; col < cols; col++) {
                rowStr += board[row][col].getValue()
            }
            console.log(rowStr)

        }
    }

    const eraseBoard = () => {
        board = []

        for (let row = 0; row < rows; row++) {
            board.push([])
            for (let col = 0; col < cols; col++) {
                board[row].push(Cell())
            }
            console.log("\n")
        }
    }
    return { getBoard, printBoard, eraseBoard }

}())



function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player
    }

    const getValue = () => {
        return value
    }
    return { addToken, getValue }
}

const GameControl = (function (playerOneName = "Player X",
    playerTwoName = "Player O") {

    const board = GameBoard
    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ]

    let activePlayer = players[0]

    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {

        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const printNewRound = () => {
        board.printBoard()
        console.log(activePlayer.name + "'s turn!")
    }
    const isWon = () => {
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
    const playRound = (row, col) => {
        if (board.getBoard()[row][col].getValue() !== 0) {
            console.log("Can't move there")
            return
        }
        board.getBoard()[row][col].addToken(activePlayer.token)


        if (isWon()) {
            console.log(activePlayer.name + ": Won the game!")
            return { winner: activePlayer };
        }
        switchPlayer()
        printNewRound()
        return { winner: null }
    }
    const newGame = () => {
        board.eraseBoard()

    }
    const isFull = () => {
        if (board.getBoard().every(row => row.every(cell => cell.getValue() != 0))) {
            board.eraseBoard()

            return true
        }
        return false
    }
    printNewRound()
    return { playRound, getActivePlayer, newGame, isFull }

}())


const game = GameControl
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
                    }

                }
                if (game.isFull()) {
                    text.innerText = "It's a draw!";
                    gameOver = true

                }
            } else {
                SoundOver.play();
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
