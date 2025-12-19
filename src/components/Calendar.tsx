import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getEvents, createEvent, CalendarEvent } from "../lib/api";
import { EventModal } from "./EventModal";
import { clsx } from "clsx";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const fetchEvents = async () => {
      // Fetch events for the visible range
      // Using RFC3339/ISO strings
      try {
        const startStr = calendarStart.toISOString();
        const endStr = calendarEnd.toISOString();
        const fetched = await getEvents(startStr, endStr);
        setEvents(fetched);
      } catch (e) {
          console.error("Failed to fetch events", e);
      }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
      setSelectedDate(day);
      setIsModalOpen(true);
  };

  const handleCreateEvent = async (title: string, description: string, start: string, end: string) => {
      try {
          await createEvent(title, description || "", start, end);
          fetchEvents();
      } catch (e) {
          console.error(e);
      }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h1>
            <div className="flex space-x-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
        <button 
            onClick={() => { setSelectedDate(new Date()); setIsModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
            <Plus size={20} className="mr-2" />
            Create
        </button>
      </header>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="p-2 text-center text-sm font-semibold text-gray-500 uppercase">
                  {d}
              </div>
          ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
          {days.map((day, idx) => {
              const dayEvents = events.filter(e => {
                  try {
                      // Simple date match on start time string (assuming ISO)
                      const eDate = parseISO(e.start_time);
                      return isSameDay(eDate, day);
                  } catch { return false; }
              });

              return (
                  <div 
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={clsx(
                        "border-b border-r border-gray-200 dark:border-gray-800 p-2 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800/50 min-h-[100px]",
                        !isSameMonth(day, currentDate) && "bg-gray-50 dark:bg-gray-900/50 text-gray-400",
                        isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                      <div className={clsx(
                          "w-7 h-7 flex items-center justify-center rounded-full text-sm",
                          isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300"
                      )}>
                          {format(day, "d")}
                      </div>
                      <div className="mt-1 space-y-1">
                          {dayEvents.map(ev => (
                              <div key={ev.id} className="text-xs p-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded truncate">
                                  {ev.time_str /* calculate time from ev.start_time? */} 
                                  {ev.title}
                              </div>
                          ))}
                      </div>
                  </div>
              );
          })}
      </div>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateEvent}
        initialDate={selectedDate}
      />
    </div>
  );
}
