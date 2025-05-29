import React from 'react'
import Layout from '../layouts/Layout'
import SearchBar from '../components/SearchBar'

const Home = () => {
  return (
    <div>
      <Layout>
        <div className='w-[80%] mx-auto py-5'>
        <SearchBar />
        </div>
      </Layout>
    </div>
  )
}

export default Home
