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
    const monthPolls = polls.filter(poll => new Date(poll.top_proposal.date).getMonth() === month && new Date(poll.top_proposal.date).getFullYear() === year)
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
          </div>
        })}
      </div>
    );
  }

  const handleClickingDate = (dayPolls, day) => {
    setDay(day)
    setPollList(dayPolls)
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

  const handleSelect = (time) => {
    const months = document.getElementById(time);
    months.style.display === 'none'
      ? (months.style.display = 'inherit')
      : (months.style.display = 'none');
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.id));
  };

  const handleYearChange = (e) => {
    setYear(startYear + parseInt(e.target.id));
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

            <div className="day-poll-list">
              <h1>Polls for {day}/{month}/{year}</h1>
              {pollList.length > 0 && pollList.map(poll => {
                const pollDate = new Date(Date.parse(poll.top_proposal.date))
                const minutes =
                  pollDate.getMinutes() < 10
                    ? `0${pollDate.getMinutes()}`
                    : pollDate.getMinutes();

                return <div>
                  <div><a href={`${window.location.origin}/groupdetails/${poll.group.id}/polldetails/${poll.id}`}>
                    {poll.title}</a></div>
                  <div><a href={`${window.location.origin}/groupdetails/${poll.group.id}`}>
                    {poll.group.title === "" ? "No group name" : poll.group.title}</a></div>
                  <div>{`${pollDate.getHours()}:${minutes}`}</div>
                  <div></div>
                </div>
              })}
            </div>
          </div>
        </div>
      </Loader>
    </Layout1 >
  );
}
