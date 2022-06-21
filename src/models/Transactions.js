const { Model, DataTypes } = require('sequelize');

class Transactions extends Model {
  static init(sequelize) {
    super.init({
      transactionId: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true
      },
      accountId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      balance_after_transaction: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      externalAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true
      },
      paymentMethodId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      webhook_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      transactionData: {
        type: DataTypes.JSON,
        allowNull: true
      },
      account: {
        type: DataTypes.JSON,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      },
    }, 
    {
      tableName: 'transactions',
      timestamps: true,
      underscored: true,
      sequelize
    })
  }

  static associate(models) {
    this.hasOne(models.Transactions, { foreignKey: 'account_id', as: 'accounts' });
  }

  static getPagination(page, size, total){
    const limitSize = size ? +size : 3;
    const offset = page == 1 ? 0 : (page - 1) * limitSize;
    let nextPage = ((page - 1) * limitSize < total) ? true : false;
    nextPage = page == 1 ? true : nextPage; // page 1
    return { limitSize, offset, nextPage };
  };
  
  static getPagingData(data, page, limit){
    const { totalCount: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, items, totalPages, currentPage };
  };
}

module.exports = Transactions;