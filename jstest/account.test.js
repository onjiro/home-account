var expect = require('expect.js');
var sinon = require('sinon');
var Account = require('../assets/www/js/account.js').Account;

describe('Account', function() {
    var target, txMock;
    beforeEach(function() {
        target = new Account();
        
        txMock = {};
        txMock.executeSql = sinon.spy.create(function(sql, def, onSuccess, onError) {
            onSuccess(this, txMock.executeSql.resultSet);
        });
        txMock.executeSql.resultSet = {
            insertId: undefined,
            rowsAffected: 0,
            rows: {
                length: 0,
                item: sinon.spy.create(function(order){ return {}; }),
            }
        };
    });
    
    describe('#initialize', function() {
        it('should have default values', function() {
            expect(target.transactionId).to.be(undefined);
            expect(target.item).to.be(undefined);
            expect(target.amount).to.be(0);
            expect(target.date).to.be.a(Date);
            expect(target.type).to.be('credit');
        });
        it('should accepts initial values', function() {
            var target = new Account({
                transactionId: 55,
                item: '科目',
                amount: 3000,
                date: new Date(),
                type: 'debit',
            });
            expect(target.transactionId).to.be(55);
            expect(target.item).to.be('科目');
            expect(target.amount).to.be(3000);
            expect(target.date).to.be.a(Date);
            expect(target.type).to.be('debit');
        });
    });
    
    describe('#save', function() {
        beforeEach(function() {
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

