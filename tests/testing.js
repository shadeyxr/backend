function reverse(string) {
  return string.split("").reverse().join("");
}

function average(array) {
  const reducer = array.reduce((sum, number) => {
    return sum + number;
  }, 0);

  return array.length === 0 ? 0 : reducer / array.length;
}

module.exports = { reverse, average };
