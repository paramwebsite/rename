import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatMonth(value) {
  // value is like "16/03/25"
  const parts = value.split("/");
  const monthNumber = parts[1];
  const yearNumber = parts[2];

  const monthNames = [
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

  return `${monthNames[parseInt(monthNumber, 10) - 1]} ${yearNumber}`;
}

export default function TrendChart({ data }) {
  return (
    <div>
      <h2 className="text-6xl pl-8 mb-3 ">trend-analysis.log</h2>
      <div className="h-60 ">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              stroke="#E6FF00"
              tick={{ fontSize: 16 }}
              interval="preserveStartEnd"
              tickFormatter={(value, index) => {

                
                const total = data.length;
                
                if (total === 0) return "";
                
                // Always show first & last
                if (index === 0 || index === total - 1) {
                    console.log(formatMonth(value))
                    return formatMonth(value);
                }

                
                // Decide how many middle ticks you want
                const middleTicks = 5; // change to 4 if you want more
                const step = Math.floor(total / (middleTicks + 1));
                
                if (step > 0 && index % step === 0) {
                  return formatMonth(value);
                }
                
                // return formatMonth(value);
                return "";
              }}
            />

            <YAxis stroke="#E6FF00" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                border: "1px solid #E6FF00",
                color: "#E6FF00",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#E6FF00"
              strokeWidth={2}
              dot={false }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
