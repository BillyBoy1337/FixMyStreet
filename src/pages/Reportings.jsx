import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TableWithSection } from '@/components/custom/customTable';
import Loader from '@/components/custom/Loader';
import { ComplaintsTable } from '@/components/custom/complaints.Table';
import { ErrorPage } from '@/components/custom/ErrorPage';



function Reportings() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://funcfixmystreet.azurewebsites.net/api/GetStats?code=azB1wzYgoOKQlg_GRpr1U1-LX4roZzB_eFLNoxv0FRAiAzFuqitytw%3D%3D');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response.data === "No complaints found."){
                    setData({all_complaints: []});
                    setLoading(false);
                }
                else{   
                    setError(error);
                    setLoading(false);
                }
            }
                
        };

        fetchData();
    }, []);

    if (loading) return <Loader/>;
    if (error) return <ErrorPage error={error.message}/>;

    return (
        <div className='bg-white mx-2 md:mx-6 shadow-lg mt-0 rounded-sm'>
            {/* <div>
                <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Welcome to FixMyStreet Dashboard</h2>
                    </div>
                </div>

            </div> */}
           
            <ComplaintsTable complaints={data.all_complaints}/>
        
        </div>
    );
}

export default Reportings;