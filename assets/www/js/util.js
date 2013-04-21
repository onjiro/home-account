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
        $('.js-tab a').click(function(e) {
            e.preventDefault();
            $(this).tab('show');
        }).on('show', function(e) {
            $($(this).attr('href')).trigger('show', e);
        });

        // タブ押下時に入力内容を引き継ぐ
        $('.js-tab a').on('show', function(e) {
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
