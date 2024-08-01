import mongoose from 'mongoose'
import FollowUp from '../models/followUp.js'
import { createError } from '../utils/error.js'
import Lead from '../models/lead.js'

export const getFollowUp = async (req, res, next) => {
    try {

        const { followUpId } = req.params
        const findedFollowUp = await FollowUp.findById(followUpId).populate({
            path: 'leadId',
            populate: {
                path: 'client'
            }
        })
        if (!findedFollowUp) return next(createError(400, 'FollowUp not exist'))

        res.status(200).json({ result: findedFollowUp, message: 'followUp created successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const getFollowUps = async (req, res, next) => {
    try {
        const { leadId } = req.params
        const findedFollowUp = await FollowUp.find({ leadId }).populate({
            path: 'leadId',
            populate: {
                path: 'client'
            }
        })

        res.status(200).json({ result: findedFollowUp, message: 'followUp created successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const getEmployeeFollowUps = async (req, res, next) => {
    try {
        const { leadId } = req.params;

        // Find all follow-ups related to the given leadId
        const allFollowUps = await FollowUp.find({ leadId }).populate('leadId');

        const employeeFollowUps = allFollowUps.filter((followUp) => followUp.leadId?.allocatedTo?.findIndex(allocatedTo => allocatedTo.toString() == req.user?._id.toString()) != -1)

        res.status(200).json({ result: employeeFollowUps, message: 'FollowUps retrieved successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const getEmployeeFollowUpsStats = async (req, res, next) => {
    try {
        const allFollowUps = await FollowUp.find()
            .populate({
                path: 'leadId',
                match: { isArchived: false },  // Only include leads that are not archived
                populate: [
                    { path: 'client' },
                    { path: 'property' },
                    { path: 'allocatedTo' }
                ]
            })
            .exec();

        const filteredFollowUps = allFollowUps.filter(followUp =>
            followUp.leadId?.allocatedTo.some(emp => emp._id.toString() === req.user?._id.toString())
        );

        const latestFollowUpsByLead = filteredFollowUps.reduce((result, followUp) => {
            const leadId = followUp.leadId?._id.toString();
            
            if (!result[leadId] || new Date(followUp.followUpDate) > new Date(result[leadId].followUpDate)) {
                result[leadId] = followUp;
            }
            
            return result;
        }, {});

        const latestFollowUpsArray = Object.values(latestFollowUpsByLead);

        const groupedByDate = latestFollowUpsArray.reduce((result, followUp) => {
            const followUpDate = new Date(followUp.followUpDate).toLocaleDateString();

            let existingDateGroup = result.find(item => item.date === followUpDate);
            if (!existingDateGroup) {
                existingDateGroup = { date: followUpDate, followUps: [] };
                result.push(existingDateGroup);
            }

            existingDateGroup.followUps.push(followUp);
            return result;
        }, []);

        res.status(200).json({ result: groupedByDate, message: "Stats fetched successfully.", success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const getFollowUpsStats = async (req, res, next) => {
    try {
        const followUps = await FollowUp.find()
            .populate({
                path: 'leadId',
                match: { isArchived: false },  // Only include leads that are not archived
                populate: [
                    { path: 'client' },
                    { path: 'property' },
                    { path: 'allocatedTo' },
                ],
            }).exec();

        // Remove follow-ups with null leadId (filtered out because of isArchived: false)
        const validFollowUps = followUps.filter(followUp => followUp.leadId !== null);

        const latestFollowUpsByLead = validFollowUps.reduce((result, followUp) => {
            const leadId = followUp.leadId?._id.toString();
            
            if (!result[leadId] || new Date(followUp.followUpDate) > new Date(result[leadId].followUpDate)) {
                result[leadId] = followUp;
            }
            
            return result;
        }, {});

        const latestFollowUpsArray = Object.values(latestFollowUpsByLead);

        const groupedByDate = latestFollowUpsArray.reduce((result, followUp) => {
            const followUpDate = new Date(followUp.followUpDate).toLocaleDateString();

            let existingDateGroup = result.find(item => item.date === followUpDate);
            if (!existingDateGroup) {
                existingDateGroup = { date: followUpDate, followUps: [] };
                result.push(existingDateGroup);
            }

            existingDateGroup.followUps.push(followUp);
            return result;
        }, []);

        res.status(200).json({ result: groupedByDate, message: "Stats fetched successfully.", success: true });
    } catch (error) {
        next(createError(500, error.message));
    }
}

export const createFollowUp = async (req, res, next) => {
    try {

        const { status, followUpDate, remarks, } = req.body
        if (!status || !followUpDate || !remarks)
            return next(createError(400, 'Make sure to provide all the fields'))

        const newFollowUp = await FollowUp.create(req.body)
        const UpdatedLeadStatus = await Lead.findByIdAndUpdate(newFollowUp.leadId, { status: status }, { new: true })

        res.status(200).json({ result: newFollowUp && UpdatedLeadStatus, message: 'followUp created successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const deleteFollowUp = async (req, res, next) => {
    try {

        const { followUpId } = req.params
        const findedFollowUp = await FollowUp.findById(followUpId)
        if (!findedFollowUp) return next(createError(400, 'FollowUp not exist'))

        const deletedFollowUp = await FollowUp.findByIdAndDelete(followUpId)
        res.status(200).json({ result: deletedFollowUp, message: 'followUp deleted successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const deleteWholeCollection = async (req, res, next) => {
    try {

        const result = await FollowUp.deleteMany()
        res.status(200).json({ result, message: 'FollowUp collection deleted successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}