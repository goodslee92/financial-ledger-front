import React, { useState, useEffect } from "react";
import Select from "react-select";
import './statistics.scss';
import HeaderAmount from '../../common/header/header_amount';
import { addComma } from '../../../utils/numberUtils';
import Nav from '../../common/nav/nav';
import HeaderTitle from "../../common/header/header_title";
import axios from 'axios';
import { url } from '../../common/api';
import RoundBtn from "../../common/roundBtn/roundBtn";

const Dropdown = () => {
    const firstOptions = [
        { value: "주간", label: "주간" },
        { value: "월간", label: "월간" },
        { value: "연간", label: "연간" }
    ];
    const secondOptions = [
        { value: "저축", label: "저축" },
        { value: "의료비", label: "의료비" },
        { value: "교통비", label: "교통비" },
        { value: "외식비", label: "외식비" },
        { value: "문화비", label: "문화비" },
        { value: "보험료", label: "보험료" },
        { value: "공과금", label: "공과금" },
        { value: "통신비", label: "통신비" }
    ];
    const [totalSum, setTotalSum ] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalOutcome, setTotalOutcome] = useState(0);
    const total = { sum: 0, income: 0, outcome: 0 };
    const data = {
        id: window.sessionStorage.getItem('loginUserId'),
        year: new Date().getFullYear()
    };
    const [financialList, setFinancialList] = useState();
    const [selectedPeriod, setSelectedPeriod] = useState('주간');
    const [selectedExpense, setSelectedExpense] = useState('');
    const handlePeriodOnChange = (e) => {
        setSelectedPeriod(e.value);
    };
    const handleExpenseOnChange = (e) => {
        setSelectedExpense(e.value);
    };
    // 헤더 금액 부분 계산
    const calcTotalIncome = () => {
        financialList && financialList.map((content, index) => {
            total.income += content.TOTAL_INCOME;
            total.outcome += content.TOTAL_OUTCOME;
        });
        total.sum = total.income - total.outcome;
        setTotalIncome(total.income);
        setTotalOutcome(total.outcome);
        setTotalSum(total.sum);
        console.log('total.income : ' + total.income + ', total.outcome : ' + total.outcome + ', total.sum : ' + total.sum);
    };
    // 선택값(주간/월간/연간)에 따라 조회 쿼리 분기처리
    const switchPeriod = () => {
        switch (selectedPeriod) {
            case '월간' :
                // const currentMonth = new Date().getMonth() + 1
                const fetchMonthlyData = async () => {
                    await axios.post(url + '/api/selectMonthlyItem', data)
                    .then(res => {
                        console.log(res.data)
                        setFinancialList(res.data)
                    }).catch(err => {
                        console.log(err)
                    });
                };
                fetchMonthlyData();
                break;
            case '연간' :
                const fetchYearlyData = async () => {
                    await axios.post(url + '/api/selectYearlyItem', data)
                    .then(res => {
                        console.log(res.data)
                        setFinancialList(res.data)
                    }).catch(err => {
                        console.log(err)
                    });
                };
                fetchYearlyData();
                break;
            default :
                // 주간
                const fetchData = async () => {
                    await axios.post(url + '/api/selectWeekendItem', data)
                    .then(res => {
                        console.log(res.data)
                        setFinancialList(res.data)
                    }).catch(err => {
                        console.log(err)
                    });
                };
                fetchData();
                break;
        }
    };
    useEffect(() => {
        console.log('selectedPeriod is changed, selectedPeriod : ' + selectedPeriod);
        // 선택값(주간/월간/연간) 변동시 해당 기간의 조회 쿼리 분기처리
        switchPeriod();
    }, [selectedPeriod]);

    useEffect(() => {
        // 기간(주간/월간/연간)에 따른 데이터 변경시 헤더(금액부분) 새로 계산
        calcTotalIncome();
    }, [financialList]);

    return (
        <div className="statistics_root_container">
            <HeaderTitle />
            <Nav />
            <div className="statistics_container">
                <HeaderAmount income={totalIncome.toString()} outcome={totalOutcome.toString()} sum={totalSum.toString()}/>
                <div className="dropDown_container">
                    <div className="first_option_container">
                        <p>기간</p>
                        <Select defaultValue={firstOptions[0]} options={firstOptions} className="select" onChange={handlePeriodOnChange} />
                    </div>
                    <div className="second_option_container">
                        <p>분류</p>
                        <Select options={secondOptions} className="select" onChange={handleExpenseOnChange} />
                    </div>
                </div>
                <div className="statistics_content_container">
                    <div className='statistics_item_name_container'>
                        <p className='statistics_use_date'>사용일</p>
                        <p className='statistics_use_income_amount'>수입 금액</p>
                        <p className='statistics_use_outcome_amount'>지출 금액</p>
                    </div>
                    <hr className="statistics_devideLine"/>
                    {
                        financialList && financialList.map((content, index) => {
                            return (
                                <div className="row_statistics_item_container" key={index}>
                                    <p className="statistics_item_date">
                                        {
                                            selectedPeriod === '주간' ? 
                                            (content.WEEK_START + ' ~ ' + content.WEEK_END) : 
                                            (selectedPeriod === '월간' ? content.YEAR + '년 ' + content.MONTH + '월' : content.YEAR + '년')
                                        }
                                    </p>
                                    <p className="statistics_item_income">+{addComma(content.TOTAL_INCOME.toString())}원</p>
                                    <p className="statistics_item_outcome">-{addComma(content.TOTAL_OUTCOME.toString())}원</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <RoundBtn />
        </div>
    );
}

export default Dropdown