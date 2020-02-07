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

    const product = new Product(title,price,description,imageUrl);
    product.save().then(result=>{
        //console.log(result)
        console.log('Created product');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

  
};

exports.getEditProduct=(req,res,next)=>{

    // get quary para meters
    const editMode = req.query.edit;
    if(!editMode){
        console.log('edit mode off')
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product=>{
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
       }).catch(err => console.log(err));
    
};

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDescription,
        updatedImageUrl,
        prodId
    );

    product.save()
        .then(result=>{
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
     
};
 
exports.postDeleteProduct = (req,res,next)=>{
    prodId= req.body.productId;
    Product.deleteById(prodId)
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err=> console.log(err));

}

exports.getProducts = (req,res,next) => {
    Product.fetchAll()
        .then(products=>{
            res.render('admin/products', { 
                prods: products, 
                pageTitle: 'Admin Products', 
                path: '/admin/products', 
                
            });
        })
        .catch(err=>console.log(err));
}