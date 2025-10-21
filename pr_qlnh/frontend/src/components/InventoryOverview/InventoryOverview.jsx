import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { PieChart } from '@mui/x-charts/PieChart';
import { RadarChart } from '@mui/x-charts/RadarChart';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const InventoryOverview = () => {
  // --- Dữ liệu cho PieChart ---
  const data = [
    { label: 'Hàng còn trong kho', value: 400 },
    { label: 'Đã xuất kho', value: 300 },
    { label: 'Sắp hết hạn', value: 200 },
  ];

  // --- Dữ liệu cho RadarChart ---
  const radar = {
    metrics: ['Dầu', 'Than', 'Khí', 'Công nghiệp', 'Xi măng', 'Khác'],
  };

  const series = [
    {
      id: 'usa',
      label: 'USA',
      data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
    },
    {
      id: 'australia',
      label: 'Australia',
      data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
    },
    {
      id: 'uk',
      label: 'United Kingdom',
      data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
    },
  ];

  // --- State ---
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [fillArea, setFillArea] = useState(false);

  const handleHighLightedSeries = (event, newSeriesId) => {
    if (newSeriesId !== null) {
      setHighlightedItem({ seriesId: newSeriesId });
    }
  };

  const withOptions = (series) =>
    series.map((item) => ({
      ...item,
      fillArea,
      type: 'radar',
    }));

  return (
    <div className="section">
      <div className="flex min-h-screen">
        <div className="w-[20%]">
          <Sidebar />
        </div>

        <div className="w-[80%] bg-gray-100 p-6">
          <h5 className="text-lg font-bold mb-4">📦 Thống kê kho hàng</h5>

          {/* --- Biểu đồ tròn --- */}
          <div className="flex justify-center my-6">
            <PieChart
              series={[
                {
                  startAngle: -90,
                  endAngle: 90,
                  data,
                  innerRadius: 40,
                  outerRadius: 100,
                  paddingAngle: 2,
                },
              ]}
              width={400}
              height={200}
            />
          </div>

          {/* --- Biểu đồ Radar --- */}
          <Stack sx={{ width: '100%' }} spacing={2} alignItems={'center'}>
            <ToggleButtonGroup
              value={highlightedItem?.seriesId ?? null}
              exclusive
              onChange={handleHighLightedSeries}
              aria-label="highlighted series"
              fullWidth
              size="small"
            >
              {series.map((item) => (
                <ToggleButton
                  key={item.id}
                  value={item.id}
                  aria-label={`series ${item.label}`}
                >
                  {item.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Box sx={{ width: '100%' }}>
              <RadarChart
                height={300}
                highlight="series"
                highlightedItem={highlightedItem}
                onHighlightChange={setHighlightedItem}
                series={withOptions(series)}
                radar={radar}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={fillArea}
                  onChange={(e) => setFillArea(e.target.checked)}
                />
              }
              label="Tô vùng phủ (fill area)"
            />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverview;
