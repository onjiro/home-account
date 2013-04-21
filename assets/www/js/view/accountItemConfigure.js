/**
 * AccountItemを設定するためのビュー
 *
 * el, collectionをオブジェクトの生成時に与えること。
 */
define(['backbone'], function(Backbone) {
    return Backbone.View.extend({
        events: {
            'click .classification': function(e) {
                $(e.currentTarget)
                    .children('select').show()
                    .siblings().hide();
            },
            'change .classification': function(e) {
                var classification = this.classifications.get(e.target.value),
                accountItem = this.collection.get($(e.srcElement).closest('[data-id]').data('id'));
                db.transaction(function(tx) {
                    accountItem.save({
                        classification: classification.get('name')
                    }, {tx: tx});
                });
            }
        },

        initialize: function(options) {
            this.classifications = options.classifications;
            this.rowTemplate = _.template($('#account-item-template').html());
            this.optionTemplate = _.template($('#select-option-template').html());
            this.$tableBody = this.$('tbody');
            this.$classificationOptions = $('<div/>');

            this.collection
                .on('reset', this.render, this)
                .on('change', function(model) {
                    this.$el.find('[data-id="' + model.id + '"]')
                        .find('span').text(model.get('classification')).show()
                        .siblings().hide();
                }, this);
            this.classifications.on('reset', this.render, this);
        },
        render: function() {
            this.$classificationOptions.empty();
            this.classifications.each(function(classificationItem) {
                this.$classificationOptions.append(this.optionTemplate(classificationItem.attributes));
            }, this);
            this.collection.each(function(accountItem) {
                this.$tableBody.append(this.rowTemplate(accountItem.attributes));
            }, this);
            this.$tableBody.find('select').append(this.$classificationOptions.html());
        },
    });
});
