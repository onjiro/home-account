var expect = require('expect.js');
var sinon = require('sinon');
var Transaction = require('../assets/www/js/transaction.js').Transaction;

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
            expect(target.date).to.be.a(Date);
            expect(target.accounts).to.be.empty();
            expect(target.details).to.be("");
        });
        
        it('should accepts initial values', function() {
            var values = {
                date    : new Date("2012-04-01"),
                accounts: ["hoge", "fuga"],
                details : "details"
            };
            
            var target = new Transaction(values);
            
            expect(target.date).to.be(values.date);
            expect(target.accounts).to.be(values.accounts);
            expect(target.details).to.be(values.details);
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

});
