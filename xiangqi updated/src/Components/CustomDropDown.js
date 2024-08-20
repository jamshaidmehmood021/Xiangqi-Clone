import React from 'react';

import "../Pages/Home.scss"

const CustomDropDown = (props) => {
    const { data, innerProps, selectProps } = props;
    const index = selectProps.options.findIndex(option => option.value === data.value);
    
    const backgroundColorClass = index % 2 === 0 ? 'bg-black' : 'bg-red-700';

    return (
        <div {...innerProps} className={`flex items-center p-2 input-background`}>
            {data.flag ? (
                <>
                    <span className="text-xl mr-2">{data.flag}</span>
                    <span>{data.label}</span>
                </>
            ) : (
                <>
                    <span className={`p-2 text-xl mr-2 text-white rounded-full ${backgroundColorClass}`}>{data.label}</span>
                    <span>{data.value}</span>
                </>
            )}
        </div>
    );
};

export default CustomDropDown;
