import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const useStyles = makeStyles((theme) => ({
  calendarContainer: {
    padding: "20px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor:
      "linear-gradient(241.25deg, rgba(222, 231, 255, 0.225) 4.4%, rgba(231, 238, 255, 0.325) 61.77%, rgba(243, 255, 255, 0.27) 119.94%),linear- gradient(0deg, #FFFFFF, #FFFFFF);",
    borderRadius: "10px",
    border: "2px solid rgba(255, 255, 255, 1)  ",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "20px",
    marginBottom: "30px",
  },
  day: {
    backgroundColor: "rgba(255, 253, 255, 1)",
    borderRadius: "10px",
  },
  events: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",

  },
  eventHeader: {
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "Inter",
    marginBottom: "10px",
    lineHeight: "18.15px",
  },
  button: {
    cursor: "pointer",
  },
  prevNextButton: {
    backgroundColor: "rgba(250, 72, 168, 1)",
    borderRadius: "10px",
    width: "30px",
    height: "30px",
    border: "none",
    fontSize: "15px",

    color: "#fff",
  },
}));

const EventCalendar = () => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({
    "2/2/2024": [
      {
        title: "Event 1",
        description: "This is the first event of the day",
        time: "10:00 AM - 11:00 AM",
      },
      {
        title: "Event 2",
        description: "This is the second event of the day",
        time: "11:00 AM - 12:00 PM",
      },
    ],
    "2/5/2024": [
      {
        title: "Event 3",
        description: "This is the third event of the day",
        time: "10:00 AM - 11:00 AM",
      },
    ],
    "2/7/2024": [
      {
        title: "Event 4",
        description: "This is the fourth event of the day",
        time: "10:00 AM - 11:00 AM",

      }, {

        title: "Event 5",
        description: "This is the fifth event of the day",
        time: "11:00 AM - 12:00 PM",

      }, {
        title: "Event 6",
        description: "This is the sixth event of the day",
        time: "12:00 PM - 01:00 PM",
      }
    ]
  });

  const generateCalendar = () => {
    const days = [];
    const totalDays = 10; // Adjust as needed
    const middleIndex = Math.floor(totalDays / 2);

    for (let i = -middleIndex; i < totalDays - middleIndex; i++) {
      const currentDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + i
      );
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        timeZone: 'Asia/Kolkata'
      });
      console.log("formattedDate", formattedDate)
      console.log("currentDate", currentDate)
      const dayStyles = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "56px",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "10px",
        border: "1px solid rgba(185, 185, 185, 1)",
        padding: "5px",
        fontSize: "12px",
        fontWeight: "600",
        fontFamily: "Inter",
        color: "rgba(61, 61, 61, 1)",
        ...(currentDate.getDate() === selectedDate.getDate()
          ? {
            backgroundColor: "blue",
            color: "#fff",
          }
          : {}),
        ...(isToday(currentDate)
          ? {
            backgroundColor: "rgba(241, 62, 160, 1)",
            color: "#fff",
          }
          : {}),
      };

      const hasEvents = events[formattedDate] && events[formattedDate].length > 0;


      days.push(
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            alignItems: "center",
          }}
          key={formattedDate}
        >
          <div
            style={dayStyles}
            onClick={() => setSelectedDate(currentDate)}
          >
            {`${currentDate.getDate()} ${currentDate.toLocaleString("en-US", {
              weekday: "short",
            })}`}
          </div>

          {hasEvents && (
            <div
              style={{
                backgroundColor: "red",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                marginTop: "1px",
              }}
            />
          )}
        </div>
      );
    }

    return days;
  };





  // const handlePrevDay = () => {
  //   const newDate = new Date(selectedDate);
  //   newDate.setDate(selectedDate.getDate() - 1);
  //   setSelectedDate(newDate);
  // };

  // const handleNextDay = () => {
  //   const newDate = new Date(selectedDate);
  //   newDate.setDate(selectedDate.getDate() + 1);
  //   setSelectedDate(newDate);
  // };

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(newDate);
  };


  const displayEvents = () => {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata'
    });
    console.log(formattedDate)
    const dayEvents = events[formattedDate] || [];

    if (dayEvents.length === 0) return <div style={{
      fontSize: "14px",
      fontWeight: "400",
      fontFamily: "Inter",
    }}>No events</div>

    return dayEvents.map((event, index) => (
      <div key={index} className="event" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "400",
        fontFamily: "Inter",
      }}>
        {event.title}
        {event.description && <div>{event.description}</div>}
        {event.time && <div>{event.time}</div>}
        <MoreHorizIcon />
      </div>
    ));
  };


  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className={classes.calendarContainer}>
      <div className={classes.header}>
        <button
          className={`${classes.button} ${classes.prevNextButton}`}
          onClick={handlePrevMonth}
          style={{
            transition: "all 0.3s ease",
          }}
        >
          {"<"}
        </button>
        <div
          className=""
          style={{
            fontSize: "20px",
            fontWeight: "600",
            fontFamily: "Inter",
          }}
        >
          {selectedDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          className={`${classes.button} ${classes.prevNextButton}`}
          onClick={handleNextMonth}
          style={{
            transition: "all 0.3s ease",

          }}
        >
          {">"}
        </button>
      </div>
      <div
        className={classes.days}
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginBottom: "10px",


        }}
      >
        {/* <button className={`${classes.button} ${classes.prevNextButton}`} onClick={handlePrevDay}>
          {'<'}
        </button> */}
        {generateCalendar()}
        {/* <button className={`${classes.button} ${classes.prevNextButton}`} onClick={handleNextDay}>
          {'>'}
        </button> */}
      </div>
      <div className={classes.events}>
        <div className={classes.eventHeader}>
          Upcoming Visits {selectedDate.toLocaleDateString()}
        </div>
        {displayEvents()}
      </div>
    </div>
  );
};

export default EventCalendar;
