export default function findMaxNumber(numbers) {
  if (numbers.length === 0) {
    return undefined; // Return undefined for an empty array
  }

  let max = numbers[0]; // Initialize max with the first element

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i]; // Update max if a larger number is found
    }
  }

  return max;
}
