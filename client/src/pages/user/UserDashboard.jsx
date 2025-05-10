import React from 'react'
import Layout from '../../layouts/Layout'

const UserDashboard = () => {
  return (
    <div>
      <Layout>
        <h1 className="text-3xl font-bold underline">User Dashboard</h1>
        <p className="text-lg">Welcome to the User Dashboard!</p>
        <p className="text-lg">You can manage your profile and settings here.</p>
      </Layout>
    </div>
  )
}

export default UserDashboard
