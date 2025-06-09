const buildings = {
  theatre: { buildTime: 5, earning: 1500, name: "Theatre", code: "T" },
  pub: { buildTime: 4, earning: 1000, name: "Pub", code: "P" },
  commercialPark: {
    buildTime: 10,
    earning: 3000,
    name: "Commercial Park",
    code: "C",
  },
};

function calculateProfit(buildingOrder, timeUnits) {
  let currentTime = 0;
  let totalProfit = 0;

  for (const building of buildingOrder) {
    currentTime += building.buildTime;
    if (currentTime > timeUnits) {
      return 0;
    }

    const operatingTime = timeUnits - currentTime;
    totalProfit += building.earning * operatingTime;
  }

  return totalProfit;
}

function generateAllPermutations(buildings, counts) {
  const buildingList = [];

  for (let i = 0; i < counts.theatres; i++) {
    buildingList.push(buildings.theatre);
  }
  for (let i = 0; i < counts.pubs; i++) {
    buildingList.push(buildings.pub);
  }
  for (let i = 0; i < counts.commercialParks; i++) {
    buildingList.push(buildings.commercialPark);
  }

  const permutations = [];

  function permute(arr, current = []) {
    if (arr.length === 0) {
      permutations.push([...current]);
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
      permute(remaining, [...current, arr[i]]);
    }
  }

  if (buildingList.length > 0) {
    permute(buildingList);
  } else {
    permutations.push([]);
  }

  return permutations;
}

function maxProfit(timeUnits) {
  let bestProfit = 0;
  let bestSolutions = [];

  const maxTheatres = Math.floor(timeUnits / buildings.theatre.buildTime);
  const maxPubs = Math.floor(timeUnits / buildings.pub.buildTime);
  const maxCommercialParks = Math.floor(
    timeUnits / buildings.commercialPark.buildTime
  );

  for (let t = 0; t <= maxTheatres; t++) {
    for (let p = 0; p <= maxPubs; p++) {
      for (let c = 0; c <= maxCommercialParks; c++) {
        const counts = { theatres: t, pubs: p, commercialParks: c };

        if (t === 0 && p === 0 && c === 0) continue;

        const permutations = generateAllPermutations(buildings, counts);

        for (const order of permutations) {
          const profit = calculateProfit(order, timeUnits);

          if (profit > bestProfit) {
            bestProfit = profit;
            bestSolutions = [counts];
          } else if (profit === bestProfit && profit > 0) {
            const exists = bestSolutions.some(
              (sol) =>
                sol.theatres === t &&
                sol.pubs === p &&
                sol.commercialParks === c
            );
            if (!exists) {
              bestSolutions.push(counts);
            }
          }
        }
      }
    }
  }

  const outputs = bestSolutions.map(
    (combo) =>
      `T: ${combo.theatres} P: ${combo.pubs} C: ${combo.commercialParks}`
  );

  return {
    profit: bestProfit,
    outputs: outputs,
  };
}
