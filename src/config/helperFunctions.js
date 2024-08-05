function random(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

module.exports = {
  random,
};
