import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { expenses as expensesApi, Expense } from '../lib/api';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { Plus, LogOut, TrendingUp, DollarSign, Calendar, PieChart } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other',
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expensesApi.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    }
    setLoading(false);
  };

  const handleAddExpense = async (
    expenseData: {
      title: string;
      amount: number;
      category: string;
      date: string;
      notes: string | null;
    }
  ) => {
    setFormLoading(true);
    try {
      await expensesApi.create(expenseData);
      await loadExpenses();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
    setFormLoading(false);
  };

  const handleUpdateExpense = async (
    expenseData: {
      title: string;
      amount: number;
      category: string;
      date: string;
      notes: string | null;
    }
  ) => {
    if (!editingExpense) return;

    setFormLoading(true);
    try {
      await expensesApi.update(editingExpense.id, expenseData);
      await loadExpenses();
      setEditingExpense(undefined);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
    setFormLoading(false);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expensesApi.delete(id);
      await loadExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  const filteredExpenses = useMemo(() => {
    if (filterCategory === 'all') return expenses;
    return expenses.filter((e) => e.category === filterCategory);
  }, [expenses, filterCategory]);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const thisMonth = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    });
    const monthTotal = thisMonth.reduce((sum, e) => sum + Number(e.amount), 0);
    const avgExpense = expenses.length > 0 ? total / expenses.length : 0;

    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {} as Record<string, number>);

    const topCategory =
      Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      total,
      monthTotal,
      avgExpense,
      topCategory,
      count: expenses.length,
    };
  }, [expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.count} expenses</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.monthTotal)}</p>
            <p className="text-sm text-gray-600 mt-1">Current month</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Average</h3>
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.avgExpense)}</p>
            <p className="text-sm text-gray-600 mt-1">Per expense</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Top Category</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900 truncate">{stats.topCategory}</p>
            <p className="text-sm text-gray-600 mt-1">Most spending</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Expenses</h2>
              <p className="text-gray-600 mt-1">Track and manage your spending</p>
            </div>
            <button
              onClick={() => {
                setEditingExpense(undefined);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition whitespace-nowrap ${
                filterCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEdit}
              onDelete={handleDeleteExpense}
            />
          )}
        </div>
      </main>

      {showForm && (
        <ExpenseForm
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          onCancel={handleCancelForm}
          initialData={editingExpense}
          loading={formLoading}
        />
      )}
    </div>
  );
}
