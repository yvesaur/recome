// Arrays of possible name components
const firstName = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eleanor",
  "Felix",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
];
const lastName = [
  "Smith",
  "Johnson",
  "Williams",
  "Jones",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
];

// Function to generate a random author name
function generateRandomAuthorName() {
  const randomFirstName =
    firstName[Math.floor(Math.random() * firstName.length)];
  const randomLastName = lastName[Math.floor(Math.random() * lastName.length)];

  return `${randomFirstName} ${randomLastName}`;
}

module.exports = generateRandomAuthorName;
