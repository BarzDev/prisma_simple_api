const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Get all expenses
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await prisma.expenses.findMany();
    res.json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching expenses" });
  }
});

// Get a single expense by ID
app.get("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await prisma.expenses.findUnique({ where: { id } });
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the expense" });
  }
});

// Create a new expense
app.post("/expenses", async (req, res) => {
  const { date, amount, transaction_type, balance, description } = req.body;
  try {
    const newExpense = await prisma.expenses.create({
      data: {
        date: new Date(date),
        amount,
        transaction_type,
        balance,
        description,
      },
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the expense" });
  }
});

// Update an expense by ID
app.put("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { date, amount, transaction_type, balance, description } = req.body;
  try {
    const updatedExpense = await prisma.expenses.update({
      where: { id },
      data: {
        date: new Date(date),
        amount,
        transaction_type,
        balance,
        description,
      },
    });
    res.json(updatedExpense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the expense" });
  }
});

// Delete an expense by ID
app.delete("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.expenses.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the expense" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
