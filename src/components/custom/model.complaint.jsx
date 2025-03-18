// import {
//     Typography,
//     Button,
//     DialogHeader,
//     DialogBody,
//     DialogFooter,
//     Input,
//   } from "@material-tailwind/react";


// function ModelComplaint({complaint, handleOpen, userRole, editMode}) { 

//     return (
//         <>
//         <DialogHeader>{complaint.title || "No Title"}</DialogHeader>
//         <DialogBody divider>
//           <Typography variant="h6" color="blue-gray">
//             Description:
//           </Typography>
//           <Typography color="gray">{complaint.description}</Typography>

//           <Typography variant="h6" color="blue-gray" className="mt-4">
//             Location:
//           </Typography>
//           <Typography color="gray">
//             Latitude: {complaint.location.lat}, Longitude: {complaint.location.lng}
//           </Typography>

//           <Typography variant="h6" color="blue-gray" className="mt-4">
//             Street:
//           </Typography>
//           <Typography color="gray">{complaint.street}</Typography>

//           <Typography variant="h6" color="blue-gray" className="mt-4">
//             Village:
//           </Typography>
//           <Typography color="gray">{complaint.village}</Typography>

//           <Typography variant="h6" color="blue-gray" className="mt-4">
//             Category:
//           </Typography>
//           <Typography color="gray">{complaint.category}</Typography>

//           <Typography variant="h6" color="blue-gray" className="mt-4">
//             Status:
//           </Typography>
//           <Typography color="gray">{complaint.status}</Typography>

//           {userRole === 'admin' && (
//             <>
//               {editMode ? (
//                 <>
//                   <Input
//                     label="Update Status"
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                     className="mt-4"
//                   />
//                   <Button
//                     variant="text"
//                     color="blue"
//                     onClick={handleStatusUpdate}
//                     className="mt-4"
//                     disabled={loading}
//                   >
//                     {loading ? "Updating..." : "Update Status"}
//                   </Button>
//                   {error && <Typography color="red" className="mt-2">{error}</Typography>}
//                 </>
//               ) : (
//                 <Button
//                   variant="text"
//                   color="blue"
//                   onClick={() => setEditMode(true)}
//                   className="mt-4"
//                 >
//                   Edit
//                 </Button>
//               )}
//             </>
//           )}
//         </DialogBody>
//         <DialogFooter>
//           <Button variant="text" color="red" onClick={handleOpen}>
//             Close
//           </Button>
//         </DialogFooter>
//         </>
//     )
// }

// export default ModelComplaint