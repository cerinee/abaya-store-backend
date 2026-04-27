const category = require('../models/category');

//get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const allCategories = await category.find();
        res.status(200).json(allCategories);
    } catch (err) {
        res.status(500).json({ message: err.message });

    }
}

//get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id; // get category ID from URL parameters
        const foundCategory = await category.findById(categoryId); // find category by ID
        if (!foundCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(foundCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// create category for admin only
exports.addcategory = async (req, res) => {
  try {
    const { name } = req.body;
    // check if category exists
    const existing = await category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // get image
    const image = req.file ? req.file.filename : null;

    // create category
    const newCategory = new category({name, image});
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// delete category for admin only
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await category.findByIdAndDelete(req.params.id); // get category ID from URL parameters
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// update a category for admin only
exports.editCategory = async (req, res) => {
  try {
    // build update object
    const updateData = { ...req.body };

    // handle image update
    if (req.file) {
      updateData.image = req.file.filename; // replace old image
    }

    const updatedCategory = await category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
