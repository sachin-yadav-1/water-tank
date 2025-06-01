const svgContainer = document.getElementById("svg-container");
const heightInput = document.getElementById("height-input");
const inputForm = document.getElementById("ip-form");
const maxWaterP = document.getElementById("max-water");

let height = [];
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();

  height = heightInput.value
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !isNaN(n));

  svgContainer.innerHTML = "";
  renderVisual(height);
});

const ROOT_HEIGHT = 500;
const BAR_WIDTH = 50;
const BAR_UNIT_HEIGHT = 50;
const calcBarRenderedHeight = (val) => val * BAR_UNIT_HEIGHT;

function maxWaterData(height) {
  let maxWater = 0;
  let waterIndices = {};

  if (height.length <= 1) {
    return maxWater;
  }

  for (let i = 0; i < height.length; i++) {
    let leftMax = height[i];
    let rightMax = height[i];
    let L = 0;
    let R = 0;

    for (let j = 0; j < i; j++) {
      if (height[j] > leftMax) {
        leftMax = height[j];
        L = j;
      }
    }
    for (let j = i + 1; j < height.length; j++) {
      if (height[j] > rightMax) {
        rightMax = height[j];
        R = j;
      }
    }

    let currWater = Math.min(leftMax, rightMax) - height[i];

    if (currWater > 0 && L !== i && R !== i) {
      maxWater += currWater;

      if (waterIndices[`${L}-${R}-${i}`])
        waterIndices[`${L}-${R}-${i}`].push(currWater);
      else waterIndices[`${L}-${R}-${i}`] = [currWater];
    }
  }

  return { maxWater, waterIndices };
}

function renderVisual(height) {
  if (!height?.length) return;

  const { maxWater, waterIndices = {} } = maxWaterData(height);

  maxWaterP.textContent = maxWater;
  const rootSVG = createSvgElement("svg", {
    height: ROOT_HEIGHT,
    width: height.length * BAR_WIDTH,
    fill: "#fff",
  });
  svgContainer.append(rootSVG);

  renderBars({ height, rootSVG });
  renderWater({ waterIndices, rootSVG, height });
}

function renderBars({ height, rootSVG }) {
  for (let i = 0; i < height.length; i++) {
    const el = createSvgElement("rect", {
      height: calcBarRenderedHeight(height[i]),
      width: BAR_WIDTH,
      fill: "black",
      x: i * BAR_WIDTH,
      y: ROOT_HEIGHT - height[i] * BAR_UNIT_HEIGHT,
    });

    rootSVG.append(el);
  }
}

function renderWater({ waterIndices, rootSVG, height }) {
  for (let [indices, waterLevels] of Object.entries(waterIndices)) {
    let [L, R, idx] = indices.split("-");

    for (let i = 0; i < waterLevels.length; i++) {
      const el = createSvgElement("rect", {
        width: BAR_WIDTH,
        height: calcBarRenderedHeight(waterLevels[i]),
        fill: "skyblue",
        x: idx * BAR_WIDTH,
        y:
          ROOT_HEIGHT -
          waterLevels[i] * BAR_UNIT_HEIGHT -
          height[idx] * BAR_UNIT_HEIGHT,
        opacity: 0.5,
      });

      rootSVG.append(el);
    }
  }
}

function createSvgElement(qualifier, attr = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", qualifier);

  for (let [att, val] of Object.entries(attr)) {
    el.setAttribute(att, val);
  }

  return el;
}
