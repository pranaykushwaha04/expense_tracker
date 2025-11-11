const User = require('./User');
const Expense = require('./Expense');

User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Expense,
};
