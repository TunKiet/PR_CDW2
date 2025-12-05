import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import ManagerReview from './ManagerReview';
import ManagerReply from './ManagerReply';
import { CiSearch } from "react-icons/ci";
import Button from '@mui/material/Button';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import ChartReply from './ChartReply';

const endPoint = 'http://localhost:8000/api';

const ReviewModerator = () => {

  const [chartData, setChartData] = useState(null);
  const [dataReply, setDataReply] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(true);


  useEffect(() => {
    const fetchDataChart = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${endPoint}/reviews/chart/data`);

        setChartData(res.data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoading(false);
      }
    };
    fetchDataChart();
  }, []);

  useEffect(() => {
    const fetchDataReply = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${endPoint}/reply/chart`);
        setDataReply(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataReply();
  }, []);



  if (loading || !chartData) {
    return <div><CircularProgress /></div>;
  }

  const pieData = Object.entries(chartData.quantity_review_rating).map(
    ([rating, total]) => ({
      label: `${rating} sao`,
      value: total,
    })
  );

  const weekdayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const weekdayValues = [
    chartData.review_of_day[2] || 0,
    chartData.review_of_day[3] || 0,
    chartData.review_of_day[4] || 0,
    chartData.review_of_day[5] || 0,
    chartData.review_of_day[6] || 0,
    chartData.review_of_day[7] || 0,
    chartData.review_of_day[1] || 0,
  ];

  const monthLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const monthlyPercent = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return Number(chartData?.percent_year?.[month] ?? chartData?.percent_year?.[String(month)] ?? 0);
  });

  const LINE_COLOR = '#FF3042';

  return (
    <>
      <div className="section">
        <div className="flex min-h-screen">
          <div className="w-[15%]">
            <Sidebar />
          </div>
          <div className="w-[85%] bg-gray-100 p-6">
            <div className="container">
              <h2 className="text-2xl font-semibold mb-4">ReviewModerator</h2>
              <hr />
              <div className="reviewModerator-box-setting flex">
                <div className="reviewModerator-box-search w-[600px]">
                  <div className="search-input relative">
                    <div className="search-icon">
                      <CiSearch className='absolute right-0 top-2.5 me-2' />
                    </div>
                    <input type="search" className='form-control' placeholder='Tìm kiếm đánh giá...' />
                  </div>
                </div>
                <div className="reviewModerator-box-view flex ms-auto">
                  <div className="reviewModerator-button flex">
                    <div className="reviewModerator-button-left" onClick={() => setShowComment(true)}>
                      <Button variant={showComment ? "contained" : "outlined"}>Đánh giá</Button>
                    </div>
                    <div className="reviewModerator-button-right mx-3" onClick={() => setShowComment(false)}>
                      <Button variant={!showComment ? "contained" : "outlined"} color='error'>Phản hồi</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="parent grid grid-cols-5 grid-rows-4 gap-2">
              <div className="bg-white-200 col-span-3 row-span-6 p-2">
                <div className="grid grid-cols-6 grid-rows-6 gap-2">
                  {/* Display count review */}
                  <div className="bg-white col-span-2 row-span-2 p-2 rounded-lg shadow">
                    <div className="text-gray-500">Đánh giá</div>
                    <div className="flex items-center justify-center">
                      <span className='text-3xl font-bold'>{chartData.count_review}</span>
                      <div className="">
                        <SparkLineChart
                          colors={[LINE_COLOR]}
                          data={monthlyPercent}
                          height={90}
                          showTooltip
                          showHighlight
                        />
                      </div>
                    </div>
                  </div>
                  {/* Display average rating review */}
                  <div className="bg-white col-span-2 row-span-2 col-start-3 p-2 rounded-lg shadow">
                    <div className="text-gray-500">Sao</div>
                    <div className="flex items-center justify-center">
                      <span className='text-3xl font-bold'>{chartData.average_review}</span>
                      <div className="">
                        <SparkLineChart
                          data={weekdayValues}
                          height={100}
                          showTooltip
                          showHighlight
                        />
                      </div>
                    </div>
                  </div>
                  {/* Display count reply */}
                  <ChartReply dataReply={dataReply} monthlyPercent={monthlyPercent} />

                  <div className="bg-gray-50 col-span-6 row-span-4 row-start-3 rounded-lg shadow">
                    <LineChart
                      xAxis={[{
                        type: 'category',
                        data: monthLabels
                      }]}
                      series={[{
                        name: "Percent",
                        data: monthlyPercent,
                        showMark: true
                      }]}
                      height={300}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white col-span-2 row-span-2 col-start-4 p-2 rounded-lg shadow mt-2">
                <div className="flex flex-col items-center">
                  <PieChart
                    width={200}
                    height={200}
                    series={[
                      {
                        innerRadius: 50,
                        outerRadius: 100,
                        data: pieData,
                        arcLabel: (d) => d.value,
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="bg-white col-span-2 row-span-2 col-start-4 row-start-3 p-2 rounded-lg shadow">
                <BarChart
                  borderRadius={8}
                  series={[{ data: weekdayValues, label: "Theo ngày" }]}
                  xAxis={[{ data: weekdayLabels }]}
                  yAxis={[{ width: 50 }]}
                />
              </div>
            </div>

            {showComment ?
              <ManagerReview /> :
              <ManagerReply
                dataReply={dataReply} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default ReviewModerator