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

                if (block.classList.contains('h24')) {
                    validate24HourTime(block);
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && input.value === '' && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    });

    function validate24HourTime(block) {
        const inputs = block.querySelectorAll('.number_input');
        const isHoursAndMinutesOnly = inputs.length === 4;
    
        const hours = `${inputs[0].value || '0'}${inputs[1].value || '0'}`;
        const minutes = `${inputs[2].value || '0'}${inputs[3].value || '0'}`;
        let isValidSeconds = true;
    
        if (!isHoursAndMinutesOnly) {
            const seconds = `${inputs[4]?.value || '0'}${inputs[5]?.value || '0'}`;
            isValidSeconds = parseInt(seconds, 10) >= 0 && parseInt(seconds, 10) <= 59;
        }
    
        const isValidHours = parseInt(hours, 10) >= 0 && parseInt(hours, 10) <= 23;
        const isValidMinutes = parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) <= 59;
    
        if (!isValidHours || !isValidMinutes || !isValidSeconds) {
            block.classList.add('invalid-time');
        } else {
            block.classList.remove('invalid-time');
        }
    }
    





})