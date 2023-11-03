import { Icon } from '@iconify/react';
import { format } from 'date-fns';

const CalendarHeader = ({ currentMonth, prevMonth, nextMonth }) => {
    return (
        <div className="calendarHeader row">
            <div className="col col-start">
                <span className="text">
                    <span className="text month">
                        {format(currentMonth, 'M')}월
                    </span>
                    <span className="text year">
                        {" "}{format(currentMonth, 'yyyy')}
                    </span>
                </span>
            </div>
            <div className="col col-end">
                <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
                <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
            </div>
        </div>
    );
};

export default CalendarHeader