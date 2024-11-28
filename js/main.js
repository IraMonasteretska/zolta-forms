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
    
        // if (!isValidHours || !isValidMinutes || !isValidSeconds) {
        //     block.classList.add('invalid-time');
        // } else {
        //     block.classList.remove('invalid-time');
        // }
    }
    






})

// form parcing ---- //
document.getElementById('generateJson').addEventListener('click', () => {
    const form = document.querySelector('form'); // Вибір форми
    const formName = form.getAttribute('data-form-name') || 'unknown_form'; // Отримання імені форми
    const jsonData = { form_name: formName }; // Початкові дані з назвою форми

    // Функція для збору даних з полів вводу
    const getInputData = (inputs) => {
        const values = Array.from(inputs)
            .filter(input => input.type !== 'checkbox' || input.checked) // Пропустити невибрані чекбокси
            .map(input => input.value.trim()) // Зібрати значення
            .filter(value => value !== ''); // Пропустити порожні значення
        return values.join(''); // Об'єднати значення у рядок
    };

    // Функція для парсингу секцій форми
    const parseSection = (section) => {
        const sectionData = {};
        const inputGroups = {};

        // Зібрати всі поля з name
        const inputs = section.querySelectorAll('input[name], textarea[name], select[name]');
        inputs.forEach((input) => {
            if (!input.name) return; // Пропустити поля без name

            // Якщо name повторюється, додаємо до групи
            if (!inputGroups[input.name]) {
                inputGroups[input.name] = [];
            }
            inputGroups[input.name].push(input);
        });

        // Обробити всі групи input
        for (const name in inputGroups) {
            const value = getInputData(inputGroups[name]); // Зібрати значення як один рядок
            if (value) {
                sectionData[name] = value; // Додати тільки, якщо є значення
            }
        }

        return sectionData;
    };

    // Парсинг даних із кожної секції форми
    const sections = form.querySelectorAll('.border-section, .tablesection');
    sections.forEach((section) => {
        const sectionTitle = section.querySelector('.formsect-title')?.innerText.trim() || 'Unnamed Section';
        const sectionData = parseSection(section);
        if (Object.keys(sectionData).length > 0) { // Додати секцію тільки, якщо є дані
            jsonData[sectionTitle] = sectionData;
        }
    });

    // Відображення JSON на сторінці
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.textContent = JSON.stringify(jsonData, null, 2);

    // Відправка JSON на сервер
    fetch('save-json.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
        .then(response => response.text())
        .then(data => {
            console.log('Server Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
