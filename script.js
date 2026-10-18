
const numbers = [1, 2, 3, 4, 5];

function getEvenNumbers() {
    return numbers.filter((n) => n % 2 === 0);
}

export { getEvenNumbers };
