// const inputTxt = "input.txt";
const inputTxt = "sample.txt";

fetch(inputTxt)
  .then(res => res.text())
  .then(data => {
    let rowLength = data.split("\r\n")[0].length;
    let input = data.split("\r\n").join("").split("").map(Number);
    // console.log(part1(input, rowLength)); // 506
    console.log(part2(input, rowLength));
  })

  const part1 = (input, rowLength) => {
    let riskLevel = 0;
    input.forEach((num, i) => {
      // num is in 1 of 3 positions - in the middle, on the left edge or on the right edge, so add the corresponding values (ie. don't add i+1 if num is on the right edge or it will include the first member of the next row)
      let adjacentNums = [i-rowLength, i+rowLength];
      if (i % rowLength === 0) {
        adjacentNums.push(i+1);
      } else if (i % rowLength === rowLength-1) {
        adjacentNums.push(i-1);
      } else adjacentNums.push(i-1, i+1);

      // counter counts the number of adjacent values that are greater than the target value - if it is 4, then the number in the middle is the smallest.starting size is 0 if the target number is in the middle, or 1 if it is on the edge
      let counter = 4 - adjacentNums.length;
      adjacentNums.forEach(adjNum => {
        // if adjNum is less than zero, it is off the top of the board if it is above input.length-1, it is off the bottom of the board. otherwise is the target number is smaller than the neighbour it is being compared to (input[adjNum]) counter is increased
        if (adjNum < 0 || adjNum > input.length-1 || num < input[adjNum]) counter++;
      })
      // if counter is 4, the number is smaller than all of the adjacent numbers
      if (counter === 4) riskLevel += num+1;
    })
    return riskLevel;
  }

  // basins: 1(1), 0(9), 5(22), 5(46)
  // basins = {
  //    (i) 1: 3,
  //    (i) 9: 9,
  //    (i) 22: 14,
  //    (i) 46: 9,
  // }

  const part2 = (input, rowLength) => {
    // add numbers to basin based on the low point and visited point, eg basins[lowPoint]++
    let basins = {};

    let toVisit


  }
