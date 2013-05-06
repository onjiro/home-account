define([
    'underscore',
    'backbone',
    'model/commonlyUseAccountItemList',
    'view/commonlyUseAccountArea',
], function(_, Backbone, CommonlyUseAccountItemList, CommonlyUseAccountAreaView) {
    // 支出登録のビューモデル
    var AccountItemEntryView = Backbone.View.extend({
        initialize: function() {
            this.model.on('change', this.render, this);
            this.render();
        },
        render: function() {
            this.$('input.name').val(this.model.get('accountItem'));
            this.$('input.id').val(this.model.get('accountItemId'));
            return this;
        },
    });

    return Backbone.View.extend({
        events: {
            'click .edit-date': function(e){
                this.$('.past-mode').show()
                    .siblings().hide();
            },
            'click .no-edit-date': function(e) {
                this.$('.now-mode').show()
                    .siblings().hide();
                this.$('input').val(null);
            },
            'submit': function(e) {
                e.preventDefault();
                this.onSubmit();
            },
        },
        initialize: function() {
            this.alertTemplate = this.options.alertTemplate;
            this.accounts = {
                debit:  new Backbone.Model({ accountItem: '' }),
                credit: new Backbone.Model({ accountItem: '' }),
            }
            new AccountItemEntryView({
                el: this.$('.control-group.item'),
                model: this.accounts.debit,
            });
            new AccountItemEntryView({
                el: this.$('.control-group.opposite-item'),
                model: this.accounts.credit,
            });
            // よく使う勘定科目の表示領域
            this.commonlyUseAccounts = {
                debit:  new CommonlyUseAccountItemList(),
                credit: new CommonlyUseAccountItemList(),
            }
            new CommonlyUseAccountAreaView({
                el: this.$('.debit.commonly-use'),
                model: this.accounts.debit,
                collection: this.commonlyUseAccounts.debit,
            });
            new CommonlyUseAccountAreaView({
                el: this.$('.credit.commonly-use'),
                model: this.accounts.credit,
                collection: this.commonlyUseAccounts.credit,
            });

            this.commonlyUseAccounts.debit.fetch({
                side: 'debit',
                limit: 3,
            });
            this.commonlyUseAccounts.credit.fetch({
                side: 'credit',
                limit: 3,
            });
        },
        onSubmit: function() {
            // 画面に入力された情報を取得
            var dateVal = $('[name=date]').val();
            var entries = {
                date: (dateVal) ? new Date(dateVal): new Date(),
                item: this.$('[name=item]').val(),
                itemId: this.$('[name="item-id"]').val(),
                oppositeItem: this.$('[name=opposite-item]').val(),
                oppositeItemId: this.$('[name="item-id"]').val(),
                amount: this.$('[name=amount]').val(),
                details: null
            };
            // 勘定を登録する
            var accountTransaction = new Transaction({
                amount: entries.amount,
                date: entries.date,
                details: entries.details,
                accounts: [
                    // 購入した品目側、通常は資産増加のため、借方（左側）の増加
                    new Account({
                        date: entries.date,
                        item: entries.item,
                        itemId: entries.itemId,
                        amount: entries.amount,
                        type: 'debit'
                    }),
                    // 支払い方法、通常は資産減少のため、貸方（右側）の増加
                    new Account({
                        date: entries.date,
                        item: entries.oppositeItem,
                        itemId: entries.oppositeItemId,
                        amount: entries.amount,
                        type: 'credit'
                    }),
                ],
            });
            accountTransaction
                .on('save', function() {
                    $('#history')
                        .prepend(this.alertTemplate({message: "ok to save!!"}))
                        .children().first().delay(1000).fadeOut(function() { this.remove(); });
                    this.collection.add(accountTransaction, {at: 0, newest: true});
                    this.$('form').trigger('reset');
                }, this)
                .on('invalid', function(model, error) {
                    alert(error);
                }, this)
                .save({validate: true});
        },
    });
});
