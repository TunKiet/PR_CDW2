import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { PieChart } from '@mui/x-charts/PieChart';
import { RadarChart } from '@mui/x-charts/RadarChart';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

function valueFormatter(v) {
  if (v === null) return 'NaN';
  return `${v.toLocaleString()}t CO2eq/pers`;
}

const InventoryOverview = () => {
  // --- Dữ liệu cho PieChart ---
  const data = [
    { label: 'Hàng còn trong kho', value: 400 },
    { label: 'Đã xuất kho', value: 300 },
    { label: 'Sắp hết hạn', value: 200 },
  ];

  // --- Dữ liệu cho RadarChart ---
  // const series = [
  //   {
  //     id: 'import',
  //     label: 'Nhập kho',
  //     data: [150, 120, 180, 90, 220, 110],
  //   },
  //   {
  //     id: 'export',
  //     label: 'Xuất kho',
  //     data: [130, 100, 160, 70, 200, 95],
  //   },
  //   {
  //     id: 'stock',
  //     label: 'Tồn cuối kỳ',
  //     data: [20, 20, 20, 20, 20, 15],
  //   },
  // ];

  // --- State ---
  const [highlightedItem, setHighlightedItem] = useState(null);

  const handleHighLightedSeries = (event, newSeriesId) => {
    if (newSeriesId !== null) {
      setHighlightedItem({ seriesId: newSeriesId });
    }
  };

  // --- Dữ liệu cho BarChart ---
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490, 10000, 5678, 4400, 6733, 1000];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300, 4000, 7890, 1234, 1000, 4000];
  const xLabels = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

  return (
    <div className="section">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-[20%]">
          <Sidebar />
        </div>

        {/* Nội dung chính */}
        <div className="w-[80%] h-screen bg-gray-100 p-6 mx-auto overflow-hidden">
          <h4 className="text-lg font-bold mb-4 p-3 border-b border-gray-300">
            📦 Thống kê kho hàng
          </h4>

          <div className="grid grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
            {/* Biểu đồ cột lớn bên trái */}
            <div className="col-span-2 row-span-2 flex items-center justify-center bg-white rounded-xl shadow">
              <Box sx={{ width: '95%', height: '90%' }}>
                <BarChart
                  series={[
                    { data: pData, label: 'Nhập', id: 'pvId' },
                    { data: uData, label: 'Xuất', id: 'uvId' },
                  ]}
                  xAxis={[{ data: xLabels }]}
                  yAxis={[{ width: 50 }]}
                />
              </Box>
            </div>

            {/* Biểu đồ tròn */}
            <div className="flex items-center justify-center bg-white rounded-xl shadow">
              <PieChart
                series={[
                  {
                    startAngle: -90,
                    endAngle: 90,
                    data,
                    innerRadius: 40,
                    outerRadius: 90,
                    paddingAngle: 2,
                  },
                ]}
                width={220}
                height={180}
              />
            </div>

            {/* Biểu đồ radar */}
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-3">
              <Stack sx={{ width: '100%' }} spacing={2} alignItems={'center'}>
                <ToggleButtonGroup
                  value={highlightedItem?.seriesId ?? null}
                  exclusive
                  onChange={handleHighLightedSeries}
                  aria-label="highlighted series"
                  fullWidth
                  size="small"
                >
                  
                </ToggleButtonGroup>

                <Box sx={{ width: '100%' }}>
                  <RadarChart
                    height={300}
                    series={[
                      {
                        label: 'USA',
                        data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
                        fill: true, // 🔹 luôn tô vùng phủ
                        valueFormatter,
                      },
                      {
                        label: 'Australia',
                        data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
                        fill: true,
                        valueFormatter,
                      },
                      {
                        label: 'United Kingdom',
                        data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
                        fill: true,
                        valueFormatter,
                      },
                    ]}
                    radar={{
                      metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
                    }}
                  />
                </Box>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverview;
