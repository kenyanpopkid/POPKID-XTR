const fs = require("fs");
const path = require("path");
const sudoFile = path.join(__dirname, "sudo.json");

if (!fs.existsSync(sudoFile)) {
  fs.writeFileSync(sudoFile, JSON.stringify([]));
}

function getSudoNumbers() {
  try {
    if (!fs.existsSync(sudoFile)) fs.writeFileSync(sudoFile, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(sudoFile));
  } catch (e) {
    console.error("[SUDO][READ_ERROR]:", e);
    return [];
  }
}

function saveSudoNumbers(numbers) {
  try {
    fs.writeFileSync(sudoFile, JSON.stringify(numbers, null, 2));
  } catch (e) {
    console.error("[SUDO][WRITE_ERROR]:", e);
  }
}

function setSudo(number) {
  let sudo = getSudoNumbers();
  if (!sudo.includes(number)) {
    sudo.push(number);
    saveSudoNumbers(sudo);
    return true;
  }
  return false; // already exists
}

function delSudo(number) {
  let sudo = getSudoNumbers();
  const index = sudo.indexOf(number);
  if (index !== -1) {
    sudo.splice(index, 1);
    saveSudoNumbers(sudo);
    return true;
  }
  return false;
}

module.exports = { getSudoNumbers, setSudo, delSudo };
