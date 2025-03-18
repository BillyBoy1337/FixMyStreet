import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TableWithSection } from '@/components/custom/customTable';
import Loader from '@/components/custom/Loader';
import { ErrorPage } from '@/components/custom/ErrorPage';



function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://funcfixmystreet.azurewebsites.net/api/GetStats?code=azB1wzYgoOKQlg_GRpr1U1-LX4roZzB_eFLNoxv0FRAiAzFuqitytw%3D%3D');
                setData(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response.data === "No complaints found."){
                    setData({});
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

    if (loading) return (
             <Loader/>
    );
    if (error) return <ErrorPage error={error.message}/>;

    return (
        <div className='bg-white mx-2 md:mx-6 shadow-lg mt-0 rounded-sm'>
            <div>
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Welcome to FixMyStreet Dashboard</h2>
    <p className="mt-4 text-gray-500 sm:text-md">
      FixMyStreet is your go-to platform for reporting and tracking issues in your community. Whether it's a pothole, broken streetlight, or any other public concern, our system ensures that your complaints are heard and addressed promptly. Stay informed with real-time updates and comprehensive statistics on the status of reported issues.
    </p>
  </div>
</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full min-w-0 scale-90">
                    <div className="flex flex-col px-6 py-2 bg-white shadow rounded-lg overflow-hidden">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="text-6xl font-bold tracking-tight leading-none text-blue-500">{data.complaints_by_status?.Pending || 0}</div>
                            <div className="text-lg font-medium text-blue-500">Pending</div>
                        </div>
                    </div>
                    <div className="flex flex-col px-6 py-2 bg-white shadow rounded-lg overflow-hidden">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="text-6xl font-bold tracking-tight leading-none text-amber-500">{data?.complaints_by_status?.["In Progress"] || 0}</div>
                            <div className="text-lg font-medium text-amber-600">In Progress</div>
                        </div>
                    </div>
                    <div className="flex flex-col px-6 py-2 bg-white shadow rounded-lg overflow-hidden">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="text-6xl font-bold tracking-tight leading-none text-green-500">{data?.complaints_by_status?.Resolved || 0}</div>
                            <div className="text-lg font-medium text-green-600">Resolved</div>
                        </div>
                    </div>
                    <div className="flex flex-col px-6 py-2 bg-white shadow rounded-lg overflow-hidden">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="text-6xl font-bold tracking-tight leading-none  text-red-500">{data?.complaints_by_status?.Closed || 0}</div>
                            <div className="text-lg font-medium  text-red-600">Closed</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='flex flex-wrap p-5 justify-between '>
                <div className='h-[400px] overflow-hidden overflow-y-scroll w-[39%] border-2 border-gray-700 rounded-md shadow-md bg-red-300'>
                  {<br/>*6}
                </div>
                <div className='h-[380px]overflow-hidden overflow-y-scroll  w-[59%] border-2 border-gray-700 rounded-md shadow-md bg-red-300'></div>
            </div> */}
            <div className='md:flex flex-wrap p-5 justify-between '>
            <div className='md:w-[45%] max-h-96 mt-4'><TableWithSection list={data?.complaints_by_category} listname={"category"} /></div>
            <div className='md:w-1/2 max-h-96 mt-4'><TableWithSection list={data?.complaints_by_village} listname={"village"} /></div>
            </div>
            {/* <h1>Dashboard</h1>
            <div>
                <h2>Statistics</h2>
                <p>Total Complaints: {data.total_complaints}</p>
                <h3>Complaints by Status</h3>
                <ul>
                    {Object.entries(data.complaints_by_status).map(([status, count]) => (
                        <li key={status}>{status}: {count}</li>
                    ))}
                </ul>
                <h3>Complaints by Category</h3>
                <ul>
                    {Object.entries(data.complaints_by_category).map(([category, count]) => (
                        <li key={category}>{category}: {count}</li>
                    ))}
                </ul>
                <h3>Complaints by Village</h3>
                <ul>
                    {Object.entries(data.complaints_by_village).map(([village, count]) => (
                        <li key={village}>{village}: {count}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>All Complaints</h2>
                <ul>
                    {data.all_complaints.map(complaint => (
                        <li key={complaint.id}>
                            <h3>{complaint.title}</h3>
                            <p><strong>Status:</strong> {complaint.status}</p>
                            <p><strong>Category:</strong> {complaint.category}</p>
                            <p><strong>Description:</strong> {complaint.description}</p>
                            <p><strong>Village:</strong> {complaint.village}</p>
                            <p><strong>Street:</strong> {complaint.street}</p>
                            <p><strong>Reported At:</strong> {new Date(complaint.reportedAt).toLocaleString()}</p>
                            {complaint.imageUrl && <img src={complaint.imageUrl} alt={complaint.title} style={{ maxWidth: '200px' }} />}
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
}

export default Dashboard;