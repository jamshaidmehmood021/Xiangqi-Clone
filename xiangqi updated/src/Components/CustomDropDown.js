import React from 'react';
import PropTypes from 'prop-types';
import "Components/CustomDropDown.scss";

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

CustomDropDown.propTypes = {
    data: PropTypes.shape({
        flag: PropTypes.string,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }).isRequired,
    innerProps: PropTypes.object.isRequired,
    selectProps: PropTypes.shape({
        options: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired
};

export default CustomDropDown;
