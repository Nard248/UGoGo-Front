import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";
import {getSentRequests} from "../../api/route";
import {SyntheticEvent, useEffect, useMemo, useState} from "react";
import {Tab, Tabs} from "@mui/material";
import {Loading} from "../../components/loading/Loading";
import { useNavigate } from "react-router-dom";

export const SentRequests = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tabValue, setTabValue] = useState('all');
    const navigate = useNavigate();

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    const [requests, setRequests] = useState([])

    const getRequests = async () => {
        setIsLoading(true)
        try {
            const data = await getSentRequests();
            setRequests(data.data.results);
        } catch (error) {
            console.error("Failed to fetch sent requests", error);
            setRequests([]);
        } finally {
            setIsLoading(false)
        }
    }

    const requestsWithFilters = useMemo(() => {
        return {
            all: requests,
            completed: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'completed'),
            pending: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'pending'),
            in_process: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'in_process'),
            rejected: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'rejected'),
        }
    }, [requests])

    useEffect(() => {
        getRequests()
    }, [])

    return (
        <>{isLoading ?
            <Loading/>
            :
            !!requests.length ?
                <div className="flex flex-col gap-3 w-full">
                    <Tabs value={tabValue} onChange={handleChange} centered>
                        <Tab label="All" value={'all'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                        <Tab label="Completed" value={'completed'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                        <Tab label="Pending" value={'pending'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                        <Tab label="In progress" value={'in_process'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                        <Tab label="Rejected" value={'rejected'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                    </Tabs>
                    <div className="flex flex-col gap-[6rem] w-full">
                        <h3 className="text-[2rem] font-medium">
                            Sent requests
                        </h3>
                        <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                            {/*@ts-ignore*/}
                            {!requestsWithFilters[tabValue].length ?
                                <h1>You don't have sent requests with
                                    status <b>{tabValue.split('_').join(' ').toUpperCase()}</b></h1>
                                :
                                // @ts-ignore
                                requestsWithFilters[tabValue].map(request => (
                                    <OfferCard key={request.id}
                                               withRate={false}
                                               data={request.offer}
                                    />
                                ))}
                        </div>
                        <div className="flex justify-end gap-[4rem]">
                            <Button title={'How it works'} type={'secondary'} handleClick={() => {
                            }}/>
                            <Button title={'Browse items'} type={'primary'} handleClick={() => {
                                navigate('/');
                            }}/>
                        </div>
                    </div>
                </div>
                :
                <h1>No sent requests found</h1>
        }
        </>
    )
}