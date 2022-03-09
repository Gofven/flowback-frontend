import { useEffect, useState } from "react";
import "./index.css";
import Layout1 from "../../layout/Layout1";

export default function Schedule() {

    const [month, setMonth] = useState(0);

  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var startYear = 2000;
  var endYear = 2025;
//   var month = 0;
  var year = 0;

  function loadCalendarMonths() {
    for (var i = 0; i < months.length; i++) {
      var doc = document.createElement("div");
      doc.innerHTML = months[i];
      doc.classList.add("dropdown-item");

      doc.onclick = (function () {
        var selectedMonth = i;
        return function () {
          setMonth(selectedMonth);
        //   document.getElementById("curMonth").innerHTML = months[month];
          loadCalendarDays();
          return month;
        };
      })();

      document.getElementById("months").appendChild(doc);
    }
  }

  function loadCalendarYears() {
    document.getElementById("years").innerHTML = "";

    for (var i = startYear; i <= endYear; i++) {
      var doc = document.createElement("div");
      doc.innerHTML = i;
      doc.classList.add("dropdown-item");

      doc.onclick = (function () {
        var selectedYear = i;
        return function () {
          year = selectedYear;
          document.getElementById("curYear").innerHTML = year;
          loadCalendarDays();
          return year;
        };
      })();

      document.getElementById("years").appendChild(doc);
    }
  }

  function loadCalendarDays() {
    document.getElementById("calendarDays").innerHTML = "";

    var tmpDate = new Date(year, month, 0);
    var num = daysInMonth(month, year);
    var dayofweek = tmpDate.getDay(); // find where to start calendar day of week

    for (var i = 0; i <= dayofweek; i++) {
      var d = document.createElement("div");
      d.classList.add("day");
      d.classList.add("blank");
      document.getElementById("calendarDays").appendChild(d);
    }

    for (var i = 0; i < num; i++) {
      var tmp = i + 1;
      var d = document.createElement("div");
      d.id = "calendarday_" + i;
      d.className = "day";
      d.innerHTML = tmp;

      document.getElementById("calendarDays").appendChild(d);
    }

    var clear = document.createElement("div");
    clear.className = "clear";
    document.getElementById("calendarDays").appendChild(clear);
  }

  function daysInMonth(month, year) {
    var d = new Date(year, month + 1, 0);
    return d.getDate();
  }

  useEffect(() => {
    var date = new Date();
    setMonth(date.getMonth());
    year = date.getFullYear();
    // document.getElementById("curMonth").innerHTML = months[month];
    document.getElementById("curYear").innerHTML = year;
    loadCalendarMonths();
    loadCalendarYears();
    loadCalendarDays();
  });

  const handleMonthChange = () => {
    setMonth(month+1)
  }

  return (
    <Layout1>
      <div class="calendar" id="calendar">
        <div
          class="btn btn-primary"
        //   onclick="$('#months').toggle('fast')"
        >
          <span>{months[month]}</span>
          <div id="months" class="months dropdown"></div>
        </div>
            <button className="btn btn-primary" onClick={handleMonthChange}>{">>"}</button>

        <div class="calendar-btn year-btn" onclick="$('#years').toggle('fast')">
          <span id="curYear"></span>
          <div id="years" class="years dropdown"></div>
        </div>

        <div class="clear"></div>

        <div class="calendar-dates">
          <div class="days">
            <div class="day label">SUN</div>
            <div class="day label">MON</div>
            <div class="day label">TUE</div>
            <div class="day label">WED</div>
            <div class="day label">THUR</div>
            <div class="day label">FRI</div>
            <div class="day label">SAT</div>

            <div class="clear"></div>
          </div>

          <div id="calendarDays" class="days"></div>
        </div>
      </div>
    </Layout1>
  );
}
