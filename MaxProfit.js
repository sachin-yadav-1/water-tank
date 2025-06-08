const buildings = {
  theatre: { buildTime: 5, earning: 1500 },
  pub: { buildTime: 4, earning: 1000 },
  commercialPark: { buildTime: 10, earning: 3000 },
};

function maxProfit(timeUnits) {
  let bestProfit = 0;
  let allSolutions = [];

  const maxTheatres = Math.floor(timeUnits / buildings.theatre.buildTime);
  const maxPubs = Math.floor(timeUnits / buildings.pub.buildTime);
  const maxCommercialParks = Math.floor(
    timeUnits / buildings.commercialPark.buildTime
  );

  for (let t = 0; t <= maxTheatres; t++) {
    for (let p = 0; p <= maxPubs; p++) {
      for (let c = 0; c <= maxCommercialParks; c++) {
        const totalBuildTime =
          t * buildings.theatre.buildTime +
          p * buildings.pub.buildTime +
          c * buildings.commercialPark.buildTime;

        if (totalBuildTime > timeUnits) {
          continue;
        }

        let profit = 0;

        if (t > 0) {
          const theatreOperatingTime =
            timeUnits - t * buildings.theatre.buildTime;
          profit += t * buildings.theatre.earning * theatreOperatingTime;
        }

        if (p > 0) {
          const pubStartTime =
            t * buildings.theatre.buildTime + p * buildings.pub.buildTime;
          const pubOperatingTime = timeUnits - pubStartTime;
          profit += p * buildings.pub.earning * pubOperatingTime;
        }

        if (c > 0) {
          const commercialStartTime = totalBuildTime;
          const commercialOperatingTime = timeUnits - commercialStartTime;
          profit +=
            c * buildings.commercialPark.earning * commercialOperatingTime;
        }

        if (profit > bestProfit) {
          bestProfit = profit;
          allSolutions = [{ theatres: t, pubs: p, commercialParks: c }];
        } else if (profit === bestProfit && profit > 0) {
          allSolutions.push({
            theatres: t,
            pubs: p,
            commercialParks: c,
          });
        }
      }
    }
  }

  const outputs = allSolutions.map(
    (combo) =>
      `T: ${combo.theatres} P: ${combo.pubs} C: ${combo.commercialParks}`
  );

  return {
    profit: bestProfit,
    outputs,
  };
}

const result = maxProfit(7);
console.log(`Max Profit: ${result.profit}`);
console.log("Solutions:");
result.outputs.forEach((output, index) => {
  console.log(`${index + 1}. ${output}`);
});
