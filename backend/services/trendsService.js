const googleTrends = require("google-trends-api");

async function getTrends(name) {
  const results = await googleTrends.interestOverTime({
    keyword: name,
    startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  });

  const parsed = JSON.parse(results);

  return parsed.default.timelineData.map((item) => {
    const raw = item.formattedTime;

    // Extract first date before dash
    const firstPart = raw.split("–")[0].trim();
    // Example: "Mar 16"

    const year = raw.match(/\d{4}/)?.[0];
    // Example: "2025"

    const dateObj = new Date(`${firstPart} ${year}`);

    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    return {
      date: formattedDate,
      value: item.value[0],
    };
  });
}

module.exports = { getTrends };
