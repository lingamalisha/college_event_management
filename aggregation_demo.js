const { spawn } = require("child_process");
const path = require("path");

// This script acts as a proxy to run the aggregation demo from the root
// while maintaining the backend environment (node_modules, models, .env, etc.)

console.log("Redirecting to backend to run aggregation demo...\n");

const child = spawn("node", ["aggregation_demo.js"], {
  cwd: path.join(__dirname, "backend"),
  stdio: "inherit",
  shell: true
});

child.on("exit", (code) => {
  process.exit(code);
});
