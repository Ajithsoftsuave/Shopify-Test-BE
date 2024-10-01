import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ShopifyStore = sequelize.define('ShopifyStore', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    store_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
    },
    shop_id: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
    },
    shop_url: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
    },
    checkout_url: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    shopify_access_token:{
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
    },
    storefront_access_token:{
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: false, // Disable default timestamps (createdAt, updatedAt)
    tableName: 'shopify_store', // Specify the table name
});

const PaymentMethod = sequelize.define('paymentMethod', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    store_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{
    timestamps: true,
    tableName: 'payment_method'
})
const Cart = sequelize.define('cart', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
    },
    store_id: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.STRING(45), // Consider changing this to DATE if the format is compatible
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    original_cart_id: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: true,
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    
}, {
    timestamps: false, // Disable default timestamps (createdAt, updatedAt)
    tableName: 'cart', // Specify the table name
});
export { 
    PaymentMethod,
    ShopifyStore,
    Cart
};
