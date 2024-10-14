async function getData() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/blastoise')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Home() {
  const data = await getData()
  console.log(data)
  return (
    <div>
      <p>{data.name}</p>
    </div>
  )
};