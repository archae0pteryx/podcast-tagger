import dynamic from 'next/dynamic'

const PeaksAudioDyn = dynamic(() => import('../components/Peaks').then(mod => mod.PeaksAudio), {
  ssr: false,
})

export default function Home() {
  // const json = await getData()
  return (
    <main>
      <PeaksAudioDyn />
    </main>
  )
}

// async function getData() {
//   const data = await fetch('http://localhost:3000/api/s3', {
//     method: 'POST',
//     body: 'output/json/sn-906.json',
//   })
//   const json = await data.json()
//   return json
// }
