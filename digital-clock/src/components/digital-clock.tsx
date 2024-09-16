"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Clock as ClockIcon, AlarmClockIcon, Calendar as CalendarIcon, Globe as GlobeIcon, Sun as SunIcon, Moon as MoonIcon, Edit as EditIcon } from "lucide-react";

const initialTimeZones = [
  { zone: "America/New_York", message: "New York, USA" },
  { zone: "Europe/London", message: "London, UK" },
  { zone: "Asia/Tokyo", message: "Tokyo, Japan" },
  { zone: "Australia/Sydney", message: "Sydney, Australia" },
];

export default function DigitalClock() {
  // State variables
  const [isTime, setIsTime] = useState<Date>(new Date()); // Current time
  const [is24Hours, setIs24Hours] = useState<boolean>(true); // 24-hour or 12-hour format
  const [background, setBackground] = useState<string>("bg-white"); // Background color
  const [timeZones] = useState(initialTimeZones); // List of time zones
  const [alarmTime, setAlarmTime] = useState<number>(0); // Alarm time in seconds
  const [showAlarmModal, setShowAlarmModal] = useState<boolean>(false); // Show or hide alarm modal
  const [activeSection, setActiveSection] = useState<string | null>(null); // Currently active section (alarm, timezone, font)
  const [fontStyle, setFontStyle] = useState<string>("Sans-Serif"); // Font style
  const [fontSize, setFontSize] = useState<number>(64); // Font size

  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Reference for the alarm timeout


  useEffect(() => {
    const interval = setInterval(() => {
      setIsTime(new Date());
      checkAlarm();
    }, 1000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [is24Hours, alarmTime]);

  useEffect(() => {
    return () => {
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current); // Cleanup the alarm timeout when the component unmounts or alarm is reset
      }
    };
  }, []);

  // Time Formatting
  const formattedTime = useMemo(() => {
    if (!isTime) return "";
    const hours = is24Hours
      ? isTime.getHours().toString().padStart(2, "0")
      : (isTime.getHours() % 12 || 12).toString().padStart(2, "0");
    const minutes = isTime.getMinutes().toString().padStart(2, "0");
    const seconds = isTime.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, [isTime, is24Hours]);

  // Date Formatting
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Time for Specific Time Zone
  const getTimeForTimeZone = (timeZone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24Hours,
    }).format(new Date());
  };

  // Alarm Functions
  const setAlarm = () => {
    alert(`Alarm set for ${alarmTime} seconds`);
    setShowAlarmModal(false);

    // Clear any existing alarm timeout
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
    }

    // Set a new alarm timeout
    alarmTimeoutRef.current = setTimeout(() => {
      alert("Alarm ringing!");
    }, alarmTime * 1000);
  };

  const checkAlarm = () => {
    const alarmDate = new Date(new Date().getTime() + alarmTime * 1000);
    if (Math.floor((alarmDate.getTime() - isTime.getTime()) / 1000) <= 0) {
      alert("Alarm ringing!");
      // Reset alarm
      setAlarmTime(0);
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current);
      }
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${background}`}>
      <div className="p-10 shadow-2xl rounded-3xl bg-green-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
        <div className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
          <ClockIcon className="inline-block mr-2" /> Digital Clock
        </div>

        <div
          className="mb-4 text-center"
          style={{
            fontFamily: fontStyle,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          }}
        >
          {formattedTime}
        </div>

        <div className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-6 flex justify-center items-center">
          <CalendarIcon className="mr-2" /> {formatDate(isTime)}
        </div>

        <div className="mt-4 flex items-center justify-center space-x-4">
          <Button
            variant={is24Hours ? "default" : "outline"}
            onClick={() => setIs24Hours(true)}
            className="px-4 py-2 font-bold "
          >
            24-Hour Format
          </Button>
          <Button
            variant={!is24Hours ? "default" : "outline"}
            onClick={() => setIs24Hours(false)}
            className="px-4 py-2 font-bold"
          >
            12-Hour Format
          </Button>
        </div>

        <div className="flex space-x-6 justify-center mb-6 mt-6">
          <Button onClick={() => toggleSection("alarm")} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            <AlarmClockIcon className="w-6 h-6" />
          </Button>
          <Button onClick={() => toggleSection("timezone")} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            <GlobeIcon className="w-6 h-6" />
          </Button>
          <Button onClick={() => setBackground(background === "bg-white" ? "bg-gray-800" : "bg-white")} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            {background === "bg-white" ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </Button>
          <Button onClick={() => toggleSection("font")} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            <EditIcon className="w-6 h-6" />
          </Button>
        </div>

        {activeSection === "alarm" && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-xl">
            <h3 className="font-bold text-lg mb-4">Set Alarm</h3>
            <div className="mb-4">
              <Input
                type="number"
                value={alarmTime}
                onChange={(e) => setAlarmTime(Number(e.target.value))}
                placeholder="Alarm time in seconds"
                className="p-2 bg-gray-200 dark:bg-gray-600 rounded-xl w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
            <Button onClick={setAlarm} className="px-4 py-2 bg-green-500 text-white rounded-lg">
              Set Alarm
            </Button>
            <Button onClick={() => setShowAlarmModal(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                Cancel
              </Button>
          </div>
          </div>
        )}

        {activeSection === "timezone" && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-xl">
            <h3 className="font-bold text-lg mb-4">Time Zones</h3>
            {timeZones.map((zone, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span className="font-medium">{zone.message}</span>
                <span>{getTimeForTimeZone(zone.zone)}</span>
              </div>
            ))}
          </div>
        )}

        {activeSection === "font" && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">Font Customization</h3>
            <div className="flex space-x-4 mb-4">
              <Button
                onClick={() => setFontStyle("Sans-Serif")}
                className={`px-4 py-2 ${fontStyle === "Sans-Serif" ? "bg-green-500 text-white" : "bg-green-200"}`}
              >
                Sans-Serif
              </Button>
              <Button
                onClick={() => setFontStyle("Serif")}
                className={`px-4 py-2 ${fontStyle === "Serif" ? "bg-green-500 text-white" : "bg-green-200"}`}
              >
                Serif
              </Button>
              <Button
                onClick={() => setFontStyle("Monospace")}
                className={`px-4 py-2 ${fontStyle === "Monospace" ? "bg-green-500 text-white" : "bg-green-200"}`}
              >
                Monospace
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setFontSize(32)}
                className={`px-4 py-2 ${fontSize === 32 ? "bg-green-500 text-white" : "bg-green-200"}`}>
                Small
              </Button>
              <Button
                onClick={() => setFontSize(64)}
                className={`px-4 py-2 ${fontSize === 64 ? "bg-green-500 text-white" : "bg-green-200"}`}>
                Medium
              </Button>
              <Button
                onClick={() => setFontSize(128)}
                className={`px-4 py-2 ${fontSize === 128 ? "bg-green-500 text-white" : "bg-green-200"}`}>
                Large
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}