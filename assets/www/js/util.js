define(['jquery', 'jquery-ui'], function() {
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
});
