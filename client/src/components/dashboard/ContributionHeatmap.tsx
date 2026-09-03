import type { FC } from "react";
interface ContributionHeatmapProps {
  dayActivity: number[];
  hourActivity: number[];
}
const ContributionHeatmap: FC<ContributionHeatmapProps> = ({
  dayActivity,
  hourActivity,
}) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [
    "6am",
    "8am",
    "10am",
    "12pm",
    "2pm",
    "4pm",
    "6pm",
    "8pm",
    "10pm",
  ];
  const maxDay = Math.max(...dayActivity, 1);
  const maxHour = Math.max(...hourActivity, 1);
  const heatData = hours.map((_, hi) => {
    const hourIdx = hi * 2 + 6;
    return days.map((_, di) => {
      const dayVal = dayActivity[di] / maxDay;
      const hourVal = (hourActivity[hourIdx] || 0) / maxHour;
      return Math.round(((dayVal + hourVal) / 2) * 4);
    });
  });
  const getColor = (val: number) => {
    return `var(--color-heatmap-${val})`;
  };
  const peakDay = dayActivity.indexOf(Math.max(...dayActivity));
  const totalEvents = dayActivity.reduce((a, b) => a + b, 0);
  return (
    <div>
      {" "}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {" "}
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-matte-azure/10 text-matte-azure">
          {totalEvents} events
        </span>{" "}
        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          {" "}
          Peak:{" "}
          <strong className="text-light-text dark:text-dark-text">
            {days[peakDay]}
          </strong>{" "}
        </span>{" "}
      </div>{" "}
      <div className="overflow-x-auto">
        {" "}
        <div className="min-w-[380px]">
          {" "}
          <div className="flex mb-1.5 ml-12">
            {" "}
            {days.map((d, i) => (
              <div
                key={d}
                className={`flex-1 text-center text-[10px] font-semibold ${i === peakDay ? "text-matte-azure" : "text-light-text-secondary dark:text-dark-text-secondary"}`}
              >
                {d}
              </div>
            ))}{" "}
          </div>{" "}
          {hours.map((hour, hi) => (
            <div key={hour} className="flex items-center gap-1 mb-1">
              {" "}
              <span className="w-10 text-right text-[9px] font-medium pr-1 text-light-text-secondary dark:text-dark-text-secondary">
                {hour}
              </span>{" "}
              {days.map((_, di) => (
                <div
                  key={di}
                  className="flex-1 aspect-2/1 rounded transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: getColor(heatData[hi][di]) }}
                  title={`${hour} ${days[di]}: ${["None", "Low", "Medium", "High", "Peak"][heatData[hi][di]]}`}
                />
              ))}{" "}
            </div>
          ))}{" "}
          <div className="flex items-center gap-1 justify-end mt-3">
            {" "}
            <span className="text-[9px] mr-0.5 text-light-text-secondary dark:text-dark-text-secondary">
              Less
            </span>{" "}
            {[0, 1, 2, 3, 4].map((v) => (
              <div
                key={v}
                className="w-3.5 h-2 rounded-sm"
                style={{ backgroundColor: getColor(v) }}
              />
            ))}{" "}
            <span className="text-[9px] ml-0.5 text-light-text-secondary dark:text-dark-text-secondary">
              More
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default ContributionHeatmap;
