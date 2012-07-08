var expect = require('expect.js');
var sinon = require('sinon');
var Account = require('../assets/www/js/account.js').Account;

describe('Account', function() {
    var target;
    beforeEach(function() {
        target = new Account();
    });

    // set up mock transaction
    var tx = {
        mocks:  {
            rowLength: 0,
            rowItem: sinon.spy.create(function(order) { return {}; }),
        }
    };
    tx.executeSql = sinon.spy.create(function(sql, def, onSuccess, onError) {
        var resultSet = {
            insertId: undefined, // always `undefined` unless SQL insert statement
            rowsAffected: 0, // always `0` for SQL select statement
            rows: {
                length: tx.mocks.rowLength,
                item: tx.mocks.rowItem,
            }
        };
        onSuccess(this, resultSet);
    });
    
    describe('#initialize', function() {
        it('should have default values', function() {
            expect(target.item).to.be(undefined);
            expect(target.amount).to.be(0);
            expect(target.date).to.be.a(Date);
        });
        it('should accepts initial values', function() {
            var target = new Account({
                item: '科目',
                amount: 3000,
                date: new Date(),
            });
            expect(target.item).to.be('科目');
            expect(target.amount).to.be(3000);
            expect(target.date).to.be.a(Date);
        });
    });
    
    describe('#save', function() {
        var txMock = {};
        txMock.executeSql = sinon.spy.create(function(sql, def, onSuccess, onError) {
            var resultSet = {
                insertId: 'the insertId',
                rowsAffected: 1,
                rows: undefined,
            };
            onSuccess(this, resultSet);
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
        })
    });
    
    describe('::find', function() {
        // callback to check results
        var success = sinon.spy.create(function(tx, results) {
            expect(results).to.be.an(Array);
            expect(results).to.have.length(tx.mocks.rowLength);
        });
        
        // tests
        it('should function', function() {
            expect(Account.find).to.be.a('function')
        });
        it('should pass empty array for callback if no record found', function() {
            tx.mocks.rowLength = 0;
            
            Account.find(tx, success);
            expect(success.called).to.be.ok();
        });
        it('should pass found Account as Arrary for callback', function() {
            tx.mocks.rowLength = 1;
            
            Account.find(tx, success);
            expect(success.called).to.be.ok();
        });
    });
});

