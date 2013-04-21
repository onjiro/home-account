define(['jquery', 'jquery-ui', 'bootstrap'], function() {
     $(function() {
        $(document).on('change', 'select', function(e) {
            $(this.selectedOptions[0]).trigger('select');
        });
    });

    $(function() {
        $.datepicker.setDefaults({
            dateFormat: 'yy/mm/dd',
        });
        $(document).on('focusin', '.datepicker', function(e) {
            $(e.target).datepicker();
        });
    });

    // タブ変更時の動作を設定
    $(function() {
        $('body')
            .on('click', '.js-tab a', function(e) {
                e.preventDefault();
                $(this).tab('show');
            })
            .on('show', '.js-tab a', function(e) {
                $($(this).attr('href')).trigger('show', e);
            })
            .on('show', '.js-tab a', function(e) {
                // タブペインの入力内容を引き継ぐ
                var $inputs = $(e.target.hash).find('input')
                , $previousInputs = $(e.relatedTarget.hash).find('input');

                $.each(['date', 'amount', 'item', 'opposite-item'], function(i, name) {
                    var selector = '[name="' + name + '"]';
                    $inputs.filter(selector).val(
                        $previousInputs.filter(selector).val() || $inputs.filter(selector).val());
                });
            });
    });
});
