tables = [
  'Accounts'
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
    succeeded: -> deleted.length == 2
  }
