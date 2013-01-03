tables = ['Accounts', 'Transactions']
exports.initialize = (dbName) ->
  deleted = []
  db = openDatabase(dbName, '', '', 300000)
  db.transaction (tx)->
    for table in tables
      do (table) ->
        tx.executeSql "DELETE FROM #{table}", [], -> deleted.push table
  return -> deleted.length == 2
