const inputTxt = "input.txt";

fetch(inputTxt)
  .then(res => res.text())
  .then(data => {
    let input = data.split("\r\n").map(a => a.split(" | "))
    console.log(part1(input)); // 539
    console.log(part2(input)); // 1084606
  })

const part1 = input => {
  let outputValues = [];
  input.forEach(num => {
    outputValues.push(num[1].split(" "));
  });
  let numOutputDigits = 0;
  outputValues.forEach(nums => {
    nums.forEach(num => {
      // if the output digit has 2, 4, 3 or 7 segments it is a 1, 4, 7 or 8 respectively
      if (num.length === 2 || num.length === 4 || num.length === 3 || num.length === 7) numOutputDigits++;
    });
  });
  return numOutputDigits;
}

const part2 = input => {
  let totalValues = 0;
  input.forEach(display => {
    let inputDigits = [].concat(display[0].split(" ").map(a => a.split("")));
    let outputDigits = [].concat(display[1].split(" ").map(a => a.split("")));

    let remainingDigits = [];
    let currentDigit = new Map();
    inputDigits.forEach(digitArr => {
      if (digitArr.length === 2) {
        currentDigit.set(1, digitArr);
      } else if (digitArr.length === 4) {
        currentDigit.set(4, digitArr);
      } else if (digitArr.length === 3) {
        currentDigit.set(7, digitArr);
      } else if (digitArr.length === 7) {
        currentDigit.set(8, digitArr);
      } else remainingDigits.push(digitArr);
    });

    // digitA, digitB, etc represent the individial digits as shown in the example, with each one eventually equal to a lowercase digit (that may or may not be the same) - digitG was not necessary to work out the values of each number
    let digitA, digitB, digitC, digitD, digitE, digitF;
    let chars = ["a", "b", "c", "d", "e", "f", "g"];

    // first assign values to the digits that have a unique number of appearances within the numbers (digitE is the only letter to appear 4 times in the numbers 0-9, for example, in 0, 2, 6 and 8)
    chars.forEach(char => {
      let counter = 0;
      inputDigits.forEach(digitArr => {
        if (digitArr.indexOf(char) !== -1) counter++;
      })
      if (counter === 6) digitB = char;
      if (counter === 4) digitE = char;
      if (counter === 9) digitF = char;
    });

    // 1 has only digitF and digitC, as digitF is known, use it to find digitC
    currentDigit.get(1).forEach(char => {
      if (currentDigit.get(1).indexOf(char) !== currentDigit.get(1).indexOf(digitF)) digitC = char;
    });

    // 1 has one extra letter than 7: digitA, so map over 7 to find out which letter 1 does not contain, this is digitA
    currentDigit.get(7).forEach(char => {
      if (currentDigit.get(1).indexOf(char) === -1) digitA = char;
    });

    // 4 has digitD that 7 doesn't have (4 also has digitB so ensure char is not digitB before setting it to digitD)
    currentDigit.get(4).forEach(char => {
      if (currentDigit.get(7).indexOf(char) === -1 && char !== digitB) digitD = char;
    });

    // get 0, 6, 9 and 3
    remainingDigits.forEach(digit => {
      // 0 is the same as 8 without digitD, so if the digit.concat(digitD) has all the same chars as 8, it must be 0
      if (currentDigit.get(8).every(char => digit.concat(digitD).includes(char))) currentDigit.set(0, digit);
      // 6 is the same as 8 without digitC
      if (currentDigit.get(8).every(char => digit.concat(digitC).includes(char))) currentDigit.set(6, digit);
      // 9 is the same as 8 without digitE
      if (currentDigit.get(8).every(char => digit.concat(digitE).includes(char))) currentDigit.set(9, digit);
      // 3 is the same as 8 without digitB and digitE (check for length as 9.concat(digitB, digitE) is also 8)
      if (currentDigit.get(8).every(char => digit.concat(digitB, digitE).includes(char)) && digit.length === 5) currentDigit.set(3, digit);
    })

    // get 5 after getting 6; get 2 after getting 3
    remainingDigits.forEach(digit => {
      // 5 is the same as 6 with digitE (check for length === 5 as 9 and 6 would also be valid digits from the remainingDigits array, but both have length 6)
      if (currentDigit.get(6).every(char => digit.concat(digitE).includes(char)) & digit.length === 5) currentDigit.set(5, digit);
      // 2 is the same as 8 with digits BE, so concatenating digits BE means only digit 8 should match everything in digit 2
      if (currentDigit.get(8).every(char => digit.concat(digitB, digitF).includes(char)) && digit.concat(digitB, digitF).every(char => currentDigit.get(8).includes(char))) currentDigit.set(2, digit);
      // if (currentDigit.get(3).every(char => digit.concat(digitF).includes(char))) currentDigit.set(0, digit);
    })

    // As items are stored in the map in the order they went in, convert the map to an array and sort it, then slice off the Map's key for each item, flatten it and join each item so it is in the same form as the output values
    let digitValues = Array.from(currentDigit).sort().map(digit => digit.slice(1)).flat();

    // displayTotal is a temp total will add each digit and at the end of each iteration, will push it to the main totals array
    let displayTotal = "";

    outputLoop:
    // for each value in outputDigits, loop over the digitValues to find the match, then add that number as a string to displayTotal
    for (let value of outputDigits) {
      for (let i = 0; i < digitValues.length; i++) {
        if (value.every(char => digitValues[i].includes(char)) && digitValues[i].every(char => value.includes(char))) {
          displayTotal += i;
          continue outputLoop;
        }
      }
    }
    // add the total for this number display before clearing the currentDigit data for the next display
    totalValues += Number(displayTotal);
    currentDigit.clear();
  })
  return totalValues;
}





// rest of sample.txt
// edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
// fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
// fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
// aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
// fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
// dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
// bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
// egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
// gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce