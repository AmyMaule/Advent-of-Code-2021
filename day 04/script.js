const inputTxt = "input.txt";

fetch(inputTxt)
.then(res => res.text())
.then(data => {
  data = data.split("\r\n");
  let nums = data[0].split(",")
  // split boards by removing nums, then trimming external spaces, then splitting on the internal spaces, then removing the boards that are now just ""
  let boards = data
    .slice(1)
    .map(a => a
      .trim()
      .split(/\s+/g))
    .filter(a => a.length !== 1)

  // the splitBoards array contains groups of 5 rows, each one making up 1 board
  let splitBoards = [];
  for (let i = 4; i < boards.length; i++) {
    if (i % 5 === 4) {
      splitBoards.push([boards[i-4], boards[i-3], boards[i-2], boards[i-1], boards[i]])
    }
  }
  console.log(part1(nums, splitBoards)); // 8136
  console.log(part2(nums, splitBoards)); // 12738
})

const part1 = (nums, boards) => {
  let lastCalledNum;
  let winningBoard;

  outerLoop:
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < boards.length; j++) {
      for (let k = 0; k < boards[j].length; k++) {
        for (let l = 0; l < boards[j][k].length; l++) {
          // if the drawn number matches a number on the bingo card, change the number to be "a"
          if (boards[j][k][l] === nums[i]) boards[j][k][l] = "a";

          // match looks for vertical matches, resetting to zero after each loop (which loops 5 times)
          let match = 0;
          for (let m = 0; m < boards[j].length; m++) {
            if (boards[j][m][k] === "a") {
              match++;
            }
          }
          // check for win - if 5 matches are found or if every num in the horizontal board is equal, they must be all "a"
          if (match === 5 || boards[j][k].every(num => num === boards[j][k][0])) {
            lastCalledNum = nums[i];
            winningBoard = [...boards[j]];
            break outerLoop;
          }
        }
      }
    }
  }
  let totalUncalled = 0;
  winningBoard.forEach(row => {
    row.forEach(num => {
      if (num !== "a") totalUncalled += Number(num);
    })
  })
  return totalUncalled * Number(lastCalledNum);
}

const part2 = (nums, boards) => {
  // winningBoard starts with the indices of all boards, and is gradually spliced down to 1 winning board
  let winningBoard = [];
  for (let i = 0; i < boards.length; i++) {
    winningBoard.push(i);
  }
  let lastCalledNum;

  outerLoop:
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < boards.length; j++) {
      for (let k = 0; k < boards[j].length; k++) {
        for (let l = 0; l < boards[j][k].length; l++) {
          // if the drawn number matches a number on the bingo card, change the number to be "a"
          if (boards[j][k][l] === nums[i]) boards[j][k][l] = "a";

          // match looks for vertical matches, resetting to zero after each loop
          let match = 0;
          for (let m = 0; m < boards[j].length; m++) {
            if (boards[j][m][k] === "a") {
              match++;
            }
          }

          // check for win - if 5 matches are found or if every num in the horizontal board is equal, they must be all "a"
          if (match === 5 || boards[j][k].every(num => num === boards[j][k][0])) {
            if (winningBoard.length > 1) {
              // each time another board wins, splice its index out of winningBoard until only 1 remains
              let indexOfJ = winningBoard.indexOf(j)
              if (indexOfJ !== -1) winningBoard.splice(indexOfJ, 1);
            } else {
              let winningBoardIndex = winningBoard[0];
              // if j is not the winningBoardIndex, keep looping until there is a match on the winning board - if j is the winningBoardIndex, then the board has won
              if (j !== winningBoardIndex) continue;
              lastCalledNum = nums[i];
              break outerLoop;
            }
          }
        }
      }
    }
  }
  // add up each uncalled number
  let totalUncalled = 0;
  boards[winningBoard[0]].forEach(row => {
      row.forEach(num => {
        if (num !== "a") totalUncalled += Number(num);
      })
  })
  return totalUncalled * Number(lastCalledNum);
}