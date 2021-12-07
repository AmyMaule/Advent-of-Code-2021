const inputTxt = "input.txt";

fetch(inputTxt)
.then(res => res.text())
.then(data => {
  // split data into an array of numbers
  const input = data.split("\n").map(measurement => Number(measurement));
  console.log(part1(input)); // 1288
  console.log(part2(input)); // 1311
});

const part1 = input => {
let numIncreases = 0;
for (let i = 1; i < input.length; i++) {
  // if the current measurement is greater than the previous measurement, add 1 to numIncreases
  if (input[i] > input[i-1]) {
    numIncreases++;
  }
}
return numIncreases;
}

const part2 = input => {
  let numIncreases = 0;
  for (let i = 2; i < input.length; i++) {
    // if input[i+1] doesn't exist, the end of the array has been reached
    if (!input[i+1]) break;
    // if the total of the 3 current measurements (i+1, i and i-1) is greater than the previous 3 (i, i-1, i-2) add 1 to numIncreases
    if (input[i+1] + input[i] + input[i-1] > input[i] + input[i-1] + input[i-2]) {
      numIncreases++;
    }
  }
  return numIncreases;
}