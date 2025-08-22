// controllers/pageController.js

const DynamicPageModel = require('../model/DynamicPage.model.js'); 

/**
 * @desc    Add a new dynamic page
 * @route   POST /api/add-new-page
 * @returns {Object} Response object containing success status and message
 * @access  Private (e.g., admin access required)
 */

const addNewPage = async (req, res) => {
    try {
        const newPageData = req.body;
        if (!newPageData.id || !newPageData.title || !newPageData.sections) {
            return res.status(400).json({
                status: "Error",
                success: false,
                message: 'Missing required page data: id, title, or sections.'
            });
        }

        // Create a new page instance using the Mongoose model
        const newPage = new DynamicPageModel(newPageData);

        // Save the page to the database
        const savedPage = await newPage.save();

        // Send a success response
        res.status(201).json({
            success: true,
            message: 'Dynamic page added successfully!',
            page: savedPage
        });

    } catch (error) {
        // Handle errors during save (e.g., validation errors from pre-save middleware, duplicate ID)
        console.error('Error adding new page:', error);

        // Mongoose validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: "Error",
                success: false,
                message: error.message 
            });
        }
        // Duplicate key error (e.g., if 'id' is not unique)
        if (error.code === 11000) {
            return res.status(400).json({
                status: "Error",
                success: false,
                message: 'A page with this ID already exists. Please use a unique ID.'
            });
        }

        // Generic server error
        res.status(500).json({
          status: "Error",
            success: false,
            message: 'Failed to add dynamic page. Please try again later.',
            error: error.message // Send error message for debugging in development
        });
    }
};

let getPage = async (req,res) =>{
    try {
        const pageSlug = req.params.slug; 

        // Find the page by Slug
        if (!pageSlug) {    
            return res.status(400).json({
                status: "Error",
                success: false,
                message: 'Page slug is required.'
            });
        }
        const page = await DynamicPageModel.findOne({ slug: pageSlug });

        if (!page) {
            return res.status(404).json({
                status: "Error",
                success: false,
                message: 'Page not found.'
            });
        }

        // Return the found page
        res.status(200).json({
            success: true,
            message: 'Page retrieved successfully.',
            page: page
        });

    } catch (error) {
        console.error('Error retrieving page:', error);
        res.status(500).json({
            status: "Error",
            success: false,
            message: 'Failed to retrieve page. Please try again later.',
            error: error.message // Send error message for debugging in development
        });
    }
}


let editPage = async() => {
try {
        const pageSlug = req.params.slug; 

        // Find the page by Slug
        if (!pageSlug) {    
            return res.status(400).json({
                status: "Error",
                success: false,
                message: 'Page slug is required.'
            });
        }
        const page = await DynamicPageModel.findOne({ slug: pageSlug });

        if (!page) {
            return res.status(404).json({
                status: "Error",
                success: false,
                message: 'Page not found.'
            });
        }

        const data= req.body;
        const updatedPage = await DynamicPageModel.updateOne({ slug: pageSlug },{$set: {
            title: data.title,
            sections: data.sections
        }})

        if(updatedPage){
            return res.status(200).json({
                status: "Success",
                success: true,
                message: 'Page  updated successfully.'
            });
        }
        else{
            return res.status(404).json({
                status: "Error",
                success: false,
                message: 'Failed to update page!  Please try again later...'
            });
        }

    } catch (error) {
        console.error('Error updating page:', error);
        res.status(500).json({
            status: "Error",
            success: false,
            message: 'Failed to update page. Please try again later.',
            error: error.message // Send error message for debugging in development
        });
    }
}

let checkPageExists = async (req, res) => {
    try {
        const pageTitle = req.query.title; 

        if (!pageTitle) {    
            return res.status(400).json({
                status: "Error",
                success: false,
                message: 'Page title is required.'
            });
        }
        const page = await DynamicPageModel.findOne({ title: pageTitle });

        if (!page) {
            return res.status(404).json({
                status: "Error",
                success: false,
                message: 'Page not found.'
            });
        }

    
        res.status(200).json({
            success: true,
            message: 'Page retrieved successfully.',
            page: page
        });

    } catch (error) {
        console.error('Error checking page existence:', error);
        res.status(500).json({
            status: "Error",
            success: false,
            message: 'Failed to check page existence. Please try again later.',
            error: error.message // Send error message for debugging in development
        });
    }
};


module.exports = {
    addNewPage,
    getPage,
    checkPageExists,
    editPage
};