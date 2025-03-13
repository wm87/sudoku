"use strict";

$(document).ready(function () {

    let sudokuBoard, solutionBoard;

    const solveGameBtn = $("#solve-game");
    const newGameBtn = $("#new-game");

    // Neues Spiel starten (Standard: Medium)
    newGame();

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
        }
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === "_") {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) return true;
                            board[row][col] = "_";
                        }
                    }
                    return false;
                }
            }
        }
        return board;
    }

    function swapRowsCols(board) {
        let swapCount = Math.floor(Math.random() * (81 - 10 + 1)) + 10;
        for (let i = 0; i < swapCount; i++) {
            if (Math.random() < 0.5) {
                let row1 = Math.floor(Math.random() * 9);
                let row2 = Math.floor(Math.random() * 9);
                [board[row1], board[row2]] = [board[row2], board[row1]];
            } else {
                let col1 = Math.floor(Math.random() * 9);
                let col2 = Math.floor(Math.random() * 9);
                for (let row = 0; row < 9; row++) {
                    [board[row][col1], board[row][col2]] = [board[row][col2], board[row][col1]];
                }
            }
        }
    }

    // Generiert das HTML-Board. Vorgegebene Zahlen erscheinen als Span, leere Zellen als Input-Felder.
    function generateBoardHTML(board) {
        let html = '<div class="sudoku-grid">';
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                let borderClass = (rowIndex % 3 === 2 && rowIndex !== 8 ? "bottom-border " : "") +
                                  (colIndex % 3 === 2 && colIndex !== 8 ? "right-border" : "");
                html += `<div class="sudoku-cell ${borderClass}">`;
                if (cell === "_") {
                    html += `<input type="text" maxlength="1" data-row="${rowIndex}" data-col="${colIndex}" class="cell-input" />`;
                } else {
                    html += `<span class="given">${cell}</span>`;
                }
                html += `</div>`;
            });
        });
        html += '</div>';
        $("#sudoku-container").html(html);
    }

    // Generiert ein vollständiges, gelöstes Sudoku aus einer Vorlage.
    function generateFullSudoku() {
        let board = [
            ["_", 8, "_", "_", "_", "_", "_", "_", "_"],
            ["_", "_", "_", "_", 9, "_", "_", 3, "_"],
            ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
            ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
            ["_", 1, "_", "_", 5, "_", "_", 6, "_"],
            ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
            ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
            ["_", 4, "_", "_", 7, "_", "_", 2, "_"],
            ["_", "_", "_", "_", "_", "_", "_", "_", "_"]
        ];
        swapRowsCols(board);
        solveSudoku(board);
        return board;
    }

    // Entfernt Zahlen gemäß Schwierigkeitsgrad ("easy": 40, "medium": 30, "hard": 25 bleiben sichtbar)
    function removeNumbers(board, level) {
        let clues = level === "easy" ? 40 : level === "medium" ? 30 : 25;
        let positions = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push([i, j]);
            }
        }
        shuffle(positions);
        positions.slice(0, 81 - clues).forEach(([row, col]) => board[row][col] = "_");
    }

    // Neues Spiel: Generiert ein neues Sudoku, speichert die Lösung und entfernt Zahlen.
    function newGame() {
        let level = $("#difficulty").val();
        let fullBoard = generateFullSudoku();
        solutionBoard = fullBoard.map(row => row.slice());
        sudokuBoard = fullBoard.map(row => row.slice());
        removeNumbers(sudokuBoard, level);
        generateBoardHTML(sudokuBoard);
    }

    // Beim "Lösen"-Button: Alle leeren Felder werden mit der korrekten Lösung gefüllt,
    // und falsche Eingaben werden rot markiert.
    $("#solve-game").on("click", function () {
        $(".cell-input").each(function () {
            let $input = $(this);
            let row = parseInt($input.attr("data-row"));
            let col = parseInt($input.attr("data-col"));
            let userVal = $input.val().trim();
            let correctVal = solutionBoard[row][col];
            if (userVal === "" || parseInt(userVal) !== correctVal) {
                $input.addClass("error");
            } else {
                $input.removeClass("error");
            }
        });
    });

    // Beim "Neues Spiel"-Button wird ein neues Puzzle generiert
    $("#new-game").on("click", function () {
        newGame();
    });
});
