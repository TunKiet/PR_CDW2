import React from 'react'
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const ChartReply = ({ dataReply, monthlyPercent }) => {
    return (
        <>
            <div className="bg-white col-span-2 row-span-2 col-start-5 p-2 rounded-lg shadow">
                <div className="text-gray-500">Phản hồi</div>
                <div className="flex items-center justify-center">
                    <span className='text-3xl font-bold'>{dataReply?.countReply || 0}</span>
                    <div className="">
                        <SparkLineChart
                            data={monthlyPercent}
                            height={100}
                            showTooltip
                            showHighlight
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChartReply