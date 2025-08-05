import DynamicForm from "../models/dynamicform.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  Create Form Config
const createForm = asyncHandler(async (req, res) => {
  try {
  
    const { formType, fields } = req.body;
    if (!formType || !fields || !Array.isArray(fields) || fields.length === 0) {
      throw new ApiError(400, "formType and fields are required");
    }

    for (const field of fields) {
      if (!field.name || !field.label || !field.placeholder || !field.type || field.order === undefined) {
        throw new ApiError(400, "Each field must have name, label, placeholder, type, and order");
      }
    }

    let existingForm = await DynamicForm.findOne({ formType });

    if (existingForm) {
      //  Merge logic to update fields by name
      const updatedFieldsMap = {};

      // Add existing fields to map
      existingForm.fields.forEach((f) => {
        updatedFieldsMap[f.name] = f;
      });

      // Override or add new fields
      fields.forEach((f) => {
        updatedFieldsMap[f.name] = f;
      });

      // Convert map back to array
      const mergedFields = Object.values(updatedFieldsMap);

      existingForm.fields = mergedFields;
      await existingForm.save();

      return res.status(200).json(
        new ApiResponse(200, existingForm, "Form updated with new fields successfully")
      );
    }

    //  Create if not exist
    const form = await DynamicForm.create({ formType, fields });
    res.status(201).json(new ApiResponse(201, form, "Form configuration created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});


//  Update Form Config
const updateForm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { formType, fields } = req.body;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      throw new ApiError(400, "Fields must be a non-empty array");
    }

    for (const field of fields) {
      if (!field.name || !field.label || !field.placeholder || !field.type || field.order === undefined) {
        throw new ApiError(400, "Each field must have name, label, placeholder, type, and order");
      }
    }

    const existingForm = await DynamicForm.findById(id);
    if (!existingForm) {
      throw new ApiError(404, "Form configuration not found");
    }

    // Merge logic for update
    const updatedFieldsMap = {};
    existingForm.fields.forEach(f => {
      updatedFieldsMap[f.name] = f;
    });
    fields.forEach(f => {
      updatedFieldsMap[f.name] = f;
    });

    existingForm.fields = Object.values(updatedFieldsMap);
    if (formType) {
      existingForm.formType = formType;
    }

    await existingForm.save();

    res.status(200).json(
      new ApiResponse(200, existingForm, "Form configuration updated successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});


// Get Form by Form Type
const getFormByType = asyncHandler(async (req, res) => {
  try {
    const { formType } = req.params;

    if (!formType) {
      throw new ApiError(400, "Form type is required");
    }

    const form = await DynamicForm.findOne({ formType });

    if (!form) {
      throw new ApiError(404, `Form of type '${formType}' not found`);
    }

    res.status(200).json(new ApiResponse(200, form, "Form fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export {
  createForm,
  updateForm,
  getFormByType,
};