import React from 'react'
import Logout from '../../components/Logout'
import Layout from '../../layouts/Layout'

const SellerDashboard = () => {
  return (
    <div>
      <Layout>
        
        <h1 className="text-3xl font-bold underline">Seller Dashboard</h1>
        <p className="text-lg">Welcome to the Seller Dashboard!</p>
        <p className="text-lg">You can manage your products and orders here.</p>
      </Layout>

    </div>
  )
}

export default SellerDashboard
