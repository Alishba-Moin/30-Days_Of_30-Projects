"use client"; // Enables client-side rendering for this component

import React, { useState, useEffect, ChangeEvent } from "react"; // Import React hooks and types
import { Button } from "@/components/ui/button"; // Import custom Button component
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"; // Import custom Dialog components
import { Label } from "@/components/ui/label"; // Import custom Label component
import { Input } from "@/components/ui/input"; // Import custom Input component
import { FilePenIcon, PlusIcon, TrashIcon } from "lucide-react"; // Import icons from lucide-react
import { format } from "date-fns"; // Import date formatting utility

// Define the Expense type
type Expense = {
  id: number;
  name: string;
  amount: number;
  date: Date;
  category: string; 
};

// Define the Income type
type Income = {
  id: number;
  source: string;
  amount: number;
  date: Date;
};

// Define the Goal type
type Goal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
};

// Initial expenses to populate the tracker with categories
const initialExpenses: Expense[] = [
  {
    id: 1,
    name: "Groceries",
    amount: 500,
    date: new Date("2024-05-15"),
    category: "Food",
  },
  {
    id: 2,
    name: "Rent",
    amount: 1500,
    date: new Date("2024-06-01"),
    category: "Rent",
  },
  {
    id: 3,
    name: "Utilities",
    amount: 300,
    date: new Date("2024-06-05"),
    category: "Utilities",
  },
  {
    id: 4,
    name: "Dining Out",
    amount: 200,
    date: new Date("2024-06-10"),
    category: "Entertainment",
  },
];

// Initial income sources
const initialIncomes: Income[] = [
  {
    id: 1,
    source: "Salary",
    amount: 3000,
    date: new Date("2024-06-01"),
  },
  {
    id: 2,
    source: "Freelancing",
    amount: 800,
    date: new Date("2024-06-15"),
  },
  {
    id: 3,
    source: "Investments",
    amount: 500,
    date: new Date("2024-06-20"),
  },
  {
    id: 4,
    source: "Refunds",
    amount: 5000,
    date: new Date("2024-02-21"),
  },
];

// Initial categories
const initialCategories: string[] = [
  "Food",
  "Rent",
  "Utilities",
  "Entertainment",
  "Transportation",
  "Healthcare",
  "Miscellaneous",
];

// Initial goals
const initialGoals: Goal[] = [
  {
    id: 1,
    name: "Vacation",
    targetAmount: 2000,
    currentAmount: 500,
  },
  {
    id: 2,
    name: "New Car",
    targetAmount: 15000,
    currentAmount: 3000,
  },
  {
    id: 3,
    name: "New House",
    targetAmount: 250000,
    currentAmount: 5000,
  },
];

export default function ExpenseTracker() {
  // State to manage the list of expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // State to manage the list of incomes
  const [incomes, setIncomes] = useState<Income[]>([]);
  // State to manage the list of categories
  const [categories, setCategories] = useState<string[]>(initialCategories);
  // State to manage the list of goals
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  // State to manage the visibility of the expense modal
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  // State to manage the visibility of the income modal
  const [showIncomeModal, setShowIncomeModal] = useState<boolean>(false);
  // State to manage the visibility of the goal modal
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  // State to track if an expense is being edited
  const [isEditingExpense, setIsEditingExpense] = useState<boolean>(false);
  // State to track if an income is being edited
  const [isEditingIncome, setIsEditingIncome] = useState<boolean>(false);
  // State to track the current expense being edited
  const [currentExpenseId, setCurrentExpenseId] = useState<number | null>(null);
  // State to track the current income being edited
  const [currentIncomeId, setCurrentIncomeId] = useState<number | null>(null);
  // State to manage the new expense input form
  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: string;
    date: string; // Use string for easier handling with input type="date"
    category: string;
  }>({
    name: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"), // Initialize with today's date
    category: initialCategories[0], // Default to the first category
  });
  // State to manage the new income input form
  const [newIncome, setNewIncome] = useState<{
    source: string;
    amount: string;
    date: string;
  }>({
    source: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  // State to manage the new goal input form
  const [newGoal, setNewGoal] = useState<{
    name: string;
    targetAmount: number;
    currentAmount: number
  }>({
    name: "",
    targetAmount: 0,
    currentAmount: 0
  });


  // Calculate the total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Calculate the total income
  const totalIncome = incomes.reduce(
    (total, income) => total + income.amount,
    0
  );

  // Calculate the net balance
  const netBalance = totalIncome - totalExpenses;

  // useEffect to load expenses, incomes, goals, categories from local storage or set initial data
  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(
        JSON.parse(storedExpenses).map((expense: Expense) => ({
          ...expense,
          date: new Date(expense.date),
        }))
      );
    } else {
      setExpenses(initialExpenses);
    }

    const storedIncomes = localStorage.getItem("incomes");
    if (storedIncomes) {
      setIncomes(
        JSON.parse(storedIncomes).map((income: Income) => ({
          ...income,
          date: new Date(income.date),
        }))
      );
    } else {
      setIncomes(initialIncomes);
    }

    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      setGoals(initialGoals);
    }

    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(initialCategories);
    }
  }, []);

  // useEffect to store expenses, incomes, goals, categories in local storage whenever they change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  useEffect(() => {
    if (incomes.length > 0) {
      localStorage.setItem("incomes", JSON.stringify(incomes));
    }
  }, [incomes]);

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  }, [goals]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories]);
  
  // Function to handle adding a new expense
  const handleAddExpense = (): void => {
    if (!newExpense.category) {
      alert("Please select a category.");
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date),
        category: newExpense.category,
      },
    ]);

  
    resetExpenseForm(); // Reset the input form
    setShowExpenseModal(false); // Close the modal
  };
    

  // Function to handle editing an existing expense
  const handleEditExpense = (id: number): void => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    if (expenseToEdit) {
      setNewExpense({
        name: expenseToEdit.name,
        amount: expenseToEdit.amount.toString(),
        date: format(expenseToEdit.date, "yyyy-MM-dd"),
        category: expenseToEdit.category,
      });
      setCurrentExpenseId(id);
      setIsEditingExpense(true);
      setShowExpenseModal(true);
    }
  };

  // Function to handle saving the edited expense
  const handleSaveEditExpense = (): void => {
    if (currentExpenseId === null) return;

    setExpenses(
      expenses.map((expense) =>
        expense.id === currentExpenseId
          ? {
              ...expense,
              name: newExpense.name,
              amount: parseFloat(newExpense.amount),
              date: new Date(newExpense.date),
              category: newExpense.category,
            }
          : expense
      )
    );
    resetExpenseForm(); // Reset the input form
    setShowExpenseModal(false); // Close the modal
  };

  // Function to reset the expense input form
  const resetExpenseForm = (): void => {
    setNewExpense({
      name: "",
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      category: categories[0] || "",
    });
    setIsEditingExpense(false);
    setCurrentExpenseId(null);
  };

  // Function to handle deleting an expense
  const handleDeleteExpense = (id: number): void => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Function to handle adding a new income
  const handleAddIncome = (): void => {
    if (!newIncome.source) {
      alert("Please enter an income source.");
      return;
    }

    setIncomes([
      ...incomes,
      {
        id: incomes.length + 1,
        source: newIncome.source,
        amount: parseFloat(newIncome.amount),
        date: new Date(newIncome.date),
      },
    ]);
    resetIncomeForm(); // Reset the input form
    setShowIncomeModal(false); // Close the income modal
  };
  const handleEditIncome = (id: number): void => {
    const incomeToEdit = incomes.find((income) => income.id === id);
    if (incomeToEdit) {
      setNewIncome({
        source: incomeToEdit.source,
        amount: incomeToEdit.amount ? incomeToEdit.amount.toString() : "0", // Default to "0" if amount is undefined
        date: format(incomeToEdit.date, "yyyy-MM-dd"),
      });
      setCurrentIncomeId(id);
      setIsEditingIncome(true);
      setShowIncomeModal(true);
    }
  };

  // Function to handle saving the edited expense
  const handleSaveEditIncome = (): void => {
    if (currentIncomeId === null) return;

    setIncomes(
      incomes.map((income) =>
        income.id === currentIncomeId
          ? {
              ...income,
              source: newIncome.source,
              amount: parseFloat(newIncome.amount),
              date: new Date(newIncome.date),

            }
          : income
      )
    );
    resetIncomeForm(); // Reset the input form
    setShowIncomeModal(false); // Close the modal
  };
  // Function to handle deleting an income
  const handleDeleteIncome = (id: number): void => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  // Function to reset the income input form
  const resetIncomeForm = (): void => {
    setNewIncome({
      source: "",
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
    });
    setIsEditingIncome(false);
    setCurrentIncomeId(null);
  };

  // Function to handle input changes for expenses
  const handleExpenseInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value } = e.target;
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [id]: value,
    }));
  };

  // Function to handle input changes for incomes
  const handleIncomeInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
  
    setNewIncome((prevIncome) => ({
      ...prevIncome,
      [id]: value,
    }));
  };
  
  const handleGoalInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setNewGoal((prevGoal) => ({
      ...prevGoal,
      [id === "goal-name" ? "name" : "targetAmount"]: id === "target-amount" ? parseFloat(value) : value,
    }));
  };
  
  const handleAddGoal = (): void => {
    if (!newGoal.name || newGoal.targetAmount <= 0) {
      alert('Please enter a valid goal name and target amount.');
      return;
    }
  
    const newGoalEntry = {
      id: goals.length + 1,
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      currentAmount: 0, // Set initial current amount to 0
    };
  
    setGoals([...goals, newGoalEntry]);
    resetGoalForm();
    setShowGoalModal(false); // Close modal after adding goal
  };
  
  // Function to reset goal input form
  const resetGoalForm = (): void => {
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
    });
  };
  
  return (
    <div className="flex flex-col h-screen bg-stone-400">
    {/* Header section */}
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold font-serif">Expense Tracker</h1>
        <div className="text-xl font-bold">
          Net Balance: ${netBalance.toFixed(2)}
        </div>
      </div>
    </header>

    {/* Main section */}
    <main className="flex-1 overflow-y-auto p-6 space-x-2">
      {/* Buttons Section */}
      <section className="flex justify-around mb-8">
      <Button onClick={() => setShowExpenseModal(true)} className="bg-yellow-200 hover:bg-yellow-300 font-bold font-serif text-black">
      <PlusIcon className="w-6 h-6" />Add Expense
       </Button>
        <Button onClick={() => setShowIncomeModal(true)} className="bg-cyan-200 hover:bg-cyan-300 font-bold font-serif text-black">
        <PlusIcon className="w-6 h-6" />
          Add Income
        </Button>
        <Button onClick={() => setShowGoalModal(true)} className="bg-pink-200 hover:bg-pink-300 font-bold font-serif text-black">
        <PlusIcon className="w-6 h-6" />
          Add Goals
        </Button>
        
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Expenses Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">EXPENSES</h2>
          <ul className="space-y-4">
            {expenses.map((expense) => (
              <li key={expense.id} className="bg-card p-4 rounded-xl shadow-lg shadow-black flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{expense.name}</h3>
                  <p className="text-muted-foreground">
                    ${expense.amount.toFixed(2)} - {format(expense.date, 'dd/MM/yyyy')} 
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditExpense(expense.id)}>
                    <FilePenIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Income Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">INCOME</h2>
          <ul className="space-y-4">
            {incomes.map((income) => (
              <li key ={`${income.id}-${income.amount}-${income.date}`} className="bg-card p-4 rounded-xl shadow-lg shadow-black flex justify-between items-center">
              <div>
               <h3 className="text-lg font-medium">{income.source}</h3>
               <p className="text-muted-foreground">${income.amount.toFixed(2)} - {format(income.date, 'dd/MM/yyyy')}
               </p>
              </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditIncome(income.id)}>
                    <FilePenIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteIncome(income.id)}>
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {/* Goals Section */}
<section>
  <h2 className="text-xl font-bold mb-4 f">GOALS</h2>
  <ul className="space-y-4">
    {goals.map((goal) => (
      <li
        key={goal.id}
        className="bg-card p-4 rounded-xl shadow-lg shadow-black flex justify-between items-center"
      >
        <div>
          <h3 className="text-lg font-medium">{goal.name}</h3>
          <p className="text-muted-foreground">
            ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${Math.max(
                  (goal.currentAmount / goal.targetAmount) * 100 )}%`,
              }}
            ></div>
          </div>
        </div>
      </li>
    ))}
  </ul>
</section>
    </div>
    </main>

  {/* Modals for adding/editing expenses, incomes, and goals */}

       {/* Modal dialog for adding/editing expenses */}
       <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
       <DialogContent className="bg-card p-6 rounded-xl shadow-lg shadow-black w-full max-w-md">
           <DialogHeader>
             <DialogTitle>
               {isEditingExpense ? "Edit Expense" : "Add Expense"}
             </DialogTitle>
           </DialogHeader>
           <div>
             <div className="grid gap-4 font-semibold">
               {/* Expense name input */}
               <div className="grid gap-2">
                 <Label htmlFor="name">Expense Name</Label>
                 <Input
                   id="name"
                   value={newExpense.name}
                   onChange={handleExpenseInputChange}
                 />
               </div>
               {/* Expense amount input */}
               <div className="grid gap-2">
                 <Label htmlFor="amount">Amount</Label>
                 <Input
                   id="amount"
                   type="number"
                   value={newExpense.amount}
                   onChange={handleExpenseInputChange}
                 />
               </div>
               {/* Expense date input */}
               <div className="grid gap-2">
                 <Label htmlFor="date">Date</Label>
                 <Input
                   id="date"
                   type="date"
                   value={newExpense.date.toString().slice(0, 10)}
                   onChange={handleExpenseInputChange}
                 />
               </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} className="block w-full border rounded p-2">
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          </div>
            {/* Modal footer with action buttons */}
           <DialogFooter>
             <Button variant="outline" onClick={() => setShowExpenseModal(false)}>
               Cancel
             </Button>
             <Button
              onClick={isEditingExpense ? handleSaveEditExpense : handleAddExpense}
            >
              {isEditingExpense ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

     {/* Income Modal */}
     <Dialog open={showIncomeModal} onOpenChange={setShowIncomeModal}>
        <DialogContent className="bg-card p-6  rounded-xl shadow-lg shadow-black w-full max-w-md">
          <DialogHeader>
          <DialogTitle>
              {isEditingIncome ? "Edit Income" : "Add Income"}
            </DialogTitle>
          </DialogHeader>
          <div>
          <div className="grid gap-4 font-semibold">
            <div className="grid gap-2">
              <Label htmlFor="source">Income Source</Label>
              <Input
                  id="source"
                  value={newIncome.source}
                  onChange={handleIncomeInputChange}
                />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="income-amount">Amount</Label>
              <Input 
              id="income-amount" 
              type="number" 
              value={newIncome.amount} 
              onChange={handleIncomeInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="income-date">Date</Label>
              <Input 
              id="income-date" 
              type="date" 
              value={newIncome.date} 
              onChange={handleIncomeInputChange} />
            </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowIncomeModal(false)}>Cancel</Button>
            <Button
              onClick={isEditingIncome ? handleSaveEditIncome : handleAddIncome}
            >
              {isEditingIncome ? "Save Changes" : "Add Income"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    {/* Goal Modal */}
    <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
        <DialogContent className="bg-card p-6 rounded-lg shadow w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
          </DialogHeader>
          <div>
          <div className="grid gap-4 font-semibold">
            <div className="grid gap-2">
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input 
              id="goal-name" 
              value={newGoal.name}
              onChange={handleGoalInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target-amount">Target Amount</Label>
              <Input 
              id="target-amount" 
              type="number" 
              value={newGoal.targetAmount} 
              onChange={handleGoalInputChange} /> 
            </div>
            </div>
        </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowGoalModal(false)}>Cancel</Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
