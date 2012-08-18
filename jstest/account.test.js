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
            expect(target.item).to.be(undefined);
            expect(target.amount).to.be(0);
            expect(target.date).to.be.a(Date);
            expect(target.type).to.be('credit');
        });
        it('should accepts initial values', function() {
            var target = new Account({
                item: '科目',
                amount: 3000,
                date: new Date(),
                type: 'debit',
            });
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
    
    describe('::find', function() {
        // callback to check results
        var success = sinon.spy.create(function(tx, results) {
            expect(results).to.be.an(Array);
            expect(results).to.have.length(txMock.executeSql.resultSet.rows.length);
        });
        
        beforeEach(function() {
            // always `undefined` unless SQL insert statement
            txMock.executeSql.resultSet.insertId = undefined
            // always `0` for SQL select statement
            txMock.executeSql.resultSet.rowsAffected = 0
        });
        
        // tests
        it('should function', function() {
            expect(Account.find).to.be.a('function')
        });
        it('should pass empty array for callback if no record found', function() {
            txMock.executeSql.resultSet.rows.length = 0;
            Account.find(txMock, success);
            expect(success.called).to.be.ok();
        });
        it('should pass found Account as Arrary for callback', function() {
            txMock.executeSql.resultSet.rows.length = 1;
            Account.find(txMock, success);
            expect(success.called).to.be.ok();
        });
        it('should support query argument for date', function() {
            txMock.executeSql.resultSet.rows.length = 1;
            var queryArgs = { date: new Date() };
            Account.find(txMock, success, null, queryArgs);
            expect(success.called).to.be.ok();
            expect(txMock.executeSql.calledWith(
                'SELECT * FROM Accounts WHERE date = ?',
                [queryArgs.date]
            )).to.be.ok();
        });
    });
    
    describe('::init', function() {
        it('should function', function() {
            expect(Account.init).to.be.a('function');
        });
    });
});

