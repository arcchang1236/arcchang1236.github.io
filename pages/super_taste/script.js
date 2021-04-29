$(function(){

    // Cache some selectors
    var clock = $('#clock'),
        alarm = clock.find('.alarm'),
        ampm = clock.find('.ampm');
    // Map digits to their names (this will be an array)
    var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');
    // This object will hold the digit elements
    var digits = {};
    // Positions for the hours, minutes, and seconds
    var positions = [
        'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
    ];
    // Generate the digits with the needed markup,
    // and add them to the clock
    var digit_holder = clock.find('.digits');

    $.each(positions, function(){
        if(this == ':'){
            digit_holder.append('<div class="dots">');
        }
        else{
            var pos = $('<div>');
            for(var i=1; i<8; i++){
                pos.append('<span class="d' + i + '">');
            }
            // Set the digits as key:value pairs in the digits object
            digits[this] = pos;
            // Add the digit elements to the page
            digit_holder.append(pos);
        }
    });

    // Add the weekday names
    var weekday_names = 'MON TUE WED THU FRI SAT SUN'.split(' '),
        weekday_holder = clock.find('.weekdays');

    $.each(weekday_names, function(){
        weekday_holder.append('<span>' + this + '</span>');
    });

    var weekdays = clock.find('.weekdays span');

    // Run a timer every second and update the clock
    (function update_time(){
        // Use moment.js to output the current time as a string
        // hh is for the hours in 12-hour format,
        // mm - minutes, ss-seconds (all with leading zeroes),
        // d is for day of week and A is for AM/PM
        var now = moment().format("hhmmssdA");
        digits.h1.attr('class', digit_to_name[now[0]]);
        digits.h2.attr('class', digit_to_name[now[1]]);
        digits.m1.attr('class', digit_to_name[now[2]]);
        digits.m2.attr('class', digit_to_name[now[3]]);
        digits.s1.attr('class', digit_to_name[now[4]]);
        digits.s2.attr('class', digit_to_name[now[5]]);
        // The library returns Sunday as the first day of the week.
        // Stupid, I know. Lets shift all the days one position down, 
        // and make Sunday last
        var dow = now[6];
        dow--;
        // Sunday!
        if(dow < 0){
            // Make it last
            dow = 6;
        }
        // Mark the active day of the week
        weekdays.removeClass('active').eq(dow).addClass('active');
        // Set the am/pm text:
        ampm.text(now[7]+now[8]);
        // Schedule this function to be run again in 1 sec
        setTimeout(update_time, 1000);
    })();

    var now_hr, now_mm;
    var start_flag = 0;
    $('a.btn_start').click(function(){
        now_hr = moment().format("hh");
        now_mm = moment().format("mm");
        start_flag = 1;
    });

    // Switch the theme
    $('a.btn_ad_start').click(function(){
        clock.toggleClass('light dark');
    });

    function padLeadingZeros(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    $('a.btn_enter').click(function(){
        if(start_flag==0){
            alert('先按開始工作~')
        } else{
            var table = document.getElementById("myTable");
            var length = table.rows.length;
            // Create an empty <tr> element and add it to the 1st position of the table:
            var row = table.insertRow(length);
            // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            // Text
            console.log(now_mm, now_hr)
            cell1.innerHTML = now_hr + ':' + now_mm;
            cell2.innerHTML = document.getElementById('input-text-id').value;
            // Change Time
            now_hr = parseInt((parseInt(now_mm)+1) / 60) + parseInt(now_hr);
            now_mm = (parseInt(now_mm)+1) % 60;
            now_hr = (now_hr+'').padStart(2, '0');
            now_mm = (now_mm+'').padStart(2, '0');
            // Btn
            var btn_edit = document.createElement('a');
            btn_edit.setAttribute('class', 'button btn_edit');
            btn_edit.setAttribute('id', length);
            btn_edit.innerHTML = "編輯";
            cell3.appendChild(btn_edit);
            // input text 送出後清空
            document.getElementById('input-text-id').value = '';

            // var allButtons = document.querySelectorAll('a.btn_edit');
            // console.log(allButtons.length)
        }
    });

    $('.logs-holder').on('click', 'a.btn_edit', function(){
        var num = $(this).attr('id');
        var table = document.getElementById("myTable");
        var row = table.getElementsByTagName('tr')[num];
        var cell = row.getElementsByTagName('td')[1];
        var text = cell.innerHTML;
        cell.innerHTML = '';
        var input_now = document.createElement('input');
        input_now.value = text;
        cell.appendChild(input_now);
        $(this).html('完成')
        $(this).attr('class', 'button btn_ok')
    });
    
    $('.logs-holder').on('click', 'a.btn_ok', function(){
        var num = $(this).attr('id');
        var table = document.getElementById("myTable");
        var row = table.getElementsByTagName('tr')[num];
        var cell = row.getElementsByTagName('td')[1];
        var text = cell.childNodes[0].value;
        cell.removeChild(cell.childNodes[0])
        cell.innerHTML = text
        $(this).html('編輯')
        $(this).attr('class', 'button btn_edit')
    });

    $('a.btn_copy').click(function(){
        var table = document.getElementById("myTable");
        var length = table.rows.length;
        var final_str = '';
        for (var i = length-1; i >= 1; i--){
            var x = table.rows[i].cells[1].innerHTML;
            final_str = final_str.concat(x)
            final_str = final_str.concat('\n')
        }
        const el = document.createElement('textarea');
        el.value = final_str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('文字複製好囉~')
    });
});
