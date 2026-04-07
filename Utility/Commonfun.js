import fs from 'fs';

const filePath = 'test-results/userdata.json';

export function saveUser(email) {
  let users = [];

  // Check if file exists
  if (fs.existsSync(filePath)) {
    users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  // Add new user
  users.push({ email });

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}