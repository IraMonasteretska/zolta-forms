$(document).ready(function () {
    //   Date
    if ($('.datepicker').length) {
        $(function () {
            $(".datepicker").datepicker({
                dateFormat: 'mm/dd/yy'
            });
        });

        $('.datepicker').on('input', function () {
            const input = $(this);
            let value = input.val().replace(/[^0-9]/g, '');

            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            if (value.length > 5) {
                value = value.slice(0, 5) + '/' + value.slice(5);
            }
            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            input.val(value);
        });

        $('.datepicker').on('keypress', function (e) {
            if ($(this).val().length >= 10 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
        });
    }

    // Time
    document.querySelectorAll('.dateinputs').forEach(block => {
        const inputs = block.querySelectorAll('.number_input');

        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);

                if (input.value && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && input.value === '' && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    });





})