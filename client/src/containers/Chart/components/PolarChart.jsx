import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { PolarArea } from "react-chartjs-2";
import { semanticColors } from "@nextui-org/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { cloneDeep } from "lodash";

import ChartErrorBoundary from "./ChartErrorBoundary";
import useThemeDetector from "../../../modules/useThemeDetector";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

function PolarChart(props) {
  const {
    chart, redraw, redrawComplete, height
  } = props;
  const [maxHeight, setMaxHeight] = React.useState(height);

  useEffect(() => {
    if (redraw) {
      setTimeout(() => {
        redrawComplete();
      }, 1000);
    }
  }, [redraw]);

  useEffect(() => {
    setMaxHeight(height - 10);
  }, [chart, height]);

  const theme = useThemeDetector() ? "dark" : "light";

  const _getChartOptions = () => {
    // add any dynamic changes to the chartJS options here
    if (chart.chartData?.options) {
      const newOptions = cloneDeep(chart.chartData.options);

      if (newOptions.scales) {
        newOptions.scales = {
          r: {
            grid: {
              color: semanticColors[theme].content4.DEFAULT,
            },
            angleLines: {
              color: semanticColors[theme].content4.DEFAULT,
            },
            pointLabels: {
              color: semanticColors[theme].foreground.DEFAULT,
            },
          }
        };
      }
      if (newOptions.plugins?.legend?.labels) {
        newOptions.plugins.legend.labels.color = semanticColors[theme].foreground.DEFAULT;
      }

      return newOptions;
    }

    return chart.chartData?.options;
  };

  return (
    <div style={{ height: maxHeight }}>
      {chart.chartData.data && chart.chartData.data.labels && (
        <ChartErrorBoundary>
          <PolarArea
            data={chart.chartData.data}
            options={_getChartOptions()}
            height={maxHeight}
            redraw={redraw}
          />
        </ChartErrorBoundary>
      )}
    </div>
  );
}

PolarChart.defaultProps = {
  redraw: false,
  redrawComplete: () => { },
  height: 300,
};

PolarChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  height: PropTypes.number,
};

export default PolarChart;