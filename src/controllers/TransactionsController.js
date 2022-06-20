const Transactions = require('../models/Transactions');
const { Op, col, literal, fn, QueryTypes, where } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../models/Transactions');

module.exports = {
  async index(req, res) {

    const { page, limit, createdAt } = req.query;

    let createdAtFormated = moment(createdAt).format('YYYY-MM-DD HH:mm:ss');

    const transactions = await Transactions.findAndCountAll({
      include: [
        {
          association: 'accounts',
          // where: {
          //   createdAt: {
          //     [Op.eq]: col('Transactions.created_at')
          //   }
          // },
          required: true,
          on: {
            account_id: {
              [Op.eq]: col('Transactions.account_id')
            }
          }

        }
      ],
      limit: 5
    });

    return res.json(transactions);
  },

  async indexQuery(req, res) {

    const { page, limit, createdAt, bankId } = req.query;

    let createdAtFormated = moment(createdAt).format('YYYY-MM-DD HH:mm:ss');

    const filters = {
      'bankId': "AND account->>'bankId' = :bankId",
      
    }

    const params = {
      createdAt: createdAtFormated,
      bankId
    }

    // count items to pagination
    const resultCount = await Transactions.sequelize.query(`
        SELECT COUNT(*) AS count_items FROM (
          SELECT
            account_id
          FROM
              transactions
          WHERE created_at <= :createdAt
          ${bankId ? filters.bankId : '--'}
          GROUP BY account_id
      ) AS tr1
  `, { replacements: { ...params }, type: QueryTypes.SELECT })

    const [{ count_items }] = resultCount;

    const { limitSize, offset, nextPage } = Transactions.getPagination(page, limit, count_items);

    // left if filter count 0 or page invalid
    if (!count_items || count_items == 0 || !nextPage) {
      const response = Transactions.getPagingData({ totalCount: 0, rows: [] }, page, limit);
      return res.send(response);
    }

    const transactions = await Transactions.sequelize.query(`
        SELECT account->>'bankId' as bank,
               account->>'nameOwner' as name,
               account->>'documentNumber' as documentNumber,
               account->>'personType' as personType,
               account->>'number' as account,
               amount as balance,
               created_at as date
        FROM public.transactions as tr1
        INNER JOIN (SELECT account_id, MAX(created_at) as max_date
            FROM public.transactions
            WHERE created_at <= :createdAt
          GROUP BY account_id) as tr2
        ON tr1.account_id = tr2.account_id
        WHERE tr1.created_at = tr2.max_date
        ${bankId ? filters.bankId : '--'}
        ORDER BY tr1.created_at DESC 
        LIMIT :limit OFFSET :offset;
    `, { replacements: { ...params, offset: offset, limit: limitSize }, type: QueryTypes.SELECT })

    const result = { rows: transactions, totalCount: count_items }
    const response = Transactions.getPagingData(result, page, limit);

    return res.json(response);
  }


};