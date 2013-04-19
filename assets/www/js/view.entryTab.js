var EntryTabView = (function() {
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
        },
        onSubmit: function() {
            // 画面に入力された情報を取得
            var dateVal = $('[name=date]').val();
            var entries = {
                date: (dateVal) ? new Date(dateVal): new Date(),
                item: this.$('[name=item]').val(),
                oppositeItem: this.$('[name=opposite-item]').val(),
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
                        amount: entries.amount,
                        type: 'debit'
                    }),
                    // 支払い方法、通常は資産減少のため、貸方（右側）の増加
                    new Account({
                        date: entries.date,
                        item: entries.oppositeItem,
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
                .on('error', function(model, error) {
                    alert(error);
                }, this)
                .save({validate: true});
        },
    });
})();
