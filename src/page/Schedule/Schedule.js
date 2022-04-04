import { useEffect, useState } from "react";
import "./Schedule.css";
import Layout1 from "../../layout/Layout1";
import getPolls from "./getPolls";
import Loader from "../../component/common/Loader/Loader";
import DayPolls from "./DayPolls.js";

export default function Schedule() {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const days = [
    'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday',
  ];

  const currentDate = new Date();
  const startYear = currentDate.getFullYear() - 2;
  const endYear = currentDate.getFullYear() + 5;
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [day, setDay] = useState(currentDate.getDate());
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pollList, setPollList] = useState([]);

  const YearList = () => {
    let years = [];
    for (let i = 0; i < endYear - startYear; i++) {
      years[i] = (
        <div
          className="dropdown-item"
          key={i}
          id={i}
          onClick={handleYearChange}
        >
          {startYear + i}
        </div>
      );
    }
    return years;
  };

  function CalendarDays() {
    const monthPolls = polls.filter(poll => new Date(poll.top_proposal.date).getMonth() === month)
    console.log(monthPolls)

    const dayofweek = new Date(year, month, 0).getDay();
    let monthDays = [];

    for (let i = dayofweek; i < daysInMonth(month, year) + dayofweek; i++) {
      monthDays[i] = i - dayofweek + 1
    }

    return (
      <div className={`all-calendar-days`}>
        {monthDays.map((day, i) => {
          const dayPolls = monthPolls.filter(poll => new Date(poll.top_proposal.date).getDate() === day)
          return <div key={i} className={`calendar-day-${i % 7 + 1} ${(dayPolls.length !== 0) && "poll"}`} onClick={() => handleClickingDate(dayPolls, day)}>
            <div className="day-number">{day}</div>
            {(dayPolls.length !== 0) && <PollDayList dayPolls={dayPolls} />}
          </div>
        })}
      </div>
    );
  }

  const PollDayList = ({ dayPolls }) => {
    return <div className="day-poll-list" style={{ "visibility": "hidden" }}>{dayPolls.map(poll => (
      <div>{poll.top_proposaldate}</div>
    ))}</div>
  }

  const handleClickingDate = (dayPolls, day) => {
    setDay(day)
    setPollList(dayPolls)
    // document.createElement("div")
    // const pollDayList = e.target.getElementsByClassName("day-poll-list")[0] || (e.target.classList.contains("day-number") && e.target.parentElement.getElementsByClassName("day-poll-list")[0])
    // console.log(pollDayList)
    // if (pollDayList) {
    //   if (pollDayList.style.visibility === "visible") pollDayList.style.visibility = "hidden"
    //   else pollDayList.style.visibility = "visible"
    // }
  }

  function loadCalendarDays() { }
  function loadCalendarDays2() {
    document.getElementById('calendarDays').innerHTML = '';

    var tmpDate = new Date(year, month, 0);
    var num = daysInMonth(month, year);
    var dayofweek = tmpDate.getDay(); // find where to start calendar day of week

    for (var i = 0; i <= dayofweek; i++) {
      var d = document.createElement('div');
      d.classList.add('day');
      d.classList.add('blank');
      document.getElementById('calendarDays').appendChild(d);
    }

    for (var i = 0; i < num; i++) {
      var tmp = i + 1;
      var d = document.createElement('div');
      d.id = 'calendarday_' + i;
      d.className = 'day';
      d.innerHTML = tmp;

      polls.forEach((poll) => {
        const pollDate = new Date(poll.top_proposal?.date);
        if (
          pollDate.getDate() === tmp &&
          pollDate.getMonth() === month &&
          pollDate.getFullYear() === year
        ) {
          d.classList.add('poll');
          const pollTime = document.createElement('div');
          const minutes =
            pollDate.getMinutes() < 10
              ? `${pollDate.getMinutes()}0`
              : pollDate.getMinutes(); //Otherwise we get single digits such as 23:0 instead of 23:00
          // pollTime.innerHTML = `${poll.title}${pollDate.getHours()}:${minutes}`;
          d.appendChild(pollTime);
        }
      });
      document.getElementById('calendarDays').appendChild(d);
    }

    var clear = document.createElement('div');
    clear.className = 'clear';
    document.getElementById('calendarDays').appendChild(clear);
  }

  function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  useEffect(() => {
    setLoading(true);
    getPolls().then((polls) => {
      setLoading(false);
      setPolls(polls);
    })
  }, []);

  useEffect(() => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 4000);


  }, [month, year]);

  //I'm sorry for this mess
  const displayDailyPoll = () => {
    for (let index = 0; index < 32; index++) {
      const day = document.getElementById('calendarday_' + index);
      day?.addEventListener('click', () => {
        document.getElementById('day-poll-list')?.remove();
        const dayPollList = document.createElement('div');
        dayPollList.classList.add('day-poll-list');
        dayPollList.id = 'day-poll-list';

        //Sorts the polls based on which hour they occurr on
        const sortedByTimePolls = polls
          .sort(
            (poll2, poll1) =>
              new Date(poll2.top_proposal.date).getMinutes() -
              new Date(poll1.top_proposal.date).getMinutes()
          )
          .sort(
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
            const pollInList = document.createElement('div');
            pollInList.classList.add('poll-in-list');
            const minutes =
              pollDate.getMinutes() < 10
                ? `0${pollDate.getMinutes()}`
                : pollDate.getMinutes();
            pollInList.innerHTML = `
            <div class="poll-titles"><a href=${window.location.origin
              }/groupdetails/${poll.group.id}/polldetails/${poll.id}>${poll.title
              }</a> 
            <div><a href=${window.location.origin}/groupdetails/${poll.group.id
              }>${poll.group.title}</a></div></div>
            <div class="time">${pollDate.getHours()}:${minutes}</div>`;
            dayPollList.append(pollInList);
          }
        });
        if (dayPollList.children.length > 0) day.append(dayPollList);
      });
    }
  };

  const handleSelect = (time) => {
    const months = document.getElementById(time);
    months.style.display === 'none'
      ? (months.style.display = 'inherit')
      : (months.style.display = 'none');
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.id));
    loadCalendarDays();
  };

  const handleYearChange = (e) => {
    setYear(startYear + parseInt(e.target.id));
    loadCalendarDays();
  };

  return (
    <Layout1>
      <Loader loading={loading}>
        <div className="calendar noSelect" id="calendar">
          <div className="calendar-btn month-btn" onClick={() => handleSelect("months")}>
            <div id="curMonth">{months[month]}</div>
            <div
              id="months"
              className="months dropdown"
            // style={{ display: "none" }}
            >
              {months.map((month, i) => {
                return (
                  <div
                    className="dropdown-item"
                    key={month}
                    id={i}
                    onClick={handleMonthChange}
                  >
                    {window.t(months[i])}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="calendar-btn year-btn " onClick={() => handleSelect("years")}>
            <div id="curYear">{year}</div>
            <div
              id="years"
              className="years dropdown"
              style={{ display: 'none' }}
            >
              {YearList().map((year) => year)}
            </div>
          </div>

          <div className="clear"></div>

          <div className="calendar-dates">
            <div className="all-calendar-days ">
              <div className="calendar-day-1">{window.t("Mon")}</div>
              <div className="calendar-day-2">{window.t("Tue")}</div>
              <div className="calendar-day-3">{window.t("Wed")}</div>
              <div className="calendar-day-4">{window.t("Thu")}</div>
              <div className="calendar-day-5">{window.t("Fri")}</div>
              <div className="calendar-day-6">{window.t("Sat")}</div>
              <div className="calendar-day-7">{window.t("Sun")}</div>

              {/* <div className="clear"></div> */}
            </div>

            <div id="calendarDays" className="days">
              <CalendarDays />
            </div>

            <div classList="day-poll-list">
              <h1>Polls for {day}/{month}/{year}</h1>
              {pollList.length > 0 && pollList.map(poll => {
                const pollDate = new Date(Date.parse(poll.top_proposal.date))
                const minutes =
                  pollDate.getMinutes() < 10
                    ? `0${pollDate.getMinutes()}`
                    : pollDate.getMinutes();

                return <div>
                  <a href={`${window.location.origin}/groupdetails/${poll.group.id}/polldetails/${poll.id}`}>
                    {poll.title || "No title"}</a>
                  <div>{`${pollDate.getHours()}:${minutes}`}</div>
                  <div></div>
                </div>
              })}
            </div>
          </div>
        </div>
      </Loader>
    </Layout1>
  );
}
