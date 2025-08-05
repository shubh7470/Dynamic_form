
import DynamicFormData from "../models/student.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";


const createFormData = async (req, res, next) => {
  try {
    const { formType } = req.body;
    console.log("REQ.BODY:", req.body);

    if (!formType) {
      throw new ApiError(400, "formType is required");
    }

    const bodyData = { ...req.body };

    // Parse booleans
    ['isActive', 'isRegistered', 'completedCourse'].forEach((field) => {
      if (bodyData[field] !== undefined) {
        bodyData[field] = bodyData[field] === 'true';
      }
    });

    // Handle file uploads (file paths)
    if (req.files?.studentPhoto?.[0]) {
      bodyData.studentPhoto = `/assets/${req.files.studentPhoto[0].filename}`;
    }
    if (req.files?.signature?.[0]) {
      bodyData.signature = `/assets/${req.files.signature[0].filename}`;
    }
    if (req.files?.documents?.[0]) {
      bodyData.documents = `/assets/${req.files.documents[0].filename}`;
    }

    // Convert bodyData to fieldsData array
    const fieldsData = Object.entries(bodyData)
      .filter(([key]) => key !== 'formType') // remove formType
      .map(([key, value]) => ({
        name: key,
        value: value,
      }));

    // Save to DB
    const saved = await DynamicFormData.create({
      formType,
      fieldsData,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, saved, "Form data submitted successfully"));
  } catch (error) {
    return next(error);
  }
};


// Update Form Data
const updateFormData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fieldsData } = req.body;
    console.log(`PUT /form-data/${id} body:`, req.body);

    if (!fieldsData || !Array.isArray(fieldsData)) {
      throw new ApiError(400, "Valid fieldsData is required");
    }

    const formData = await DynamicFormData.findById(id);
    if (!formData) {
      throw new ApiError(404, "Form data not found");
    }

    formData.fieldsData = fieldsData;
    await formData.save();

    return res
      .status(200)
      .json(new ApiResponse(200, formData, "Form data updated successfully"));
  } catch (error) {
    return next(error);
  }
};

// Get All Form Data (Optional: Filter by formType)
const getAllFormData = async (req, res) => {
  try {
    const { formType } = req.params;

    if (!formType) {
      return res.status(400).json({
        success: false,
        message: "formType is required",
      });
    }

    const data = await DynamicFormData.find({ formType });

    return res.status(200).json({
      success: true,
      message: "Form data list fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error in getAllFormData:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching form data",
      error: error.message,
    });
  }
};
// Delete Form Data
const deleteFormData = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("DELETE /form-data/:id with id:", id);

    const formData = await DynamicFormData.findById(id);
    if (!formData) {
      throw new ApiError(404, "Form data not found");
    }

    await formData.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Form data deleted successfully"));
  } catch (error) {
    return next(error);
  }
};

export {
  createFormData,
  updateFormData,
  getAllFormData,
  deleteFormData,
};
