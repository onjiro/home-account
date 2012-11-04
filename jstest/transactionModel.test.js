var expect = require('expect.js')
, sinon = require('sinon')
, Transaction = require('../assets/www/js/transactionModel.js').Transaction;

describe('Transaction', function() {
    var target;
    beforeEach(function() {
        target = new Transaction();
    });

    describe('#initialize', function() {
        
        it('should be a constractor', function() {
            expect(target).to.be.a(Transaction);
        });
        
        it('should have default values', function() {
            expect(target.get('date')).to.be.a(Date);
            expect(target.get('accounts')).to.be.empty();
            expect(target.get('details')).to.be("");
        });
        
        it('should accepts initial values', function() {
            var values = {
                date    : new Date("2012-04-01"),
                accounts: ["hoge", "fuga"],
                details : "details"
            };
            
            var target = new Transaction(values);
            
            expect(target.get('date').getTime()).to.be(values.date.getTime());
            expect(target.get('accounts')).to.be(values.accounts);
            expect(target.get('details')).to.be(values.details);
        });
    });
    
    describe('#save', function() {
        var txMock;
        beforeEach(function() {
            txMock = {};
            txMock.executeSql = sinon.spy.create(function(sql, def, onSuccess, onError) {
                onSuccess(this, txMock.executeSql.resultSet);
            });
            txMock.executeSql.resultSet = {
                insertId: 'the insertId',
                rowsAffected: 1,
                rows: undefined,
            };
        });
        
        it ('should be a function', function() {
            expect(target.save).to.be.a('function');
        });
        it ('should pass transaction and insertId for callback', function() {
            var success = function(tx, insertId) {
                expect(tx).to.eql(txMock);
                expect(insertId).to.be('the insertId');
            };
            target.save(txMock, success);
            expect(txMock.executeSql.called).to.be.ok();
        });
        it ('should allow no success-callback passed', function() {
            target.save(txMock);
            expect(txMock.executeSql.called).to.be.ok();
        })
    });

    describe('::find', function() {
        var txMock = {};
        var success = sinon.spy.create(function(tx, results) {
            expect(results).to.be.an(Array);
            expect(results).to.have.length(txMock.executeSql.resultSet.rows.length);
        });
        
        beforeEach(function() {
            txMock.executeSql = sinon.spy.create(function(sql, def, onSuccess, onError) {
                onSuccess(this, txMock.executeSql.resultSet);
            });
            txMock.executeSql.resultSet = {
                // always `undefined` unless SQL insert statement
                insertId: undefined, 
                // always `0` for SQL select statement
                rowsAffected: 0,
                rows: {
                    length: 0,
                    item: sinon.spy.create(function(order){ return {
                        date: new Date()
                    }; }),
                }
            };
        });
        
        // tests
        it('should function', function() {
            expect(Transaction.find).to.be.a('function')
        });
        it('should pass empty array for callback if no record found', function() {
            txMock.executeSql.resultSet.rows.length = 0;
            Transaction.find(txMock, success);
            expect(success.called).to.be.ok();
        });
        it('should pass found Transaction as Arrary for callback', function() {
            txMock.executeSql.resultSet.rows.length = 1;
            Transaction.find(txMock, success);
            expect(success.called).to.be.ok();
        });
    });
});
