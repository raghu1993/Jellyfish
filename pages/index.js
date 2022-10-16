import Head from 'next/head'
import Weather from '../components/weatherCard'
export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>WeatherApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <span   className='title-color'>Jellyfish!</span>
        </h1>

        <Weather />
      </main>

    </div>
  )
}
