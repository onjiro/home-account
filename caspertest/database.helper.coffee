tables = ['Accounts', 'Transactions']
exports.initialize = (dbName) ->
  deleted = []
  db = openDatabase(dbName, '', '', 300000)
  for table in tables
    do (table) ->
      db.transaction (tx)->
        tx.executeSql "DELETE FROM #{table}", [], -> deleted.push table
  return -> deleted.length == 2
