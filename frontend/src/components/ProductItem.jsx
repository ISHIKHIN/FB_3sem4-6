import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
    const isLowStock = product.stock < 5;

    return (
        <div className="productRow">
            <div className="productMain">
                <div className="productId">#{product.id}</div>
                <div className="productName">{product.name}</div>
                <div className="productCategory">{product.category}</div>
                <div className="productDescription">{product.description}</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                    <div className="productPrice">{product.price.toLocaleString()} ₽</div>
                    <div className={`productStock ${isLowStock ? 'productStock--low' : ''}`}>
                        На складе: {product.stock} шт.
                    </div>
                </div>
            </div>
            <div className="productActions">
                <button className="btn" onClick={() => onEdit(product)}>
                    Редактировать
                </button>
                <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
                    Удалить
                </button>
            </div>
        </div>
    );
}