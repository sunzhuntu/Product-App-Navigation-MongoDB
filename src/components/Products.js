import React from 'react'
import ProductForm from './ProductForm'
import {Link} from 'react-router-dom'
import Button from './Button'
import productService from '../services/products'

const contentStyle = {
    backgroundColor: 'white',
    color: '#800000',
    padding: 10,
    margin: 20,
    fontSize: 16
}

const Products = ({products, user, updateProductHandler}) => {

    const deleteProduct = (id) => {
       productService.deleteProduct(id).then(
        returnedData => {
          console.log('the returned product is: ', returnedData)
          const updatedProducts = products.filter(product => product.id !== id)
          updateProductHandler(updatedProducts)
        }
       )
    }
  
    return(
      <div style={contentStyle}>
        <h3> Display Existing Products </h3>
        <ul>
            {products.map(product => 
              <li key={product.id}>
                <Link to={`/products/${product.id}`}>{product.title}</Link>
                {
                  user !== null
                  ? <Button text="Delete" eventHandler={() => deleteProduct(product.id)}/> 
                  : null
                }
              </li>
            )}
        </ul>
        {user !== null
          ?<ProductForm products={products} updateProductHandler={updateProductHandler}/>
          :null
        }
      </div> 
    )
}

export default Products