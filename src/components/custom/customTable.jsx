import React from 'react';

export function TableWithSection({ list, listname }) {
  return (
    <>{list ? (<div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
     
      <div className=" px-0 overflow-scroll">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 transition-colors cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50">
                <p className=" font-bold uppercase flex items-center justify-between gap-2 font-sans text-sm antialiased  leading-none text-blue-gray-900 opacity-70">
                  {listname}
                </p>
              </th>
              <th className="p-4 transition-colors cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50">
                <p className=" font-bold uppercase flex items-center justify-between gap-2 font-sans text-sm antialiased  leading-none text-blue-gray-900 opacity-70">
                  Count
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(list).map(([item, count]) => (
              <tr key={item}>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {item}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {count}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>) : ""}</>
  );
}