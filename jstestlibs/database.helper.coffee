tables = [
  'Accounts'
  'AccountItems'
  'AccountItemClassifications'
  'Transactions'
]
exports.initializer = ->
  deleted = []
  return {
    execute: (dbName) ->
      openDatabase(dbName, '', '', 300000).transaction (tx)->
        for table in tables
          do (table) ->
            tx.executeSql "DELETE FROM #{table}", [], -> deleted.push table
            if table == 'AccountItemClassifications'
              for data in [
                ['流動資産'      , 'debit']
                ['固定資産'      , 'debit']
                ['繰延資産'      , 'debit']
                ['流動負債'      , 'credit']
                ['固定負債'      , 'credit']
                ['純資産'        , 'credit']
                ['収益'          , 'credit']
                ['費用'          , 'debit']
                ['固定資産評価損', 'debit']
                ['その他借方'    , 'debit']
                ['その他貸方'    , 'credit']
              ]
                do (data) ->
                  tx.executeSql 'INSERT INTO AccountItemClassifications (name, side) VALUES (?, ?)', data
    succeeded: -> deleted.length == tables.length
  }
