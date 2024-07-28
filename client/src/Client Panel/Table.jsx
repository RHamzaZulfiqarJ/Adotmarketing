import React, { useEffect } from "react";
import { Box, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Loader } from "../utils";
import Snackbar from "@mui/material/Snackbar";
import { IoOpenOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getLeadByPhone } from "../redux/action/lead";
import { format } from "timeago.js";
import ViewAttachments from "./ViewAttachments";

const Table = () => {
  //////////////////////////////////////// VARIABLES ///////////////////////////////////

  const dispatch = useDispatch();
  const { leads, isFetching, error } = useSelector((state) => state.lead);
  const { loggedUser } = useSelector((state) => state.user);
  const phoneNumber = loggedUser?.phone;
  console.log(leads);

  const columns = [
    {
      field: "uid",
      headerName: "ID",
      width: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip arrow placement="bottom" title={params.row?.uid}>
          <div className="font-primary font-light capitalize">{params.row?.uid}</div>
        </Tooltip>
      ),
    },
    {
      field: "allocatedTo?.firstName",
      headerName: "Employee Name",
      width: 190,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip arrow placement="bottom" title={params.row?.allocatedTo[0]?.firstName}>
          <div className="font-primary font-light capitalize">{params.row?.allocatedTo[0]?.firstName}</div>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 170,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip arrow placement="bottom" title={format(params.row?.createdAt)}>
          <div className="font-primary font-light capitalize">{format(params.row?.createdAt)}</div>
        </Tooltip>
      ),
    },
    {
      field: "property?.title",
      headerName: "Project",
      width: 160,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip arrow placement="bottom" title={params.row?.property?.title}>
          <div className="font-primary font-light capitalize">{params.row?.property?.title}</div>
        </Tooltip>
      ),
    },
    {
      field: "followUp?.followUpDate",
      headerName: "Next Follow Up Date",
      width: 220,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip arrow placement="bottom" title={params.row?.followUp?.followUpDate}>
          <div className="font-primary font-light capitalize">{params.row?.followUp?.followUpDate}</div>
        </Tooltip>
      ),
    },

    {
      field: "followUp?.remarks",
      headerName: "Remarks",
      width: 300,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip arrow placement="bottom" title={params.row?.followUp?.remarks}>
          <div className="font-primary font-light capitalize">{params.row?.followUp?.remarks}</div>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <span
          className={`border-[1px] px-[8px] py-[4px] rounded-full capitalize font-primary font-medium 
          ${params.row?.status == "closedWon" ? "border-green-500 text-green-500" : ""} 
          ${params.row?.status == "closedLost" ? "border-red-400 text-red-400" : ""} 
          ${params.row?.status == "followUp" ? "border-sky-400 text-sky-400" : ""}
          ${
            params.row?.status == "contactedClient" ? "border-orange-400 text-orange-400" : ""
          } 
          ${params.row?.status == "callNotAttend" ? "border-lime-400 text-lime-500" : ""} 
          ${params.row?.status == "visitSchedule" ? "border-teal-400 text-teal-500" : ""} 
          ${params.row?.status == "visitDone" ? "border-indigo-400 text-indigo-500" : ""}
          ${params.row?.status == "newClient" ? "border-rose-700 text-rose-700" : ""}`}>

          <span>
            {params.row?.status == "closedWon" ? <div>Closed Won</div> : <div></div>}
            {params.row?.status == "closedLost" ? <div>Closed Lost</div> : <div></div>}
            {params.row?.status == "followUp" ? <div>Follow Up</div> : <div></div>}
            {params.row?.status == "ContactedClient" ? (
              <div>Contacted Client</div>
            ) : (
              <div></div>
            )}
            {params.row?.status == "callNotAttend" ? <div>Call Not Attend</div> : <div></div>}
            {params.row?.status == "visitSchedule" ? <div>Visit Schedule</div> : <div></div>}
            {params.row?.status == "visitDone" ? <div>Visit Done</div> : <div></div>}
            {params.row?.status == "newClient" ? <div>New Client</div> : <div></div>}
          </span>
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div>
          <Tooltip placement="bottom" arrow title="View Attachments">
            <div onClick={() => handleOpenAttachments(params.row?._id)} className="cursor-pointer">
              <IoOpenOutline className="cursor-pointer text-orange-500 text-[23px] hover:text-orange-400" />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  //////////////////////////////////////// STATES //////////////////////////////////////
  const [searchValue, setSearchValue] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [openAttachments, setOpenAttachments] = useState(false);
  const [state, setState] = React.useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = state;

  //////////////////////////////////////// USEEFFECTS //////////////////////////////////
  useEffect(() => {
    dispatch(getLeadByPhone(phoneNumber));
  }, []);

  //////////////////////////////////////// FUNCTIONS ///////////////////////////////////
  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleOpenAttachments = (leadId) => {
    setSelectedLeadId(leadId);
    setOpenAttachments(true);
  };

  return (
    <div className="w-full">
      {isFetching && (
        <div className="w-full h-[11rem] flex justify-center items-center ">
          <Loader />
        </div>
      )}
      {error && (
        <Box sx={{ width: 500 }}>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={error ? handleClick({ vertical: "bottom", horizontal: "right" }) : error}
            onClose={handleClose}
            message={error == "Request failed with status code 400" ? "No Lead Found" : error}
            key={vertical + horizontal}
          />
        </Box>
      )}
      {!isFetching && (
        <div className="flex flex-col gap-[8px]">
          <Box
            sx={{
              justifyContent: "center",
              boxShadow: "none",
              border: "1px solid #f6f9fa",
              "& .super-app-theme--header": {
                color: "#20aee3",
                fontFamily: "Montserrat, sans-serif",
              },
            }}>
            <DataGrid
              className="bg-white rounded-[6px] p-[15px]"
              rows={leads}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              getRowId={(row) => row._id}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              disableColumnMenu
              disableSelectionOnClick
            />
          </Box>
        </div>
      )}

      <ViewAttachments
        open={openAttachments}
        setOpen={setOpenAttachments}
        leadId={selectedLeadId}
      />

    </div>
  );
};

export default Table;
