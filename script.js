import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";
import "frappe-charts/dist/frappe-charts.min.css";

const loopCounts = [1_000, 10_000, 100_000, 1000_000];

function measurePerformance(func, loopCount) {
  const startTime = performance.now();
  for (let i = 0; i < loopCount; i++) {
    func();
  }
  const endTime = performance.now();
  return endTime - startTime;
}

function useObjectDefineProperty() {
  const data = { key: "" };
  Object.defineProperty(data, "key", {
    get() {},
    set() {},
  });
}

function useProxy() {
  const data = { key: "" };
  new Proxy(data, {
    get() {},
    set() {},
  });
}

const measuresObjectDefineProperty = loopCounts.map((loopCount) => {
  const time = measurePerformance(useObjectDefineProperty, loopCount);
  return time;
});

const measuresProxy = loopCounts.map((loopCount) => {
  const time = measurePerformance(useProxy, loopCount);
  return time;
});

const data1 = {
  labels: loopCounts,
  datasets: [
    {
      name: "Object.defineProperty",
      type: "line",
      values: measuresObjectDefineProperty,
    },
    {
      name: "Proxy",
      type: "line",
      values: measuresProxy,
    },
  ],
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    new Chart("#chart", {
      title: "Object.defineProperty vs Proxy",
      data: data1,
      type: "line",
      height: 250,
      colors: ["red", "blue"],
    });
  },
  false
);
