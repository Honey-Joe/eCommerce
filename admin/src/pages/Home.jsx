import React from 'react'
import Layout from '../layouts/Layout'

const Home = () => {
  return (
    <div>
      <Layout>
        <h1 className="text-3xl font-bold underline">Home</h1>
        <p className="text-lg">Welcome to the Home Page!</p>
        <p className="text-lg">You can find the latest updates and news here.</p>
      </Layout>
    </div>
  )
}

export default Home
