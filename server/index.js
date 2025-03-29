const express = require("express");
const loanRoutes = require("./routes/loanRoutes");
// ...existing code...

app.post("/api/loans", loanRoutes.borrowMedia);

// ...existing code...