function getRandomDate() {
  // Set the start and end date for the range
  const startDate = new Date("2019-01-01").getTime();
  const endDate = new Date("2019-12-31").getTime();

  // Generate a random timestamp within the range
  const randomTimestamp = startDate + Math.random() * (endDate - startDate);

  // Create a new Date object using the random timestamp
  const randomDate = new Date(randomTimestamp);

  return randomDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // Return date in 'December 21, 2019' format
}

module.exports = getRandomDate;
