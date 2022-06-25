import React, { Component } from 'react';
import '../assets/css/product.css';

class Product extends Component {
    render() {
        return (
            <div className="product font-family-1">
                <div className="like-badge">
                    <i className="fa fa-heart"></i>
                    <span>8</span>
                </div>
            </div>
        );
    }
}

export default Product;