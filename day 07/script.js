const inputTxt = "input.txt";
// const inputTxt = "sample.txt";

fetch(inputTxt)
  .then(res => res.text())
  .then(data => {
    let input = data.split(",").map(Number)
    console.log(bothParts(input, "part1")); // 356992
    console.log(bothParts(input, "part2"));  // 101268110
  })

const bothParts = (input, part) => {
  // find the highest and lowest numbers in the input array
  let max = Math.max(...input);
  let min = Math.min(...input);

  // amountOfFuel is continually updated with the lowest amount of fuel needed as the loops run
  let amountOfFuel;
  for (let i = min; i <= max; i++) {
    // tempFuel stores the current amount of fuel needed as the loops are running
    let tempFuel = 0;
    input.forEach((el, j) => {
      // for part 1, the difference between the current value and the target value is linear (so 4 steps costs 1 + 1 + 1 + 1 = 4)
      if (part === "part1") tempFuel += Math.abs(input[j]-i);
      // for part 2, each step costs 1 extra fuel (so 4 steps costs 1 + 2 + 3 + 4 = 10), so use triangle numbers, the formula is (n*(n+1))/2
      if (part === "part2") tempFuel += ((Math.abs(input[j]-i)*(Math.abs(input[j]-i)+1))/2);
    });

    // initially set amountOfFuel with the first value, then overwrite it each time the current value is lower to get the lowest amount needed
    if (!amountOfFuel) {
      amountOfFuel = tempFuel;
    } else if (tempFuel < amountOfFuel) amountOfFuel = tempFuel;
  }
  return amountOfFuel;
}