import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { PieChart, RadarChart, BarChart } from '@mui/x-charts';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";

function valueFormatter(v) {
  if (v === null) return 'NaN';
  return `${v.toLocaleString()}t CO2eq/pers`;
}

const endPoint = 'http://127.0.0.1:8000/api';

const InventoryOverview = () => {

  const [loading, setLoading] = useState(true);

  const data = [
    { label: 'Hàng còn trong kho', value: 400 },
    { label: 'Đã xuất kho', value: 300 },
    { label: 'Sắp hết hạn', value: 200 },
  ];

  const [highlightedItem, setHighlightedItem] = useState(null);

  const handleHighLightedSeries = (event, newSeriesId) => {
    setHighlightedItem(newSeriesId ? { seriesId: newSeriesId } : null);
  };

  const [barData, setBarData] = useState({
    importData: Array(12).fill(0),
    exportData: Array(12).fill(0),
    labelMonth: Array.from({ length: 12 }, (_, i) => `T${i + 1}`)
  });
  //fetch import
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [importRes, exportRes] = await Promise.all([
          axios.get(`${endPoint}/received-orders`),
          axios.get(`${endPoint}/ingredients/used`)
        ]);

        console.log('Nguyen lieu nhap', importRes.data);
        console.log('Nguyen lieu xuat', exportRes.data);

        const importData = [...barData.importData];
        importRes.data.data.forEach(item => {
          importData[item.month - 1] = parseFloat(item.total_quantity);
        });

        const exportData = [...barData.exportData];
        exportRes.data.data.forEach(item => {
          exportData[item.month - 1] = parseFloat(item.total_used);
        });

        setBarData(prev => ({
          ...prev,
          importData,
          exportData
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




  return (
    <div className="section">
      <div className="flex min-h-screen">
        <div className="w-[15%]"><Sidebar /></div>
        <div className="w-[85%] h-screen bg-gray-100 p-6 mx-auto overflow-hidden">
          <h4 className="text-lg font-bold p-1 border-b m-0! border-gray-300">
            📦 Thống kê kho hàng
          </h4>
          <div className="grid grid-cols-3 gap-4 h-[calc(100vh-8rem)] p-3">
            <div className="col-span-2 row-span-2 flex items-center justify-center bg-white rounded-xl shadow">
              {
                loading ? (
                  <Stack spacing={2} direction="row" alignItems="center">
                    <CircularProgress size="30px" />
                  </Stack>
                ) : (
                  <Box sx={{ width: '95%', height: '90%' }}>
                    <BarChart
                      series={[
                        { data: barData.importData, label: 'Nhập', id: 'pvId' },
                        { data: barData.exportData, label: 'Xuất', id: 'uvId' },
                      ]}
                      xAxis={[{ data: barData.labelMonth }]}
                      yAxis={[{ width: 50 }]}
                    />
                  </Box>
                )
              }
            </div>
            <div className="flex items-center justify-center bg-white rounded-xl shadow pt-4">
              <PieChart
                series={[{
                  startAngle: -90, endAngle: 90, data,
                  innerRadius: 40, outerRadius: 90, paddingAngle: 2,
                }]}
                width={220}
                height={180}
              />
            </div>
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
                        id: 'stock', data: [6.65, 2.76, 5.15, 0.19, 0.07], fill: true,
                        fillOpacity: 0.4, valueFormatter
                      },

                    ]}
                    radar={{ metrics: ['Tồn kho trung bình', 'Tỉ lệ xuất', 'Tốc độ sử dụng', 'Tỷ lệ hao hụt', 'Phí lưu kho'] }}
                    highlightedItem={highlightedItem}
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
