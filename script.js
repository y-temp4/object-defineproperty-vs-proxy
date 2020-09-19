import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";
import "frappe-charts/dist/frappe-charts.min.css";

const loopCounts = [5_000, 50_000, 500_000, 5_000_000];

function measurePerformance(func, loopCount) {
  const startTime = performance.now();
  for (let i = 0; i < loopCount; i++) {
    func();
  }
  const endTime = performance.now();
  return endTime - startTime;
}

function useObjectDefineProperty1() {
  const data = { key: "" };
  Object.defineProperty(data, "key", {
    get() {},
    set() {},
  });
}

function useProxy1() {
  const data = { key: "" };
  new Proxy(data, {
    get() {},
    set() {},
  });
}

const measuresObjectDefineProperty1 = loopCounts.map((loopCount) => {
  const time = measurePerformance(useObjectDefineProperty1, loopCount);
  return time;
});

const measuresProxy1 = loopCounts.map((loopCount) => {
  const time = measurePerformance(useProxy1, loopCount);
  return time;
});

const data1 = {
  labels: loopCounts,
  datasets: [
    {
      name: "Object.defineProperty",
      type: "line",
      values: measuresObjectDefineProperty1,
    },
    {
      name: "Proxy",
      type: "line",
      values: measuresProxy1,
    },
  ],
};

function useObjectDefineProperty2() {
  const data = { key: "" };
  let key = "";
  Object.defineProperty(data, "key", {
    get() {
      return key;
    },
    set(newVal) {
      key = newVal;
    },
  });
  data.key = "newVal";
}

function useProxy2() {
  const data = { key: "" };
  let key = "";
  new Proxy(data, {
    get() {
      return key;
    },
    set(newVal) {
      key = newVal;
    },
  });
  data.key = "newVal";
}

const measuresObjectDefineProperty2 = loopCounts.map((loopCount) => {
  const time = measurePerformance(useObjectDefineProperty2, loopCount);
  return time;
});

const measuresProxy2 = loopCounts.map((loopCount) => {
  const time = measurePerformance(useProxy2, loopCount);
  return time;
});

const data2 = {
  labels: loopCounts,
  datasets: [
    {
      name: "Object.defineProperty",
      type: "line",
      values: measuresObjectDefineProperty2,
    },
    {
      name: "Proxy",
      type: "line",
      values: measuresProxy2,
    },
  ],
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    new Chart("#chart1", {
      title: "Object.defineProperty vs Proxy only calling",
      data: data1,
      type: "line",
      height: 250,
      colors: ["red", "blue"],
    });
    new Chart("#chart2", {
      title: "Object.defineProperty vs Proxy update key",
      data: data2,
      type: "line",
      height: 250,
      colors: ["red", "blue"],
    });
  },
  false
);
