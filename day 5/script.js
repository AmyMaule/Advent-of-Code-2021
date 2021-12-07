// --- Day 5: Hydrothermal Venture ---

// You come across a field of hydrothermal vents on the ocean floor! These vents constantly produce large, opaque clouds, so it would be best to avoid them if possible.

// They tend to form in lines; the submarine helpfully produces a list of nearby lines of vents (your puzzle input) for you to review. For example:

// 0,9 -> 5,9
// 8,0 -> 0,8
// 9,4 -> 3,4
// 2,2 -> 2,1
// 7,0 -> 7,4
// 6,4 -> 2,0
// 0,9 -> 2,9
// 3,4 -> 1,4
// 0,0 -> 8,8
// 5,5 -> 8,2

// Each line of vents is given as a line segment in the format x1,y1 -> x2,y2 where x1,y1 are the coordinates of one end the line segment and x2,y2 are the coordinates of the other end. These line segments include the points at both ends. In other words:

//     An entry like 1,1 -> 1,3 covers points 1,1, 1,2, and 1,3.
//     An entry like 9,7 -> 7,7 covers points 9,7, 8,7, and 7,7.

// For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2.

// So, the horizontal and vertical lines from the above list would produce the following diagram:

// .......1..
// ..1....1..
// ..1....1..
// .......1..
// .112111211
// ..........
// ..........
// ..........
// ..........
// 222111....

// In this diagram, the top left corner is 0,0 and the bottom right corner is 9,9. Each position is shown as the number of lines which cover that point or . if no line covers that point. The top-left pair of 1s, for example, comes from 2,2 -> 2,1; the very bottom row is formed by the overlapping lines 0,9 -> 5,9 and 0,9 -> 2,9.

// To avoid the most dangerous areas, you need to determine the number of points where at least two lines overlap. In the above example, this is anywhere in the diagram with a 2 or larger - a total of 5 points.

// Consider only horizontal and vertical lines. At how many points do at least two lines overlap?

let inputTxt = "input.txt";

fetch(inputTxt)
  .then(res => res.text())
  .then(data => {
    let input = data.split("\r\n").map(a => a.split(" -> ").map(b => b.split(",").map(Number)));
    console.log(bothParts(input, "part1"));  // 7438
    console.log(bothParts(input, "part2"));  // 21406
})

// --- Part Two ---

// Unfortunately, considering only horizontal and vertical lines doesn't give you the full picture; you need to also consider diagonal lines.
// Because of the limits of the hydrothermal vent mapping system, the lines in your list will only ever be horizontal, vertical, or a diagonal line at exactly 45 degrees. In other words:

//     An entry like 1,1 -> 3,3 covers points 1,1, 2,2, and 3,3.
//     An entry like 9,7 -> 7,9 covers points 9,7, 8,8, and 7,9.

// Considering all lines from the above example would now produce the following diagram:

// 1.1....11.
// .111...2..
// ..2.1.111.
// ...1.2.2..
// .112313211
// ...1.2....
// ..1...1...
// .1.....1..
// 1.......1.
// 222111....

// You still need to determine the number of points where at least two lines overlap. In the above example, this is still anywhere in the diagram with a 2 or larger - now a total of 12 points.

// Consider all of the lines. At how many points do at least two lines overlap?

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