const inputTxt = "input.txt";

fetch(inputTxt)
  .then(res => res.text())
  .then(data => {
    let input = data.split("\r\n");
    console.log(part1(input)); // 4006064
    console.log(part2(input)); // 5941884
  })

const part1 = input => {
  // create an array with length input[0] (all inputs are the same length) filled with empty strings
  let output = new Array(input[0].length).fill("");
  // split each individual number into its component 0s and 1s, add each digit in turn to output, so the first digit of each number goes into output[0], etc
  input.forEach(num => num.split("").forEach((int, i) => output[i] += int));
  // sort each code to group all zeros at the beginning
  let sortedOutput = output.map(num => num.split("").sort((a, b) => a-b));
  let gammaRate = "";
  let epsilonRate = "";

  sortedOutput.forEach(num => {
    if (num[Math.ceil(num.length/2)] === "0") {
      gammaRate += "0";
      epsilonRate += "1";
    } else {
      gammaRate += "1";
      epsilonRate += "0";
    }
  })
  gammaRate = parseInt(gammaRate, 2);
  epsilonRate = parseInt(epsilonRate, 2);
  return gammaRate * epsilonRate;
}

const part2 = input => {
  input = input.sort((a, b) => a-b);

  const findRating = (input, rating) => {
    let currentDigit;
    // Loop through the input array looking at each digit in turn to determine whether the most common digit in each place is 0 or 1
    for (let i  = 0; i <= input[0].length; i++) {
      // Math.ceil((input.length-1)/2) finds the halfway point of the array, where "1" is used if both 0 and 1 occur the same number of times
      if (input[Math.ceil((input.length-1)/2)][i] === "1") {
        currentDigit = "1";
      } else currentDigit = "0";

      if (input.length === 1) {
        return parseInt(input[0], 2);
      } else {
        input = input.filter(num => {
          if (rating === "o2") {
            // for the o2 rating, use the most common digit, for the co2 rating, use the least common digit
            return num[i] === currentDigit;
          } else return num[i] !== currentDigit;
        });
      }
    }
  }
  return findRating(input, "o2") * findRating(input, "co2");
}