import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({
    end,
    isDecimal = false,
    incrementStep = 1
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = incrementStep;

        const counter = setInterval(() => {
            start += increment;

            if (start >= end) {
                clearInterval(counter);
                setCount(end);
            } else {
                setCount(start);
            }
        }, 30);

        return () => clearInterval(counter);
    }, [end, incrementStep]);

    const displayValue = isDecimal
        ? count.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : count.toLocaleString('vi-VN');

    return (
        <h3 className="text-3xl font-semibold">{displayValue}+</h3>
    );
};

export default AnimatedCounter;