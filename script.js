import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";
import "frappe-charts/dist/frappe-charts.min.css";

const loopCounts = [10_000, 100_000, 1_000_000];

function getPerformanceTime(func, loopCount) {
  const startTime = performance.now();
  for (let i = 0; i < loopCount; i++) {
    func();
  }
  const endTime = performance.now();
  return endTime - startTime;
}

function makeDataSet(objectDefinePropertyFunc, proxyFunc) {
  const measuresObjectDefineProperty = loopCounts.map((loopCount) =>
    getPerformanceTime(objectDefinePropertyFunc, loopCount)
  );
  const measuresProxy = loopCounts.map((loopCount) =>
    getPerformanceTime(proxyFunc, loopCount)
  );
  return {
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

const data1 = makeDataSet(useObjectDefineProperty1, useProxy1);

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

const data2 = makeDataSet(useObjectDefineProperty2, useProxy2);

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
