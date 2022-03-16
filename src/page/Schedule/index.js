import { useEffect, useState } from "react";
import "./index.css";
import Layout1 from "../../layout/Layout1";
import getHomePolls from "./getPolls";
import Loader from "../../component/common/Loader";
import DayPolls from "./DayPolls.js";

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
  var startYear = new Date().getFullYear() - 2;
  var endYear = new Date().getFullYear() + 5;
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
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
          setYear(selectedYear);
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
        const pollDate = new Date(poll.top_proposal?.date);
        if (
          pollDate.getDate() === tmp &&
          pollDate.getMonth() === month &&
          pollDate.getFullYear() === year
        ) {
          d.classList.add("poll");
          const pollTime = document.createElement("div");
          const minutes =
            pollDate.getMinutes() < 10
              ? `${pollDate.getMinutes()}0`
              : pollDate.getMinutes(); //Otherwise we get single digits such as 23:0 instead of 23:00
          // pollTime.innerHTML = `${poll.title}${pollDate.getHours()}:${minutes}`;
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
    if (document.getElementById("months").children.length === 0)
      loadCalendarMonths();
    loadCalendarYears();

    setLoading(true);
    getHomePolls().then((homePolls) => {
      setPolls(homePolls);
      loadCalendarDays();

      var date = new Date();
      setMonth(date.getMonth());
      setYear(date.getFullYear());
    });
  }, []);

  //I'm sorry for this mess
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);

    getHomePolls().then((homePolls) => {
      setPolls(homePolls);
      loadCalendarDays();
      displayDailyPoll();
    });
  }, [month, year]);

  const displayDailyPoll = () =>{
    for (let index = 0; index < 32; index++) {
      const day = document.getElementById("calendarday_" + index);
      day?.addEventListener("click", () => {
        document.getElementById("day-poll-list")?.remove();
        const dayPollList = document.createElement("div");
        dayPollList.classList.add("day-poll-list");
        dayPollList.id = "day-poll-list";

        //Sorts the polls based on which hour they occurr on
        const sortedByTimePolls = polls.sort(
          (poll2, poll1) =>
            new Date(poll2.top_proposal.date).getMinutes() -
            new Date(poll1.top_proposal.date).getMinutes()
        ).sort(
          (poll2, poll1) =>
            new Date(poll2.top_proposal.date).getHours() -
            new Date(poll1.top_proposal.date).getHours()
        );

        sortedByTimePolls.forEach((poll) => {
          const pollDate = new Date(poll.top_proposal.date);
          if (
            pollDate.getDate() === index + 1 &&
            pollDate.getMonth() === month &&
            pollDate.getFullYear() === year
          ) {
            const pollInList = document.createElement("div");
            pollInList.classList.add("poll-in-list")
            const minutes =
              pollDate.getMinutes() < 10
                ? `0${pollDate.getMinutes()}`
                : pollDate.getMinutes();
            pollInList.innerHTML = `
            <div class="poll-titles"><a href=${window.location.origin}/groupdetails/${poll.group.id}/polldetails/${poll.id}>${poll.title}</a> 
            <div><a href=${window.location.origin}/groupdetails/${poll.group.id}>${poll.group.title}</a></div></div>
            <div class="time">${pollDate.getHours()}:${minutes}</div>`;
            dayPollList.append(pollInList);
          }
        });
        if (dayPollList.children.length > 0) day.append(dayPollList);
      });
    }
  }

  const handleSelectMonth = () => {
    const months = document.getElementById("months");
    months.style.display === "none"
      ? (months.style.display = "inherit")
      : (months.style.display = "none");
  };

  const handleSelectYear = () => {
    const years = document.getElementById("years");
    years.style.display === "none"
      ? (years.style.display = "inherit")
      : (years.style.display = "none");
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
            <div id="curYear">{year}</div>
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
