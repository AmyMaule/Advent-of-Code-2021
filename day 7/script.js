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
      if (part === "part1") tempFuel += Math.abs(input[j]-i);
      if (part === "part2") tempFuel += ((Math.abs(input[j]-i)*(Math.abs(input[j]-i)+1))/2);
    });

    if (!amountOfFuel) {
      amountOfFuel = tempFuel;
    } else if (tempFuel < amountOfFuel) amountOfFuel = tempFuel;
  }
  return amountOfFuel;
}