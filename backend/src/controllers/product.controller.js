import { Product } from "../models/product.model.js";

const postProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, subCategory, sizes, bestSeller } = req.body;

        if(!name || !description || !price || !image || !category || !subCategory || !sizes){
            return res.status(400).json({
                message: "All product fields are required"
            });
        }

         const existing = await Product.findOne({name});
            if(existing) return res.status(400).json({
                message: "Product already exist"
            });

            // create product
            const product = await Product.create({
                name,
                description,
                price,
                image,
                category,
                subCategory,
                sizes,
                bestSeller
            });

            res.status(201).json({
                message: "Product created successfully", product
            });
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error});
    }
}

const getProducts = async (req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json({
            message: "Product gotten successfully",
            product
        })
    } catch (error) {
         res.status(500).json({message: "Internal Server Error", error});
    }
};

const updateProduct = async (req, res) => {
    try {
         // Basic validation to check if the body is empty
         if(Object.keys(req.body).length === 0){
            res.status(400).json({
                message: "No data provided for update"
            })
         };

        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true} );
        if(!product) return res.status(404).json({message: "Product was not found"});

        res.status(200).json({
            message: "Product updated successfully", product
        })
    } catch (error) {
         res.status(500).json({message: "Internal Server Error", error});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product) return res.status(404).json({
            message: "Product was not found"
        })

        res.status(200).json({
            message: "product deleted successfully"
        })
    } catch (error) {
         res.status(500).json({message: "Internal Server Error", error});
    }
}

export {
    postProduct,
    getProducts,
    updateProduct,
    deleteProduct
}