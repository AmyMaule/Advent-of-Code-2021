const inputTxt = "input.txt";
// const inputTxt = "sample.txt";

fetch(inputTxt)
  .then(res => res.text())
  .then(data => {
    let input = data.split("\r\n").map(a => a.split(""));
    console.log(part1(input)); // 318099
    console.log(part2(input)); // 2389738699
})

const part1 = input => {
  let totalPoints = 0;
  let points = {")": 3, "]": 57, "}": 1197, ">": 25137};
  let openingBrackets = ["(", "[", "{", "<"];
  let closingBrackets = [")", "]", "}", ">"];

  // use for loop in order to use named inputLoop to continue once the first illegal closing bracket has been found
  inputLoop:
  for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
      // for each bracket, check if bracket is a closing bracket
        if (closingBrackets.indexOf(input[i][j]) !== -1) {
          // find the required opening bracket using the openingBrackets and closingBrackets arrays, as each pair shares the same index
          let openerNeeded = openingBrackets[closingBrackets.indexOf(input[i][j])];
          // if the bracket immediately before the current one is the required opener, splice the pair out of the input array and reset j to 0 to restart the loop
          if (input[i][j-1] === openerNeeded) {
            input[i].splice(j-1, 2);
            j = -1;
          }
        }
      }

      // if there are still any closing brackets remaining, the input is corrupted, so add the number of points required to total points and continue the outer loop (so only the first incorrect bracket is counted)
      for (let k = 0; k < input[i].length; k++) {
        if (closingBrackets.indexOf(input[i][k]) !== -1) {
          totalPoints += points[input[i][k]];
          continue inputLoop;
        }
      }
  }
  return totalPoints;
}

const part2 = input => {
  let points = {"(": 1, "[": 2, "{": 3, "<": 4};
  let openingBrackets = ["(", "[", "{", "<"];
  let closingBrackets = [")", "]", "}", ">"];
  // incompleteLines will hold only lines that are incomplete and not those that are corrupted
  let incompleteLines = [];

  inputLoop:
  for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
      // for each bracket, check if bracket is a closing bracket
        if (closingBrackets.indexOf(input[i][j]) !== -1) {
          // find the required opening bracket using the openingBrackets and closingBrackets arrays, as each pair shares the same index
          let openerNeeded = openingBrackets[closingBrackets.indexOf(input[i][j])];
          // if the bracket immediately before the current one is the required opener, splice the pair out of the input array and reset j to 0 to restart the loop
          if (input[i][j-1] === openerNeeded) {
            input[i].splice(j-1, 2);
            j = -1;
          }
        }
      }

      // if there are any closing brackets remaining in the input, continue the outer loop, otherwise add the line to incompleteLines
      for (let k = 0; k < input[i].length; k++) {
        if (closingBrackets.indexOf(input[i][k]) !== -1) continue inputLoop;
      }
      // add the current line to incompleteLines if the current loop is still running - reverse each line so the maths for multiplying by 5 and adding the current bracket's points works correctly
      incompleteLines.push(input[i].reverse());
  }
  let currentLine = [];
  incompleteLines.forEach(line => {
    let currentScore = 0;
    line.forEach(bracket => {
      currentScore *= 5;
      currentScore += points[bracket];
    })
    currentLine.push(currentScore);
  })

  // to find the middle score, sort array, then select the index of Math.floor(array.length/2)
  return currentLine.sort((a, b) => a-b)[Math.floor(currentLine.length/2)];
}