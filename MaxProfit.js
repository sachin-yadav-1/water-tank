const buildings = {
  theatre: { buildTime: 5, earning: 1500 },
  pub: { buildTime: 4, earning: 1000 },
  commercialPark: { buildTime: 10, earning: 3000 },
};

function calculateProfitOptimized(counts, timeUnits) {
  const buildingTypes = [
    { count: counts.theatres, ...buildings.theatre },
    { count: counts.pubs, ...buildings.pub },
    { count: counts.commercialParks, ...buildings.commercialPark },
  ];

  buildingTypes.sort(
    (a, b) => b.earning / b.buildTime - a.earning / a.buildTime
  );

  let currentTime = 0;
  let totalProfit = 0;

  for (const buildingType of buildingTypes) {
    for (let i = 0; i < buildingType.count; i++) {
      currentTime += buildingType.buildTime;

      if (currentTime > timeUnits) {
        return 0;
      }

      const operatingTime = timeUnits - currentTime;

      if (operatingTime === 0) {
        return -1;
      }

      totalProfit += buildingType.earning * operatingTime;
    }
  }

  return totalProfit;
}

function maxProfitOptimized(timeUnits) {
  let maxProfit = 0;
  let solutions = [];

  const maxTheatres = Math.floor(timeUnits / buildings.theatre.buildTime);
  const maxPubs = Math.floor(timeUnits / buildings.pub.buildTime);
  const maxCommercialParks = Math.floor(
    timeUnits / buildings.commercialPark.buildTime
  );

  for (let t = 0; t <= maxTheatres; t++) {
    for (let p = 0; p <= maxPubs; p++) {
      for (let c = 0; c <= maxCommercialParks; c++) {
        if (t === 0 && p === 0 && c === 0) continue;

        const counts = { theatres: t, pubs: p, commercialParks: c };
        const profit = calculateProfitOptimized(counts, timeUnits);

        if (profit === -1) continue;

        if (profit > maxProfit) {
          maxProfit = profit;
          solutions = [counts];
        } else if (profit === maxProfit && profit > 0) {
          const exists = solutions.some(
            (sol) =>
              sol.theatres === t && sol.pubs === p && sol.commercialParks === c
          );
          if (!exists) {
            solutions.push(counts);
          }
        }
      }
    }
  }

  const outputs = solutions.map(
    (combo) =>
      `T: ${combo.theatres} P: ${combo.pubs} C: ${combo.commercialParks}`
  );

  return { maxProfit, outputs };
}

console.log("49 ==>", maxProfitOptimized(49));
console.log("7 ==>", maxProfitOptimized(7));
console.log("8 ==>", maxProfitOptimized(8));
console.log("13 ==>", maxProfitOptimized(13));
