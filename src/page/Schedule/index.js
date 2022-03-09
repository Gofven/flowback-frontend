import { useEffect, useState } from "react";
import "./index.css";
import Layout1 from "../../layout/Layout1";
import getHomePolls from "./getPolls";
import Loader from "../../component/common/Loader";

export default function Schedule() {
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
  var startYear = 2020;
  var endYear = 2030;
  const [month, setMonth] = useState(0);
  var year = 0;
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  function loadCalendarMonths() {
    for (var i = 0; i < months.length; i++) {
      var doc = document.createElement("div");
      doc.innerHTML = months[i];
      doc.classList.add("dropdown-item");

      doc.onclick = (function () {
        var selectedMonth = i;
        return function () {
          setMonth(selectedMonth);
          // document.getElementById("curMonth").innerHTML = months[month];
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

      polls.forEach((poll) => {
        const pollDate = new Date(poll.top_proposal.date);
        if (pollDate.getDate() === tmp && pollDate.getMonth() === month) {
          d.classList.add("poll");
          const pollTime = document.createElement("div");
          const minutes =
            pollDate.getMinutes() < 10
              ? `${pollDate.getMinutes()}0`
              : pollDate.getMinutes(); //Otherwise we get single digits such as 23:0 instead of 23:00
          pollTime.innerHTML = `${poll.title}${pollDate.getHours()}:${minutes}`;
          d.appendChild(pollTime);
        }
      });
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

    if (document.getElementById("months").children.length === 0)
      loadCalendarMonths();
    loadCalendarYears();
    loadCalendarDays();

    // if ((polls.length === 0)) {
      setLoading(true)
      getHomePolls().then((homePolls) => {
        setPolls(homePolls);
        setLoading(false)
    });
    // }
  }, []);

  useEffect(() => {
    setLoading(true)
    getHomePolls().then((homePolls) => {
      setPolls(homePolls);
      loadCalendarDays();
      setLoading(false)
    });
    console.log("HI");
  }, [month]);

  const handleSelectMonth = () => {
    const months = document.getElementById("months");
    months.style.display === "none"
      ? (months.style.display = "inherit")
      : (months.style.display = "none");
  };

  const handleSelectYear = () => {
    const months = document.getElementById("years");
    months.style.display === "none"
      ? (months.style.display = "inherit")
      : (months.style.display = "none");
  };

  return (
    <Layout1>
      <Loader loading={loading}>
        <div class="calendar noSelect" id="calendar">
          <div class="calendar-btn month-btn" onClick={handleSelectMonth}>
            <div id="curMonth">{months[month]}</div>
            <div
              id="months"
              class="months dropdown"
              style={{ display: "none" }}
            ></div>
          </div>

          <div class="calendar-btn year-btn " onClick={handleSelectYear}>
            <span id="curYear"></span>
            <div
              id="years"
              class="years dropdown"
              style={{ display: "none" }}
            ></div>
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
      </Loader>
    </Layout1>
  );
}
