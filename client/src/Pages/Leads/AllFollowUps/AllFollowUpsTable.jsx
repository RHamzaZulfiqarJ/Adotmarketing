import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowUpsStats, getEmployeeFollowUpsStats } from "../../../redux/action/followUp";
import Lead from "../Lead";
import moment from "moment";
import { Table } from "../../../Components";
import { Tooltip } from "@mui/material";
import { IoOpenOutline } from "react-icons/io5";
import { getLeadReducer } from "../../../redux/reducer/lead";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../../utils";

const AllFollowUpsTable = () => {
  /////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////
  const dispatch = useDispatch();
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { followUpsStats, isFetching } = useSelector((state) => state.followUp);
  const { loggedUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  /////////////////////////////////////////////////// STATES ////////////////////////////////////////////////
  const [showLead, setShowLead] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(false);

  /////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////
  useEffect(() => {
    loggedUser.role == "employee"
      ? dispatch(getEmployeeFollowUpsStats())
      : dispatch(getFollowUpsStats());
  }, []);

  /////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////
  const createData = (date, day, followUps = []) => {
    return {
      date,
      day,
      totalFollowUps: followUps.length,
      followUps,
    };
  };

  const rows = followUpsStats?.map((stat) => {
    const dateParts = stat.date.split("/");
    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-based
    const day = parseInt(dateParts[0]);
    const date = new Date(year, month, day);

    return createData(stat.date, DAYS[date.getDay()], stat.followUps);
  });

  const currentDate = new Date();
  const sortedRow = rows
    // .filter((item) => moment(item.date, "DD/MM/YYYY").isSameOrBefore(currentDate, "day")) // Filter out dates greater than current date
    .sort((a, b) => moment(a.date, "DD/MM/YYYY").diff(moment(b.date, "DD/MM/YYYY"))) // Sort by date
    .reverse(); // Reverse the order so that latest date comes first

  // const sortedRow = rows
  // .filter(item => new Date(item.date) <= currentDate) // Filter out dates greater than current date
  // .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
  // .reverse()  // Reverse the order so that latest date comes first

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 70,
      renderCell: (params) => <div className="font-primary font-light">{params.row.uid}</div>,
    },
    {
      field: "leadId?.source",
      headerName: "Source",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <Tooltip title={params.row.leadId?.source} placement="top">
          <div className="font-primary font-light capitalize">{params.row.leadId?.source}</div>
        </Tooltip>
      ),
    },
    {
      field: "leadId?.property",
      headerName: "Project",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <Tooltip title={params.row?.leadId?.project?.title} placement="top">
          <div className="font-primary font-light capitalize">{params.row?.leadId?.property}</div>
        </Tooltip>
      ),
    },
    {
      field: "leadId?.city",
      headerName: "City",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <Tooltip title={params.row.leadId?.city} placement="top">
          <div className="font-primary font-light capitalize">{params.row.leadId?.city}</div>
        </Tooltip>
      ),
    },
    {
      field: "leadId?.property?.title",
      headerName: "Country",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => (
        <Tooltip title={params.row.leadId?.property?.title} placement="top">
          <div className="font-primary font-light capitalize">{params.row.leadId?.property?.title}</div>
        </Tooltip>
      ),
    },
    {
      field: "leadId?.clientName",
      headerName: "Client Name",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <Tooltip title={params.row.leadId?.clientName} placement="top">
          <div className="font-primary font-light capitalize">{params.row.leadId?.clientName}</div>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Current Status",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row?.status} placement="top">
          <div className="font-primary font-light">{params.row.status}</div>
        </Tooltip>
      ),
    },
    {
      field: "followUpDate",
      headerName: "Next Follow Up",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => (
        <div className="font-primary font-light">
          {moment(params.row?.followUpDate).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      field: "createdat",
      headerName: "Created At",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <div className="font-primary font-light">
          {moment(params.row?.createdAt).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      width: 130,
      renderCell: (params) => (
        <div>
          <Tooltip placement="top" title="View">
            <div
              className="cursor-pointer"
              onClick={() => handleOpenViewModal(params.row?.leadId?._id)}>
              <IoOpenOutline className="cursor-pointer text-orange-500 text-[23px] hover:text-orange-400" />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleOpenViewModal = (leadId) => {
    dispatch(getLeadReducer(leadId));
    navigate(`/leads/${leadId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {isFetching ? (
        <div className="w-full h-[11rem] flex justify-center items-center ">
          <Loader />
        </div>
      ) : (
        <>
          {sortedRow.map((row) => (
            <div className="flex flex-col gap-2 ">
              <h2 className="text-primary-red text-[24px] capitalize font-light">
                {row.date} {row.day}
              </h2>
              <Table rows={row.followUps} columns={columns} rowsPerPage={10} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AllFollowUpsTable;
