const Product = require('../models/product');

exports.getAddProduct=(req,res,next)=>{
    res.render('admin/edit-product',
    {layout:false,
    pageTitle:'Add Product',
     path:"/admin/add-product",
     editing:false
    })
};

exports.postAddProduct = (req,res,next)=>{

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product(null,title,imageUrl,description,price);
   // console.log(req.body.title);
    product.save()
    .then(()=>{
        res.redirect('/')
    })
    .catch(err => console.log(err));
    
}

exports.getEditProduct=(req,res,next)=>{
   // console.log('came here');
    // get quary para meters
    const editMode = req.query.edit;
    if(!editMode){
        console.log('edit mode off')
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    Product.findById(prodId,product=>{
     //   console.log(prodId)
      //  console.log(product)
        //if there is no such product
        if(!product){
            console.log('sry')
            return res.redirect('/');
        }
        // product is exsist
        res.render('admin/edit-product',
            {
            pageTitle:'Edit Product',
            path:"/admin/edit-product",
            editing:editMode,
            product:product
            }
        );
    })
    
};

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(prodId,updatedTitle,updatedImageUrl,updatedDescription,updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products')
};

exports.postDeleteProduct = (req,res,next)=>{
    prodId= req.body.productId;
    //console.log('came to controller postDelete')
    Product.deleteById(prodId);
    res.redirect('/admin/products');

}

exports.getProducts = (req,res,next) => {
    Product.fetchAll(products=>{
        res.render('admin/products', { 
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products', 
            
        });
    });
}