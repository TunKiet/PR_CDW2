import React from 'react'
import { FaStar } from "react-icons/fa";
import Rating from '@mui/material/Rating';
const Star = () => {
    // const [values, setValues] = useState(0)
    return (
        <>
            <div className="star flex text-2xl py-1">
                <Rating name="simple-controlled" readOnly value={5} />
            </div>
        </>
    )
}

export default Star