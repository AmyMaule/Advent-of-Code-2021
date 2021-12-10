let inputTxt = "input.txt";

fetch(inputTxt)
  .then(res => res.text())
  .then(data => {
    let input = data.split("\r\n").map(a => a.split(" -> ").map(b => b.split(",").map(Number)));
    console.log(bothParts(input, "part1"));  // 7438
    console.log(bothParts(input, "part2"));  // 21406
})

const bothParts = (input, part) => {
  let vents = {};

  for (let i = 0; i < input.length; i++) {
    // if x coord is the same
    if (input[i][0][0] === input[i][1][0]) {
      // difference finds the difference between the x coords, then adds 1 to include the starting number and adds the starting number for the loop below
      let start = input[i][0][1] > input[i][1][1] ? input[i][1][1] : input[i][0][1];
      let difference = Math.abs(input[i][0][1] - input[i][1][1]) + 1 + start;

      for (let y = start; y < difference; y++) {
        let coords = `${input[i][0][0]},${y}`
        vents[coords] = vents[coords] ? vents[coords] += 1 : 1;
      }

    // if y coord is the same
    } else if (input[i][0][1] === input[i][1][1]) {
      let start = input[i][0][0] > input[i][1][0] ? input[i][1][0] : input[i][0][0];
      let difference = Math.abs(input[i][0][0] - input[i][1][0]) + 1 + start;

      for (let x = start; x < difference; x++) {
        let coords = `${x},${input[i][0][1]}`
        vents[coords] = vents[coords] ? vents[coords] += 1 : 1;
      }
    }
    // if neither x nor y is the same, line must be diagonal
    if (part === "part2") {
      if (input[i][0][1] !== input[i][1][1] && input[i][0][0] !== input[i][1][0]) {
        // coeffX and coeffY determine the coefficient that each one should be multiplied by based on whether x2 > x1 and y2 > y1 (e.g for (0, 0)(8, 8) both x and y should have coefficient 1 but for (6, 4)(2, 0), both x and y should have coefficient -1)
        let coeffX = input[i][0][0] > input[i][1][0] ? -1 : 1;
        let coeffY = input[i][0][1] > input[i][1][1] ? -1 : 1;

        // difference gets the difference between x2 and x1 (which is the same as the difference between y2 and y1 as the line is at 45 degrees) + 1 to be inclusive of start and end numbers
        let difference = Math.abs(input[i][0][0] - input[i][1][0]) + 1;
        // z increases by 1 each time so the coordinates can each increase or decrease by 1 each time
        for (let z = 0; z < difference; z++) {
          let coords = `${input[i][0][0]+(coeffX*z)},${input[i][0][1]+(coeffY*z)}`;
          vents[coords] = vents[coords] ? vents[coords] += 1 : 1;
        }
      }
    }
  }
  let ventsKeys = Object.keys(vents);

  // add all coords with the highest number of overlapping points (highestPoints) to the dangerousPoints array
  let dangerousPoints = ventsKeys.reduce((result, key) => {
    if (vents[key] >= 2) result.push(key);
    return result;
  }, []);
  return dangerousPoints.length;
}