import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = (props) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Price History",
      },
    },
  };

  const datas = props.datas;

  const labels = Array(datas.length).fill().map((x,i)=>i+1);

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: datas,
        borderColor: "rgb(0, 255, 0)",
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  return (
    <>
      <Line options={options} data={data} />
    </>
  );
};

export default Chart;